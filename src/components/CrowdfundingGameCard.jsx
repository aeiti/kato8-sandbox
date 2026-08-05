import { Link } from 'react-router-dom'

/**
 * A single tile on the Crowdfunding Games grid (`/crowdfunding-games`).
 *
 * Rendered by `CrowdfundingGameGrid` once per entry in
 * `src/data/crowdfundingGames.js`.
 *
 * Visual (matches the design template): a light card with a top image
 * block, category chips, title, and short description. The whole card is a
 * link to `/crowdfunding-games/:slug`, handled by `CrowdfundingGamePage`.
 *
 * Props:
 *   game — entry from `src/data/crowdfundingGames.js`. Uses:
 *     - slug, title, categories[], description
 *     - image (optional; falls back to a plain placeholder block)
 */
export default function CrowdfundingGameCard({ game }) {
  const imageStyle = game.image
    ? { backgroundImage: `url('${game.image}')` }
    : undefined

  return (
    <Link to={`/crowdfunding-games/${game.slug}`} className="cf-card">
      <div className="cf-card__image" style={imageStyle} />
      <div className="cf-card__body">
        <div className="cf-card__header">
          <div className="cf-card__categories">
            {game.categories?.map((category, i) => (
              <div key={`${category}-${i}`} className="cf-chip">
                <span className="cf-chip__label">{category}</span>
              </div>
            ))}
          </div>
          <h2 className="cf-card__title">{game.title}</h2>
        </div>
        <p className="cf-card__description">{game.description}</p>
      </div>
    </Link>
  )
}
