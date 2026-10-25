import { Routes, Route, useLocation } from 'react-router-dom'
// Sandbox nav is a vendored copy of the main-site Nav with an added
// "Investors" tab (not yet upstream — PROCESS.md §1b). Swap back to the
// imported `kato8studios-site/src/components/Nav` when the tab graduates.
import Nav from './components/SandboxNav'
import Footer from 'kato8studios-site/src/components/Footer'
// Resets scroll to the top on route change. Without it, a client-side
// navigation keeps the previous page's scroll offset, so clicking a link
// far down the home list opened the next page partway down.
import ScrollToTop from 'kato8studios-site/src/components/ScrollToTop'
import SandboxFrame, { isInFrame, useReportFrameRoute } from './components/SandboxFrame'
import Seo from './components/Seo'
import { getRouteMeta, NOT_FOUND_META } from './data/seo-config'
import HomePage from './pages/HomePage'
import KickstarterButtonsPage from './pages/KickstarterButtonsPage'
import KickstarterButtonV2Page from './pages/KickstarterButtonV2Page'
import CrowdfundingGamesPage from './pages/CrowdfundingGamesPage'
import CrowdfundingGamePage from './pages/CrowdfundingGamePage'
import OurStoryTimelinePage from './pages/OurStoryTimelinePage'
import NewsletterOnAboutPage from './pages/NewsletterOnAboutPage'
import InvestorsPage from './pages/InvestorsPage'
import InvestorsColorPage from './pages/InvestorsColorPage'
import StudioBiosPage from './pages/StudioBiosPage'
import StudioBiosFramesPage from './pages/StudioBiosFramesPage'
import PreviewPage from './previews/PreviewPage'
// Pages scaffolded from the dev admin panel (scripts/dev-admin) auto-insert
// their `import` line directly below the next marker. Keep the marker line
// intact and on its own — the panel splices new imports right after it.
// ADMIN:PAGE-IMPORTS
import HomeUsbBackgroundPage from './pages/HomeUsbBackgroundPage'

export default function App() {
  const location = useLocation()
  useReportFrameRoute()
  const isHome = location.pathname === '/'
  // Full-bleed layout for the crowdfunding demo detail pages, matching the
  // main site's `body-2` treatment for `/games/:slug`. Everything else uses
  // the normal `body` layout.
  const isFullWidthPage = /^\/crowdfunding-games\/[^/]+/.test(location.pathname)
  const bodyClass = isFullWidthPage ? 'body-2' : 'body'

  // One <Seo> for the whole app, looked up from seo-config.js by route, so
  // pages don't each carry their own. It renders in every mode: in the
  // sandbox frame's outer document (which owns the address bar, so crawlers
  // that run JS see the page's meta there) and inside the framed page.
  // GitHub Pages serves routes with a trailing slash; the config keys don't.
  const seoPath = location.pathname.replace(/(.)\/$/, '$1')
  const seo = <Seo path={seoPath} {...(getRouteMeta(seoPath) || NOT_FOUND_META)} />

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
      <Route path="/investors-color" element={<InvestorsColorPage />} />
      <Route path="/studio-bios" element={<StudioBiosPage />} />
      <Route path="/studio-bios-frames" element={<StudioBiosFramesPage />} />
      {/* ADMIN:PAGE-ROUTES — admin-scaffolded page routes insert below this line */}
      <Route path="/home-usb-background" element={<HomeUsbBackgroundPage />} />
      <Route path="/components" element={<PreviewPage />} />
      <Route path="/components/:name" element={<PreviewPage />} />
    </Routes>
  )

  // `?bare=1` (used by the dev admin panel's live-preview iframe) renders the
  // routed page alone — no sandbox frame, Nav, or Footer — so a single component or
  // page fills the pane. PreviewPage also drops its own preview bar in this mode.
  const isBare = new URLSearchParams(location.search).get('bare') === '1'
  if (isBare) {
    return (
      <div className={`${bodyClass} body--bare`}>
        {seo}
        <ScrollToTop />
        {routes}
      </div>
    )
  }

  // Every page but the home index is shown inside the sandbox frame: a dark
  // toolbar with the back link, over the page loaded in an iframe (see
  // SandboxFrame). The iframe — or `?frame=0`, for viewing a page full-window —
  // renders the page as prod does: main-site Nav, the route, main-site Footer.
  const isUnframed = new URLSearchParams(location.search).get('frame') === '0'
  if (isInFrame || isUnframed) {
    return (
      <div className={bodyClass}>
        {seo}
        <ScrollToTop />
        <Nav />
        {routes}
        <Footer />
      </div>
    )
  }

  // The home index isn't a Kato.8 page, so it gets the sandbox toolbar alone,
  // without the main-site Nav and Footer.
  if (isHome) {
    return (
      <div className="body">
        {seo}
        <header className="sandbox-toolbar sandbox-toolbar--home">
          <span className="sandbox-toolbar_dots" aria-hidden="true">
            <span /><span /><span />
          </span>
          <span className="sandbox-toolbar_title">Kato.8 Sandbox</span>
        </header>
        {routes}
      </div>
    )
  }

  return (
    <>
      {seo}
      <SandboxFrame />
    </>
  )
}
