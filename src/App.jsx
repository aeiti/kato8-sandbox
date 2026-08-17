import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Nav from 'kato8studios-site/src/components/Nav'
import Footer from 'kato8studios-site/src/components/Footer'
import HomePage from './pages/HomePage'
import KickstarterButtonsPage from './pages/KickstarterButtonsPage'
import KickstarterButtonV2Page from './pages/KickstarterButtonV2Page'
import CrowdfundingGamesPage from './pages/CrowdfundingGamesPage'
import CrowdfundingGamePage from './pages/CrowdfundingGamePage'
import OurStoryTimelinePage from './pages/OurStoryTimelinePage'
import NewsletterOnAboutPage from './pages/NewsletterOnAboutPage'
import PreviewPage from './previews/PreviewPage'

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  // Full-bleed layout for the crowdfunding demo detail pages, matching the
  // main site's `body-2` treatment for `/games/:slug`. Everything else uses
  // the normal `body` layout.
  const isFullWidthPage = /^\/crowdfunding-games\/[^/]+/.test(location.pathname)
  const bodyClass = isFullWidthPage ? 'body-2' : 'body'

  // `?bare=1` (used by the dev admin panel's live-preview iframe) renders the
  // routed page alone — no back bar, Nav, or Footer — so a single component
  // fills the pane. PreviewPage also drops its own preview bar in this mode.
  const isBare = new URLSearchParams(location.search).get('bare') === '1'
  if (isBare) {
    return (
      <div className={`${bodyClass} body--bare`}>
        <Routes>
          <Route path="/components/:name" element={<PreviewPage />} />
        </Routes>
      </div>
    )
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kickstarter-buttons" element={<KickstarterButtonsPage />} />
        <Route path="/kickstarter-button-v2" element={<KickstarterButtonV2Page />} />
        <Route path="/crowdfunding-games" element={<CrowdfundingGamesPage />} />
        <Route path="/crowdfunding-games/:slug" element={<CrowdfundingGamePage />} />
        <Route path="/our-story-timeline" element={<OurStoryTimelinePage />} />
        <Route path="/newsletter-on-about" element={<NewsletterOnAboutPage />} />
        <Route path="/components" element={<PreviewPage />} />
        <Route path="/components/:name" element={<PreviewPage />} />
      </Routes>
      <Footer />
    </div>
  )
}
