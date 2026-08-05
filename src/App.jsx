import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Nav from 'kato8studios-site/src/components/Nav'
import Footer from 'kato8studios-site/src/components/Footer'
import HomePage from './pages/HomePage'
import KickstarterButtonsPage from './pages/KickstarterButtonsPage'
import KickstarterButtonV2Page from './pages/KickstarterButtonV2Page'
import CrowdfundingGamesPage from './pages/CrowdfundingGamesPage'
import CrowdfundingGamePage from './pages/CrowdfundingGamePage'
import PreviewPage from './previews/PreviewPage'

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  // Full-bleed layout for the crowdfunding demo detail pages, matching the
  // main site's `body-2` treatment for `/games/:slug`. Everything else uses
  // the normal `body` layout.
  const isFullWidthPage = /^\/crowdfunding-games\/[^/]+/.test(location.pathname)
  const bodyClass = isFullWidthPage ? 'body-2' : 'body'

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
        <Route path="/components" element={<PreviewPage />} />
        <Route path="/components/:name" element={<PreviewPage />} />
      </Routes>
      <Footer />
    </div>
  )
}
