/**
 * The confirmation email sent to investors / publishers after they submit
 * the contact form. Sent as HTML with a plain-text alternative (Resend
 * sends both; clients pick the one they can show).
 *
 * The HTML follows email-client rules rather than web rules: table layout,
 * inline styles, PNG images (Gmail and Outlook don't render SVG), absolute
 * image URLs, and a text label next to every icon so the email still reads
 * when images are blocked. It contains no visitor-supplied data, so there
 * is nothing to escape.
 *
 * Images are the Worker's own static assets (public/email/), so their URLs
 * are built from the Worker's origin unless EMAIL_ASSET_BASE overrides it.
 *
 * No link to the website: the visitor has just come from it. The social
 * links mirror the main site's SocialIcons (external-site
 * src/components/SocialIcons.jsx); the icons are its SVGs rendered to PNG.
 */

export const SUBJECT = 'Thanks for reaching out to Kato.8'

export const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/kato.8_studios/', icon: 'instagram.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@kato.8_studios', icon: 'tiktok.png' },
  { name: 'X', href: 'https://x.com/Kato8_Studios', icon: 'x.png' },
  { name: 'Bluesky', href: 'https://bsky.app/profile/kato-8.bsky.social', icon: 'bluesky.png' },
  { name: 'YouTube', href: 'https://www.youtube.com/@Kato.8Studios', icon: 'youtube.png' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/kato-8-studios/', icon: 'linkedin.png' },
]

const INTRO =
  "Thanks for reaching out to Kato.8 Studios. We've got your message, and someone from the team will get back to you within 2 business days. If it's time-sensitive, just reply to this email."
const FOLLOW = "In the meantime, you can follow along with what we're working on:"
const SIGN_OFF = 'The Kato.8 team'

// Main-site palette (external-site tokens.css).
const COBALT = '#1b1b26'
const PEARL = '#f5efef'
const PINK = '#e5718a'
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

export function renderText() {
  return `Hi there,

${INTRO}

${FOLLOW}

${SOCIALS.map((s) => `${s.name}: ${s.href}`).join('\n')}

${SIGN_OFF}
`
}

export function renderHtml(assetBase) {
  const img = (file) => `${assetBase.replace(/\/$/, '')}/email/${file}`

  // Two rows of three, so the icons fit a phone-width email.
  const cell = (s) => `
              <td align="center" width="96" style="padding:0 8px 16px;">
                <a href="${s.href}" target="_blank" style="color:${PEARL};text-decoration:none;font-family:${FONT};font-size:12px;line-height:16px;">
                  <img src="${img(s.icon)}" width="30" height="30" alt="" style="display:block;margin:0 auto 6px;border:0;">${s.name}
                </a>
              </td>`
  const socialRows = [SOCIALS.slice(0, 3), SOCIALS.slice(3)]
    .map((row) => `
                <tr>${row.map(cell).join('')}
                </tr>`)
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <title>${SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background:${PEARL};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">We've got your message. Someone from the team will get back to you within 2 business days.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PEARL};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:32px 32px 8px;">
              <img src="${img('kato8-logo.png')}" width="180" alt="Kato.8 Studios" style="display:block;width:180px;max-width:100%;height:auto;border:0;">
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 8px;font-family:${FONT};font-size:16px;line-height:24px;color:${COBALT};">
              <p style="margin:0 0 16px;">Hi there,</p>
              <p style="margin:0 0 16px;">${INTRO}</p>
              <p style="margin:0 0 24px;">${SIGN_OFF}</p>
            </td>
          </tr>
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:${PINK};">&nbsp;</td>
          </tr>
          <tr>
            <td align="center" style="background:${COBALT};padding:24px 16px 12px;">
              <p style="margin:0 0 16px;font-family:${FONT};font-size:14px;line-height:20px;color:${PEARL};">${FOLLOW}</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">${socialRows}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
