import { Link } from 'react-router-dom'
import KickstarterButton from '../components/KickstarterButton'
import Seo from '../components/Seo'
import { staticRoutes } from '../data/seo-config'
import { asset } from '../utils/asset'
import '../styles/kickstarter-button.css'
import '../styles/kickstarter-button-v2.css'
import '../styles/kickstarter-buttons-page.css'

/**
 * v2 button. Self-contained here (no arrow span) so the frozen v1
 * component in ../components/KickstarterButton.jsx stays untouched.
 */
function KickstarterButtonV2({ href, label = 'Back on Kickstarter' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="kickstarter-button kickstarter-button--v2"
    >
      <img
        src={asset('/assets/sandbox/kickstarter-logo-k-white.svg')}
        alt=""
        className="kickstarter-button_logo"
      />
      <span className="kickstarter-button_text">{label}</span>
    </a>
  )
}

export default function KickstarterButtonV2Page() {
  return (
    <main className="kickstarter-buttons-page">
      <Seo path="/kickstarter-button-v2" {...staticRoutes['/kickstarter-button-v2']} />
      <header className="kickstarter-buttons-page_header">
        <p className="kickstarter-buttons-page_kicker">
          <Link to="/" className="kickstarter-buttons-page_back">← Sandbox</Link>
        </p>
        <h1 className="kickstarter-buttons-page_title">Kickstarter Button v2</h1>
        <p className="kickstarter-buttons-page_subtitle">
          v1 (currently shipped) stacked four "designed-by-AI" tropes on one
          button — inset stroke, hard-offset shadow, shadow lift on hover,
          arrow slide. v2 strips it back to what an{' '}
          <strong>official partner CTA</strong> usually looks like: flat KS
          green, K mark, text, subtle drop shadow, hover just darkens the
          background.
        </p>
      </header>

      <section className="kickstarter-buttons-page_category">
        <div className="kickstarter-buttons-page_cat-header">
          <span className="kickstarter-buttons-page_cat-tag">Compare</span>
          <h2 className="kickstarter-buttons-page_cat-heading">
            v1 (shipped) vs v2 (proposed)
          </h2>
          <span className="kickstarter-buttons-page_cat-what">hover both</span>
        </div>
        <div className="kickstarter-buttons-page_grid kickstarter-button-v2-page_grid">
          <div className="kickstarter-buttons-page_swatch">
            <h3 className="kickstarter-buttons-page_swatch-title">v1 — top pick</h3>
            <code className="kickstarter-buttons-page_swatch-code">
              inset 2px + 4→7px offset shadow + arrow slide
            </code>
            <div className="kickstarter-buttons-page_swatch-btn">
              <KickstarterButton variant="top" href="#" />
            </div>
            <p className="kickstarter-buttons-page_swatch-why">
              Currently on prod. Distinctive, but the neobrutalist stack
              reads as designed-for-vibes.
            </p>
          </div>

          <div className="kickstarter-buttons-page_swatch">
            <h3 className="kickstarter-buttons-page_swatch-title">v2 — flat</h3>
            <code className="kickstarter-buttons-page_swatch-code">
              0 1px 2px rgba(0,0,0,.15); hover: bg darken
            </code>
            <div className="kickstarter-buttons-page_swatch-btn">
              <KickstarterButtonV2 href="#" />
            </div>
            <p className="kickstarter-buttons-page_swatch-why">
              Reads as an official Kickstarter-partner button. Less
              distinctive on the page — which is the point.
            </p>
          </div>
        </div>
      </section>

      <footer className="kickstarter-buttons-page_note">
        <strong>Open questions:</strong> keep the subtle drop shadow, or go
        fully flat (no shadow at all)? Keep the arrow but drop everything
        else? Try a middle option that keeps <em>one</em> of the v1
        flourishes so the button doesn't disappear into the page?
      </footer>
    </main>
  )
}
