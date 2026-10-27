/**
 * Investor / publisher contact Worker (Cloudflare Workers).
 *
 * The investor form posts here instead of straight to Formspree. For each
 * submission the Worker:
 *
 *   1. Answers CORS preflights and rejects origins not in ALLOWED_ORIGINS.
 *   2. Drops honeypot hits silently (reports success, sends nothing).
 *   3. Validates the fields the form collects.
 *   4. Verifies the Cloudflare Turnstile token (bot check).
 *   5. Applies the optional per-IP rate limit (RATE_LIMITER binding).
 *   6. Forwards the submission to Formspree, so the studio inbox still
 *      receives it. If that fails, the visitor gets an error and no
 *      confirmation is sent.
 *   7. Sends the confirmation email (src/email.js: HTML + plain text)
 *      to the visitor through Resend. A failure here is logged but
 *      doesn't fail the request: the submission is already safely in
 *      Formspree.
 *
 * Also serves the email's images from public/email/ as static assets
 * (wrangler.toml [assets]); POSTs to / fall through to this code.
 *
 * DRY_RUN=true skips both outbound sends (Formspree + Resend) and logs
 * what would have been sent, so the whole flow can be exercised locally
 * with `wrangler dev` before any accounts exist.
 *
 * Config (see wrangler.toml and .dev.vars.example):
 *   vars:    ALLOWED_ORIGINS, FROM_ADDRESS, REPLY_TO, DRY_RUN,
 *            EMAIL_ASSET_BASE (optional; defaults to this Worker's origin)
 *   secrets: TURNSTILE_SECRET, RESEND_API_KEY, FORMSPREE_ENDPOINT
 */

export const TYPES = ['investor', 'publisher']

// Generous caps: long enough for real messages, short enough that the
// Worker can't be used to relay large payloads.
const LIMITS = { name: 200, email: 254, phone: 50, company: 200, details: 5000 }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
import { SUBJECT, renderHtml, renderText } from './email.js'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const RESEND_URL = 'https://api.resend.com/emails'

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const allowed = allowedOrigins(env)
    const cors = allowed.includes(origin) ? corsHeaders(origin) : null

    if (request.method === 'OPTIONS') {
      return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 })
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, cors)
    }
    if (!cors) {
      return json({ ok: false, error: 'Origin not allowed' }, 403, null)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ ok: false, error: 'Invalid JSON' }, 400, cors)
    }

    // Honeypot: bots fill every field. Pretend it worked, send nothing.
    if (typeof body.website === 'string' && body.website.trim()) {
      return json({ ok: true }, 200, cors)
    }

    const result = validate(body)
    if (result.error) return json({ ok: false, error: result.error }, 400, cors)
    const submission = result.value

    const ip = request.headers.get('CF-Connecting-IP') || ''

    if (!(await verifyTurnstile(body.turnstileToken, ip, env))) {
      return json({ ok: false, error: 'Bot check failed. Please try again.' }, 403, cors)
    }

    if (env.RATE_LIMITER && ip) {
      const { success } = await env.RATE_LIMITER.limit({ key: ip })
      if (!success) return json({ ok: false, error: 'Too many submissions. Please try again later.' }, 429, cors)
    }

    const dryRun = env.DRY_RUN === 'true'

    if (dryRun) {
      console.log('[dry run] would forward to Formspree:', JSON.stringify(submission))
    } else {
      const forwarded = await forwardToFormspree(submission, env)
      if (!forwarded) {
        return json({ ok: false, error: 'Something went wrong. Please try again.' }, 502, cors)
      }
    }

    const assetBase = env.EMAIL_ASSET_BASE || new URL(request.url).origin
    const email = confirmationEmail(submission, env, assetBase)
    if (dryRun) {
      console.log('[dry run] would send confirmation:', JSON.stringify(email))
    } else {
      await sendConfirmation(email, env)
    }

    return json({ ok: true }, 200, cors)
  },
}

export function validate(body) {
  if (!body || typeof body !== 'object') return { error: 'Invalid submission.' }
  const str = (v) => (typeof v === 'string' ? v.trim() : '')
  const value = {
    name: str(body.name),
    email: str(body.email),
    phone: str(body.phone),
    type: str(body.type),
    company: str(body.company),
    details: str(body.details),
    source: str(body.source).slice(0, 100),
  }
  if (!value.name) return { error: 'Please enter your name.' }
  if (!EMAIL_RE.test(value.email)) return { error: 'Please enter a valid email address.' }
  if (!TYPES.includes(value.type)) return { error: 'Please choose investor or publisher.' }
  if (!value.company) return { error: 'Please enter your company or firm.' }
  if (!value.details) return { error: 'Please add some details.' }
  for (const [field, max] of Object.entries(LIMITS)) {
    if (value[field].length > max) return { error: `The ${field} field is too long.` }
  }
  return { value }
}

export function confirmationEmail(submission, env, assetBase) {
  return {
    from: `Kato.8 Studios <${env.FROM_ADDRESS}>`,
    to: [submission.email],
    reply_to: env.REPLY_TO,
    subject: SUBJECT,
    html: renderHtml(assetBase),
    text: renderText(),
  }
}

async function verifyTurnstile(token, ip, env) {
  if (typeof token !== 'string' || !token) return false
  const form = new FormData()
  form.append('secret', env.TURNSTILE_SECRET)
  form.append('response', token)
  if (ip) form.append('remoteip', ip)
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form })
    const data = await res.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return false
  }
}

async function forwardToFormspree(submission, env) {
  try {
    const res = await fetch(env.FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(submission),
    })
    if (!res.ok) console.error(`Formspree rejected the submission (${res.status})`)
    return res.ok
  } catch (error) {
    console.error('Formspree request failed:', error)
    return false
  }
}

async function sendConfirmation(email, env) {
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    })
    if (!res.ok) console.error(`Resend rejected the confirmation (${res.status}): ${await res.text()}`)
  } catch (error) {
    console.error('Resend request failed:', error)
  }
}

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...(cors || {}) },
  })
}
