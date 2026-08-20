import { useState } from 'react'
import '../styles/investor-request-form.css'

/**
 * Investor-relations request form for the sandbox investor page.
 *
 * Self-contained: validation, submission, idle / submitting / success /
 * error states, honeypot for basic bot filtering. Modeled on the main
 * site's `PlaytestSignupForm` (same `.signup-form` markup and CSS, so it
 * inherits the shipped multi-field form styling from
 * `signup-form.css` — already imported globally in `main.jsx`).
 *
 * Not yet upstream: there is no investor form on external-site `main`,
 * so this lives in the sandbox as a vendored prototype for review (see
 * PROCESS.md §1b). Graduate it by copying this component + wiring a real
 * endpoint into external-site.
 *
 * Posts `{ name, email, company, investmentRange, message, source }` to
 * `VITE_INVESTOR_ENDPOINT` (typically a Formspree URL). If that env var
 * is unset the submit resolves successfully with no network call, so the
 * form is usable in the sandbox before a backend exists — same
 * convention as `NewsletterSignup` / `PlaytestSignupForm`.
 *
 * Props:
 *   - source?: string — identifier for where the form lives, sent with
 *     the payload for attribution (defaults to `'investors-page'`).
 *   - heading?: string — section heading. Pass `null` to omit.
 *   - description?: string — copy under the heading. Pass `null` to omit.
 */
export default function InvestorRequestForm({
  source = 'investors-page',
  heading = 'Request investor information',
  description = 'Tell us a little about yourself and we’ll follow up with our investor materials.',
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [investmentRange, setInvestmentRange] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (website) {
      setStatus('success')
      return
    }

    if (!name.trim()) {
      setStatus('error')
      setErrorMessage('Please enter your name.')
      return
    }
    const trimmedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!message.trim()) {
      setStatus('error')
      setErrorMessage('Please add a short message.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const endpoint = import.meta.env.VITE_INVESTOR_ENDPOINT
    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: trimmedEmail,
            company: company.trim(),
            investmentRange,
            message: message.trim(),
            source,
          }),
        })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
      } else {
        console.warn(`InvestorRequestForm: VITE_INVESTOR_ENDPOINT not set (source=${source}); skipping network call.`)
      }
      setStatus('success')
      setName('')
      setEmail('')
      setCompany('')
      setInvestmentRange('')
      setMessage('')
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <section className="signup-form signup-form--success investor-request-form" aria-live="polite">
        <p className="signup-form__success">
          Thanks for reaching out — we’ll be in touch with our investor materials.
        </p>
      </section>
    )
  }

  return (
    <section className="signup-form investor-request-form">
      {heading && <h2 className="signup-form__heading">{heading}</h2>}
      {description && <p className="signup-form__description">{description}</p>}
      <form className="signup-form__form" onSubmit={handleSubmit} noValidate>
        <label className="signup-form__honeypot" aria-hidden="true">
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>

        <label className="signup-form__field">
          <span className="signup-form__label">
            Name<span className="signup-form__required" aria-hidden="true">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={status === 'submitting'}
          />
        </label>

        <label className="signup-form__field">
          <span className="signup-form__label">
            Email address<span className="signup-form__required" aria-hidden="true">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={status === 'submitting'}
          />
        </label>

        <label className="signup-form__field">
          <span className="signup-form__label">Company / fund</span>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            disabled={status === 'submitting'}
          />
        </label>

        <label className="signup-form__field">
          <span className="signup-form__label">Investment range</span>
          <select
            name="investmentRange"
            value={investmentRange}
            onChange={(event) => setInvestmentRange(event.target.value)}
            disabled={status === 'submitting'}
          >
            <option value="">Prefer not to say</option>
            <option value="under-10k">Under $10k</option>
            <option value="10k-50k">$10k – $50k</option>
            <option value="50k-250k">$50k – $250k</option>
            <option value="250k-plus">$250k+</option>
          </select>
        </label>

        <label className="signup-form__field">
          <span className="signup-form__label">
            Message<span className="signup-form__required" aria-hidden="true">*</span>
          </span>
          <textarea
            name="message"
            required
            placeholder="Tell us about your interest in Kato.8."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={status === 'submitting'}
          />
        </label>

        <button type="submit" className="button" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send request'}
        </button>

        <p className="signup-form__status" role="status" aria-live="polite">
          {status === 'error' ? errorMessage : ''}
        </p>
      </form>
    </section>
  )
}
