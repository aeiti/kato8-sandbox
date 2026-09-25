import { Routes, Route, useLocation, Link } from 'react-router-dom'
// Sandbox nav is a vendored copy of the main-site Nav with an added
// "Investors" tab (not yet upstream — PROCESS.md §1b). Swap back to the
// imported `kato8studios-site/src/components/Nav` when the tab graduates.
import Nav from './components/SandboxNav'
import Footer from 'kato8studios-site/src/components/Footer'
import HomePage from './pages/HomePage'
import KickstarterButtonsPage from './pages/KickstarterButtonsPage'
import KickstarterButtonV2Page from './pages/KickstarterButtonV2Page'
import CrowdfundingGamesPage from './pages/CrowdfundingGamesPage'
import CrowdfundingGamePage from './pages/CrowdfundingGamePage'
import OurStoryTimelinePage from './pages/OurStoryTimelinePage'
import NewsletterOnAboutPage from './pages/NewsletterOnAboutPage'
import InvestorsPage from './pages/InvestorsPage'
import StudioBiosPage from './pages/StudioBiosPage'
import PreviewPage from './previews/PreviewPage'
// Pages scaffolded from the dev admin panel (scripts/dev-admin) auto-insert
// their `import` line directly below the next marker. Keep the marker line
// intact and on its own — the panel splices new imports right after it.
// ADMIN:PAGE-IMPORTS
import HomeUsbBackgroundPage from './pages/HomeUsbBackgroundPage'

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  // Full-bleed layout for the crowdfunding demo detail pages, matching the
  // main site's `body-2` treatment for `/games/:slug`. Everything else uses
  // the normal `body` layout.
  const isFullWidthPage = /^\/crowdfunding-games\/[^/]+/.test(location.pathname)
  const bodyClass = isFullWidthPage ? 'body-2' : 'body'

  // The route table, shared by the normal and bare renders so a page added
  // from the admin panel shows up in both. New page routes auto-insert below
  // the ADMIN:PAGE-ROUTES marker (see scripts/dev-admin).
  const routes = (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/kickstarter-buttons" element={<KickstarterButtonsPage />} />
      <Route path="/kickstarter-button-v2" element={<KickstarterButtonV2Page />} />
      <Route path="/crowdfunding-games" element={<CrowdfundingGamesPage />} />
      <Route path="/crowdfunding-games/:slug" element={<CrowdfundingGamePage />} />
      <Route path="/our-story-timeline" element={<OurStoryTimelinePage />} />
      <Route path="/newsletter-on-about" element={<NewsletterOnAboutPage />} />
      <Route path="/investors" element={<InvestorsPage />} />
      <Route path="/studio-bios" element={<StudioBiosPage />} />
      {/* ADMIN:PAGE-ROUTES — admin-scaffolded page routes insert below this line */}
      <Route path="/home-usb-background" element={<HomeUsbBackgroundPage />} />
      <Route path="/components" element={<PreviewPage />} />
      <Route path="/components/:name" element={<PreviewPage />} />
    </Routes>
  )

  // `?bare=1` (used by the dev admin panel's live-preview iframe) renders the
  // routed page alone — no back bar, Nav, or Footer — so a single component or
  // page fills the pane. PreviewPage also drops its own preview bar in this mode.
  const isBare = new URLSearchParams(location.search).get('bare') === '1'
  if (isBare) {
    return <div className={`${bodyClass} body--bare`}>{routes}</div>
  }

  return (
    <div className={bodyClass}>
      {/* Standard sandbox chrome, shared by every page: a thin "← Sandbox"
          back bar (everywhere but the home index) above the main-site Nav,
          with the main-site Footer below. Kept here in App so all pages get
          one consistent nav + footer instead of rolling their own. */}
      {!isHome && (
        <div className="sandbox-backbar">
          <Link to="/" className="sandbox-backbar_link">← Sandbox</Link>
        </div>
      )}
      <Nav />
      {routes}
      <Footer />
    </div>
  )
}
