import { useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { getCrowdfundingGameBySlug } from '../data/crowdfundingGames'
import { crowdfundingGameRoutes } from '../data/seo-config'
import '../styles/simple-game.css'

/**
 * Sandbox preview of a crowdfunding game detail page
 * (`/crowdfunding-games/:slug`), matching what ships on staging.
 *
 * Reuses the simplified "main section" layout from the main site's
 * `SimpleGamePage` (the Last Light page): portrait cover placeholder +
 * title + tags + description. No concept-art gallery, no playtest/Discord
 * forms, no Kickstarter button — these are placeholder demo games.
 *
 * The shared main-site `Nav` + `Footer` (and the "← Sandbox" back bar)
 * are provided globally by `App.jsx`. Data + styles are vendored under
 * `src/` (not yet on external-site `main`; see PROCESS.md → "Pages").
 * Unlike the main site there's no `NotFoundPage` in the sandbox, so an
 * unknown slug renders a minimal inline fallback.
 */
export default function CrowdfundingGamePage() {
  const { slug } = useParams()
  const game = getCrowdfundingGameBySlug(slug)

  if (!game) {
    return (
      <section className="cf-page">
        <div className="cf-heading">
          <h1 className="cf-heading__title">Game not found</h1>
          <p className="cf-heading__description">
            No crowdfunding game matches “{slug}”.
          </p>
        </div>
      </section>
    )
  }

  const seo = crowdfundingGameRoutes[slug]
  const categories = game.categories ?? []

  return (
    <>
      {seo && <Seo path={`/crowdfunding-games/${slug}`} {...seo} />}
      <section className="simple-game-page">
        <div className="simple-game-hero">
          <div className="simple-game-cover">
            {game.coverImage ? (
              <img
                src={game.coverImage.src}
                alt={game.coverImage.alt}
                className="simple-game-cover-image"
              />
            ) : (
              <div className="simple-game-cover-placeholder" aria-hidden="true" />
            )}
          </div>

          <div className="simple-game-info">
            <div className="simple-game-title-block">
              <h1 className="simple-game-title">{game.title}</h1>
              {(game.comingSoon || categories.length > 0) && (
                <div className="simple-game-tags">
                  {game.comingSoon && (
                    <span className="simple-game-tag simple-game-tag-coming-soon">
                      Coming Soon
                    </span>
                  )}
                  {categories.map((category, i) => (
                    <span
                      key={`${category}-${i}`}
                      className="simple-game-tag simple-game-tag-category"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="simple-game-description">
              {(game.body ?? []).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
