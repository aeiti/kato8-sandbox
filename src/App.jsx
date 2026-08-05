import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import KickstarterButtonsPage from './pages/KickstarterButtonsPage'
import KickstarterButtonV2Page from './pages/KickstarterButtonV2Page'
import CrowdfundingGamesPage from './pages/CrowdfundingGamesPage'
import CrowdfundingGamePage from './pages/CrowdfundingGamePage'
import PreviewPage from './previews/PreviewPage'

export default function App() {
  const location = useLocation()
  // Full-bleed layout for the crowdfunding demo detail pages, matching the
  // main site's `body-2` treatment for `/games/:slug`. The landing and every
  // other sandbox route stay on the normal `body` layout.
  const isFullWidthPage = /^\/crowdfunding-games\/[^/]+/.test(location.pathname)
  const bodyClass = isFullWidthPage ? 'body-2' : 'body'

  return (
    <div className={bodyClass}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kickstarter-buttons" element={<KickstarterButtonsPage />} />
        <Route path="/kickstarter-button-v2" element={<KickstarterButtonV2Page />} />
        <Route path="/crowdfunding-games" element={<CrowdfundingGamesPage />} />
        <Route path="/crowdfunding-games/:slug" element={<CrowdfundingGamePage />} />
        <Route path="/components" element={<PreviewPage />} />
        <Route path="/components/:name" element={<PreviewPage />} />
      </Routes>
    </div>
  )
}
