import InvestorRequestForm from '../components/InvestorRequestForm'
import { games } from 'kato8studios-site/src/data/games'
import '../styles/investors.css'

/**
 * Investor / publisher page prototype (PROCESS.md §1b — new page, not yet
 * on external-site `main`). The proposed "Investors" tab that links here
 * lives in the sandbox's vendored nav (SandboxNav / SandboxMobileMenu).
 *
 *   - Hero on a dark-cobalt band that picks up the nav's cobalt +
 *     pink→peach wave, so the top of the page reads like the main site.
 *   - Highlight cards.
 *   - A strip of the three studio games (art + logo + tagline from the
 *     main site's games data), so "original games" is shown rather than
 *     described. Tiles link to the live game pages on kato8studios.com
 *     (the sandbox has no /games routes).
 *   - The `InvestorRequestForm` contact form.
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
    body: 'Partner with us early and help shape where Kato.8 goes next, with direct access to the team.',
  },
]

const SITE_URL = 'https://kato8studios.com'

export default function InvestorsPage() {
  return (
    <main className="investors">

      <header className="investors-hero">
        <div className="investors-hero_inner">
          <div className="investors-hero_content">
            <p className="investors-hero_eyebrow">Investors &amp; Publishers</p>
            <h1 className="investors-hero_title">Partner with Kato.8</h1>
            <p className="investors-hero_lead">
              Kato.8 is an independent game studio building original titles and the
              community around them. We’re opening early conversations with investors
              who want to back that journey and publishers who want to help bring our
              games to more players. Get in touch below and we’ll follow up.
            </p>
          </div>
        </div>
        <svg
          className="investors-hero_wave"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="investors-ribbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e6738a" />
              <stop offset="1" stopColor="#fecb86" />
            </linearGradient>
          </defs>
          {/* Pink→peach ribbon, then the cobalt band's wavy lower edge over it. */}
          <path
            d="M0 52 C240 92 480 104 720 76 C960 48 1200 44 1440 70 L1440 108 C1200 84 960 88 720 114 C480 140 240 128 0 94 Z"
            fill="url(#investors-ribbon)"
          />
          <path
            d="M0 0 H1440 V70 C1200 44 960 48 720 76 C480 104 240 92 0 52 Z"
            className="investors-hero_wave-band"
          />
        </svg>
      </header>

      <div className="investors-body">
        <section className="investors-highlights" aria-label="Why Kato.8">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="investors-highlight">
              <h2 className="investors-highlight_title">{item.title}</h2>
              <p className="investors-highlight_body">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="investors-games" aria-labelledby="investors-games-heading">
          <h2 id="investors-games-heading" className="investors-games_heading">
            Our games
          </h2>
          <ul className="investors-games_list">
            {games.map((game) => (
              <li key={game.slug}>
                <a
                  className="investors-game"
                  href={`${SITE_URL}/games/${game.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: game.bgColor,
                    backgroundImage: game.bgImage ? `url('${game.bgImage}')` : undefined,
                  }}
                >
                  {game.cardLogo ? (
                    <img className="investors-game_logo" src={game.cardLogo.src} alt={game.title} />
                  ) : (
                    <span className="investors-game_title">{game.title}</span>
                  )}
                  {game.tagline && <span className="investors-game_tagline">{game.tagline}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <InvestorRequestForm source="investors-page" />
      </div>
    </main>
  )
}
