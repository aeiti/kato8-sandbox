// Unit tests for the Worker, run with Node's built-in test runner
// (`npm test`). Outbound requests (Turnstile, Formspree, Resend) are
// intercepted by replacing globalThis.fetch, so nothing leaves the machine.

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/index.js'
import { SUBJECT, SOCIALS, renderHtml, renderText } from '../src/email.js'

const ORIGIN = 'https://kato8studios.com'
const TURNSTILE = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const FORMSPREE = 'https://formspree.io/f/test'
const RESEND = 'https://api.resend.com/emails'

const baseEnv = {
  ALLOWED_ORIGINS: `${ORIGIN},https://www.kato8studios.com`,
  FROM_ADDRESS: 'partners@kato8studios.com',
  REPLY_TO: 'terry@example.com',
  DRY_RUN: 'false',
  TURNSTILE_SECRET: 'secret',
  RESEND_API_KEY: 're_test',
  FORMSPREE_ENDPOINT: FORMSPREE,
}

const valid = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '',
  type: 'publisher',
  company: 'Acme Publishing',
  details: 'We would like to talk.',
  source: 'investors-page',
  turnstileToken: 'token',
}

let calls
let responses
const realFetch = globalThis.fetch

beforeEach(() => {
  calls = []
  // Default upstream behaviour: everything succeeds.
  responses = {
    [TURNSTILE]: () => Response.json({ success: true }),
    [FORMSPREE]: () => Response.json({ ok: true }),
    [RESEND]: () => Response.json({ id: 'email_1' }),
  }
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init })
    const handler = responses[String(url)]
    if (!handler) throw new Error(`unexpected fetch ${url}`)
    return handler(init)
  }
})

afterEach(() => {
  globalThis.fetch = realFetch
})

function post(body, { origin = ORIGIN, ip = '203.0.113.7' } = {}) {
  return new Request('https://worker.example/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const urls = () => calls.map((c) => c.url)

test('valid submission is forwarded to Formspree, then confirmed via Resend', async () => {
  const res = await worker.fetch(post(valid), baseEnv)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { ok: true })
  assert.deepEqual(urls(), [TURNSTILE, FORMSPREE, RESEND])

  const forwarded = JSON.parse(calls[1].init.body)
  assert.equal(forwarded.email, 'jane@example.com')
  assert.equal(forwarded.type, 'publisher')
  assert.equal(forwarded.turnstileToken, undefined, 'token is not forwarded')

  const email = JSON.parse(calls[2].init.body)
  assert.deepEqual(email.to, ['jane@example.com'])
  assert.equal(email.from, 'Kato.8 Studios <partners@kato8studios.com>')
  assert.equal(email.reply_to, 'terry@example.com')
  assert.equal(email.subject, SUBJECT)
  assert.equal(email.text, renderText())
  // Images default to the Worker's own origin (its static assets).
  assert.equal(email.html, renderHtml('https://worker.example'))
  assert.equal(calls[2].init.headers.Authorization, 'Bearer re_test')
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN)
})

const SOCIAL_URLS = [
  'https://www.instagram.com/kato.8_studios/',
  'https://www.tiktok.com/@kato.8_studios',
  'https://x.com/Kato8_Studios',
  'https://bsky.app/profile/kato-8.bsky.social',
  'https://www.youtube.com/@Kato.8Studios',
  'https://www.linkedin.com/company/kato-8-studios/',
]

test('confirmation copy has no em dashes', () => {
  for (const part of [SUBJECT, renderText(), renderHtml('https://a.example')]) {
    assert.ok(!part.includes('—'))
  }
})

test('both versions link every social profile, and not the website', () => {
  const html = renderHtml('https://a.example')
  const text = renderText()
  for (const url of SOCIAL_URLS) {
    assert.ok(text.includes(url), `text: ${url}`)
    assert.ok(html.includes(`href="${url}"`), `html: ${url}`)
  }
  for (const part of [text, html]) assert.ok(!part.includes('kato8studios.com'))
})

test('html: every icon is an absolute PNG under the asset base, labelled in text', () => {
  const html = renderHtml('https://assets.example/')
  for (const s of SOCIALS) {
    assert.match(s.icon, /\.png$/, 'email clients do not render SVG')
    assert.ok(html.includes(`src="https://assets.example/email/${s.icon}"`), s.icon)
    assert.ok(html.includes(`${s.name}\n`), `${s.name} label shows when images are blocked`)
  }
  assert.ok(html.includes('src="https://assets.example/email/kato8-logo.png"'))
  assert.ok(!/src="\//.test(html), 'no relative image URLs')
})

test('every image the email references exists in public/email', async () => {
  const fs = await import('node:fs')
  const html = renderHtml('https://a.example')
  const files = [...html.matchAll(/src="https:\/\/a\.example\/email\/([^"]+)"/g)].map((m) => m[1])
  assert.equal(files.length, SOCIALS.length + 1)
  for (const f of files) assert.ok(fs.existsSync(new URL(`../public/email/${f}`, import.meta.url)), f)
})

test('EMAIL_ASSET_BASE overrides the image host', async () => {
  await worker.fetch(post(valid), { ...baseEnv, EMAIL_ASSET_BASE: 'https://kato8studios.com' })
  const email = JSON.parse(calls.find((c) => c.url === RESEND).init.body)
  assert.equal(email.html, renderHtml('https://kato8studios.com'))
})

test('Formspree failure returns an error and sends no confirmation', async () => {
  responses[FORMSPREE] = () => new Response('nope', { status: 500 })
  const res = await worker.fetch(post(valid), baseEnv)
  assert.equal(res.status, 502)
  assert.deepEqual(urls(), [TURNSTILE, FORMSPREE])
})

test('Resend failure still reports success (submission already saved)', async () => {
  responses[RESEND] = () => new Response('bad key', { status: 401 })
  const res = await worker.fetch(post(valid), baseEnv)
  assert.equal(res.status, 200)
  assert.deepEqual(urls(), [TURNSTILE, FORMSPREE, RESEND])
})

test('failed Turnstile check sends nothing', async () => {
  responses[TURNSTILE] = () => Response.json({ success: false })
  const res = await worker.fetch(post(valid), baseEnv)
  assert.equal(res.status, 403)
  assert.deepEqual(urls(), [TURNSTILE])
})

test('missing Turnstile token is rejected without calling Turnstile', async () => {
  const res = await worker.fetch(post({ ...valid, turnstileToken: '' }), baseEnv)
  assert.equal(res.status, 403)
  assert.deepEqual(urls(), [])
})

test('honeypot hit reports success and sends nothing', async () => {
  const res = await worker.fetch(post({ ...valid, website: 'http://spam.example' }), baseEnv)
  assert.equal(res.status, 200)
  assert.deepEqual(urls(), [])
})

test('origin not on the allow list is rejected and gets no CORS header', async () => {
  const res = await worker.fetch(post(valid, { origin: 'https://aeiti.github.io' }), baseEnv)
  assert.equal(res.status, 403)
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), null)
  assert.deepEqual(urls(), [])
})

test('preflight from an allowed origin gets CORS headers', async () => {
  const req = new Request('https://worker.example/', { method: 'OPTIONS', headers: { Origin: ORIGIN } })
  const res = await worker.fetch(req, baseEnv)
  assert.equal(res.status, 204)
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN)
  assert.match(res.headers.get('Access-Control-Allow-Methods'), /POST/)
})

test('preflight from another origin is refused', async () => {
  const req = new Request('https://worker.example/', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } })
  const res = await worker.fetch(req, baseEnv)
  assert.equal(res.status, 403)
})

test('non-POST is rejected', async () => {
  const req = new Request('https://worker.example/', { method: 'GET', headers: { Origin: ORIGIN } })
  const res = await worker.fetch(req, baseEnv)
  assert.equal(res.status, 405)
})

test('invalid JSON is rejected', async () => {
  const res = await worker.fetch(post('{not json'), baseEnv)
  assert.equal(res.status, 400)
  assert.deepEqual(urls(), [])
})

for (const [label, patch, message] of [
  ['missing name', { name: ' ' }, /name/],
  ['bad email', { email: 'not-an-email' }, /email/],
  ['unknown type', { type: 'customer' }, /investor or publisher/],
  ['missing company', { company: '' }, /company/],
  ['missing details', { details: '' }, /details/],
  ['oversized details', { details: 'x'.repeat(5001) }, /too long/],
]) {
  test(`validation: ${label}`, async () => {
    const res = await worker.fetch(post({ ...valid, ...patch }), baseEnv)
    assert.equal(res.status, 400)
    assert.match((await res.json()).error, message)
    assert.deepEqual(urls(), [], 'nothing is sent for invalid input')
  })
}

test('phone is optional; investor type is accepted', async () => {
  const res = await worker.fetch(post({ ...valid, phone: '', type: 'investor' }), baseEnv)
  assert.equal(res.status, 200)
})

test('rate limiter blocks before anything is sent upstream', async () => {
  const env = { ...baseEnv, RATE_LIMITER: { limit: async ({ key }) => ({ success: key !== '203.0.113.7' }) } }
  const res = await worker.fetch(post(valid), env)
  assert.equal(res.status, 429)
  assert.deepEqual(urls(), [TURNSTILE], 'only the bot check ran')
})

test('DRY_RUN skips Formspree and Resend', async () => {
  const res = await worker.fetch(post(valid), { ...baseEnv, DRY_RUN: 'true' })
  assert.equal(res.status, 200)
  assert.deepEqual(urls(), [TURNSTILE])
})
