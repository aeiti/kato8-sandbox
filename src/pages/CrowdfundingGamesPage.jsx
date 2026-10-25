import CrowdfundingGameGrid from '../components/CrowdfundingGameGrid'
import '../styles/crowdfunding-games.css'

/**
 * Sandbox preview of the Crowdfunding Games landing page
 * (`/crowdfunding-games`), matching what ships on staging.
 *
 * The shared main-site `Nav` + `Footer` (and the sandbox frame)
 * are provided globally by `App.jsx`, so this page only renders its own
 * content. The crowdfunding-specific grid/card/data are vendored copies
 * under `src/` because they don't exist on external-site `main` yet (see
 * PROCESS.md → "Pages"). Each card links to `/crowdfunding-games/:slug`
 * (see `CrowdfundingGamePage`).
 */
export default function CrowdfundingGamesPage() {
  return (
    <section className="cf-page">
      <div className="cf-heading">
        <h1 className="cf-heading__title">Crowdfunding Games</h1>
        <p className="cf-heading__description">
          Quick, experimental games built by our team between larger projects. Every purchase directly
          supports the studio and gives us more room to keep creating.
        </p>
      </div>
      <CrowdfundingGameGrid />
    </section>
  )
}
