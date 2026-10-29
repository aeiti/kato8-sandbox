import InvestorRequestForm from '../components/InvestorRequestForm'
import ArchiveNotice from '../components/ArchiveNotice'
import { archived } from '../data/archive'
import '../styles/investors-v1.css'

/**
 * Archived: the original investor / publisher page, retired 2026-10-28
 * when the color design took over /investors. A frozen copy (its own
 * copy text and `investors-v1` styles), so later edits to the live page
 * don't change it. See src/data/archive.js.
 */
const ENTRY = archived.find((entry) => entry.path === '/archive/investors-v1')

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
    body: 'Partner with us early and help shape where Kato.8 goes next, with direct access to the team.',
  },
]

export default function ArchiveInvestorsV1Page() {
  return (
    <>
      <ArchiveNotice entry={ENTRY} />
      <main className="investors-v1">
        <header className="investors-v1-hero">
          <p className="investors-v1-hero_eyebrow">Investors &amp; Publishers</p>
          <h1 className="investors-v1-hero_title">Partner with Kato.8</h1>
          <p className="investors-v1-hero_lead">
            Kato.8 is an independent game studio building original titles and the
            community around them. We’re opening early conversations with investors
            who want to back that journey and publishers who want to help bring our
            games to more players. Get in touch below and we’ll follow up.
          </p>
        </header>

        <section className="investors-v1-highlights" aria-label="Why Kato.8">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="investors-v1-highlight">
              <h2 className="investors-v1-highlight_title">{item.title}</h2>
              <p className="investors-v1-highlight_body">{item.body}</p>
            </div>
          ))}
        </section>

        <InvestorRequestForm source="archive-investors-v1" />
      </main>
    </>
  )
}
