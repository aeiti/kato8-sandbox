import InvestorRequestForm from '../components/InvestorRequestForm'
import Seo from '../components/Seo'
import { games } from 'kato8studios-site/src/data/games'
import { staticRoutes } from '../data/seo-config'
import { HIGHLIGHTS } from './InvestorsPage'
import '../styles/investors.css'
import '../styles/investors-color.css'

/**
 * Color variant of the investor page, for side-by-side comparison with
 * `/investors`. Same copy, highlights, and form; two changes:
 *
 *   1. The hero sits on a dark-cobalt band that picks up the nav's
 *      cobalt + pink→peach wave, so the top of the page reads like the
 *      main site instead of plain text on pearl.
 *   2. A strip of the three studio games (art + logo + tagline, from the
 *      main site's games data) between the highlights and the form, so
 *      "original games" is shown rather than described.
 *
 * Game tiles link to the live game pages on kato8studios.com (the sandbox
 * has no /games routes). Whichever variant wins, delete the other.
 */
const SITE_URL = 'https://kato8studios.com'

export default function InvestorsColorPage() {
  return (
    <main className="investors-color">
      <Seo path="/investors-color" {...staticRoutes['/investors-color']} />

      <header className="investors-color_hero">
        <div className="investors-color_hero-inner">
          <div className="investors-color_hero-content">
            <p className="investors-hero_eyebrow investors-color_eyebrow">Investors &amp; Publishers</p>
            <h1 className="investors-hero_title investors-color_title">Partner with Kato.8</h1>
            <p className="investors-hero_lead investors-color_lead">
              Kato.8 is an independent game studio building original titles and the
              community around them. We’re opening early conversations with investors
              who want to back that journey and publishers who want to help bring our
              games to more players. Get in touch below and we’ll follow up.
            </p>
          </div>
        </div>
        <svg
          className="investors-color_wave"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="investors-color-ribbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e6738a" />
              <stop offset="1" stopColor="#fecb86" />
            </linearGradient>
          </defs>
          {/* Pink→peach ribbon, then the cobalt band's wavy lower edge over it. */}
          <path
            d="M0 52 C240 92 480 104 720 76 C960 48 1200 44 1440 70 L1440 108 C1200 84 960 88 720 114 C480 140 240 128 0 94 Z"
            fill="url(#investors-color-ribbon)"
          />
          <path
            d="M0 0 H1440 V70 C1200 44 960 48 720 76 C480 104 240 92 0 52 Z"
            className="investors-color_wave-band"
          />
        </svg>
      </header>

      <div className="investors-page investors-color_body">
        <section className="investors-highlights" aria-label="Why Kato.8">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="investors-highlight">
              <h2 className="investors-highlight_title">{item.title}</h2>
              <p className="investors-highlight_body">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="investors-color_games" aria-labelledby="investors-color-games-heading">
          <h2 id="investors-color-games-heading" className="investors-color_games-heading">
            Our games
          </h2>
          <ul className="investors-color_games-list">
            {games.map((game) => (
              <li key={game.slug}>
                <a
                  className="investors-color_game"
                  href={`${SITE_URL}/games/${game.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: game.bgColor,
                    backgroundImage: game.bgImage ? `url('${game.bgImage}')` : undefined,
                  }}
                >
                  {game.cardLogo ? (
                    <img className="investors-color_game-logo" src={game.cardLogo.src} alt={game.title} />
                  ) : (
                    <span className="investors-color_game-title">{game.title}</span>
                  )}
                  {game.tagline && <span className="investors-color_game-tagline">{game.tagline}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <InvestorRequestForm source="investors-color-page" />
      </div>
    </main>
  )
}
