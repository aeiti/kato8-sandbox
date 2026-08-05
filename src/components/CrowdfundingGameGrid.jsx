import { crowdfundingGames } from '../data/crowdfundingGames'
import CrowdfundingGameCard from './CrowdfundingGameCard'

/**
 * The card grid on the Crowdfunding Games page (`/crowdfunding-games`).
 *
 * Iterates every entry in `src/data/crowdfundingGames.js` and renders a
 * `CrowdfundingGameCard` for each. Order is the array order — edit there
 * to reorder. Rendered by `CrowdfundingGamesPage`. No props.
 */
export default function CrowdfundingGameGrid() {
  return (
    <div className="cf-grid">
      {crowdfundingGames.map((game) => (
        <CrowdfundingGameCard key={game.slug} game={game} />
      ))}
    </div>
  )
}
