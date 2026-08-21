import Seo from '../components/Seo'
import { asset } from '../utils/asset'
import '../styles/home-usb-background.css'

/**
 * Home — USB Background (archived snapshot).
 *
 * Frozen copy of the home-page look from the 2026-08 UI/UX pass: the studio
 * hero over a fixed/parallax Universal Serial Blade cover-art backdrop, plus
 * the cleaned-up game cards (logo + description, no title/tags). Hero + cards
 * only — the GoFundMe support section is intentionally omitted.
 *
 * Self-contained on purpose (own copy of the hero/card markup + a tiny inline
 * games list) so it stays a stable reference even as the live homepage on
 * external-site evolves. The hero/card *base* styles come from the main site's
 * home.css + games.css (imported globally in src/main.jsx); the parallax and
 * card-logo deltas live in ../styles/home-usb-background.css. Cards are static
 * previews — the "Learn More" pill doesn't navigate (no game routes here).
 */

const SCRIM = 'rgba(255, 255, 255, 0.62)'
const BACKGROUND = '/assets/img/universal-serial-blade-outside-city-concept.jpg'

const TAGLINE =
  'Kato.8 Studios is dedicated to reviving the heart of gaming. We create games for gamers, by gamers; crafting modern games with retro-inspired aesthetics, mechanics, and emotional engagement.'

const games = [
  {
    slug: 'universal-serial-blade',
    title: 'Universal Serial Blade',
    tagline: 'Upgrade your body. Discover the truth.',
    bgColor: '#ff9183',
    bgImage: '/assets/img/universal-serial-blade-outside-city-concept.jpg',
    cardLogo: { src: '/assets/img/universal-serial-blade-logo.png', alt: 'Universal Serial Blade logo' },
  },
  {
    slug: 'last-light',
    title: 'Last Light',
    tagline: 'Scavenge. Build. Survive the night.',
    bgColor: '#e772bc',
    bgImage: '/assets/img/last-light-cover.jpg',
    cardLogo: { src: '/assets/img/logo-01.png', alt: 'Last Light logo' },
  },
  {
    slug: 'big-boss-cleanup',
    title: 'Big Boss Cleanup',
    tagline: "Someone has to clean up the heroes' mess.",
    bgColor: '#ffaf83',
    bgImage: '/assets/img/big-boss-cleanup-cover.jpg',
    cardLogo: { src: '/assets/img/bbcl-logo-final-red.png', alt: 'Big Boss Cleanup logo' },
  },
]

export default function HomeUsbBackgroundPage() {
  const backgroundImage = `linear-gradient(${SCRIM}, ${SCRIM}), url('${asset(BACKGROUND)}')`

  return (
    <section className="home-main has-fixed-bg" style={{ backgroundImage }}>
      <Seo
        path="/home-usb-background"
        title="Home — USB Background"
        description="Archived home-page look: hero over a fixed USB cover-art parallax backdrop with cleaned-up game cards."
      />

      <section className="home-hero-intro">
        <div className="hero-logo-wrapper">
          <img src={asset('/assets/img/anime-type.png')} loading="lazy" alt="Kato.8 Studios logo" className="hero-logo-image" />
        </div>
        <div className="hero-tagline-wrapper">
          <p className="hero-intro-paragraph">{TAGLINE}</p>
        </div>
      </section>

      <section className="games-cards-wrapper">
        <section className="games-list-section">
          <div className="games-card-list-wrapper w-dyn-list">
            <div role="list" className="games-card-list w-dyn-items w-row">
              {games.map((game) => (
                <div
                  key={game.slug}
                  style={{ backgroundColor: game.bgColor, backgroundImage: `url('${asset(game.bgImage)}')` }}
                  role="listitem"
                  className="game-card w-dyn-item w-col w-col-4"
                >
                  <div className="game-card-overlay">
                    <div className="game-card-content">
                      {game.cardLogo && (
                        <div className="game-card-logo-block">
                          <img src={asset(game.cardLogo.src)} loading="lazy" alt={game.cardLogo.alt} className="game-card-logo" />
                        </div>
                      )}
                      <div className="game-card-description">
                        <p>{game.tagline}</p>
                      </div>
                      <div className="game-card-cta-link w-inline-block" aria-hidden="true">
                        <div className="game-card-cta-pill">
                          <div className="game-card-cta-label">Learn More</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </section>
  )
}
