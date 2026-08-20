import InvestorRequestForm from '../components/InvestorRequestForm'
import Seo from '../components/Seo'
import { staticRoutes } from '../data/seo-config'
import '../styles/investors.css'

/**
 * Investor page prototype (PROCESS.md §1b — new page, not yet on
 * external-site `main`). A short investor-relations hero followed by the
 * `InvestorRequestForm`. The proposed "Investors" tab that links here
 * lives in the sandbox's vendored nav (SandboxNav / SandboxMobileMenu).
 *
 * Nav + Footer chrome come from App.jsx, so this renders only the page
 * body. Graduate by moving the page + form into external-site and
 * wiring a real form endpoint (VITE_INVESTOR_ENDPOINT).
 */
const HIGHLIGHTS = [
  {
    title: 'Original games',
    body: 'A slate of in-house titles in active development, built to grow a catalog rather than chase a single hit.',
  },
  {
    title: 'A community-first studio',
    body: 'Players follow the work early — playtests, newsletter, and crowdfunding keep the audience close from day one.',
  },
  {
    title: 'Early and hands-on',
    body: 'Come in at the ground floor and shape where Kato.8 goes next, with direct access to the team.',
  },
]

export default function InvestorsPage() {
  return (
    <main className="investors-page">
      <Seo path="/investors" {...staticRoutes['/investors']} />

      <header className="investors-hero">
        <p className="investors-hero_eyebrow">Investor Relations</p>
        <h1 className="investors-hero_title">Invest in Kato.8</h1>
        <p className="investors-hero_lead">
          Kato.8 is an independent game studio building original titles and the
          community around them. We’re opening early conversations with people
          who want to back that journey. Request our investor materials below and
          we’ll be in touch.
        </p>
      </header>

      <section className="investors-highlights" aria-label="Why Kato.8">
        {HIGHLIGHTS.map((item) => (
          <div key={item.title} className="investors-highlight">
            <h2 className="investors-highlight_title">{item.title}</h2>
            <p className="investors-highlight_body">{item.body}</p>
          </div>
        ))}
      </section>

      <InvestorRequestForm source="investors-page" />
    </main>
  )
}
