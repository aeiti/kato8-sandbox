import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { games } from 'kato8studios-site/src/data/games'
import { socialLinks, SocialIcon } from 'kato8studios-site/src/components/SocialIcons'

/**
 * Sandbox copy of the main-site MobileMenu, with one addition: an
 * **Investors** link in the Studio section. Vendored (not imported) so
 * the proposed "Investors" tab shows up on mobile as well as desktop —
 * the tab isn't on external-site `main` yet, so there's nothing to
 * import (PROCESS.md §1b vendoring exception).
 *
 * Everything else mirrors external-site/src/components/MobileMenu.jsx.
 * `games` and `SocialIcons` are still imported from `kato8studios-site`
 * because they ARE upstream. When the Investors tab graduates to the
 * real nav, delete this file and go back to the imported MobileMenu.
 */
export default function SandboxMobileMenu({ open, onClose }) {
  const location = useLocation()

  useEffect(() => {
    if (open) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('mobile-menu-open')
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.classList.remove('mobile-menu-open')
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  return (
    <>
      <div className={`mobile-menu-backdrop${open ? ' is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        className={`mobile-menu-panel${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Mobile navigation"
      >
        <div className="mobile-menu-section">
          <h2 className="mobile-menu-heading">Games</h2>
          <ul className="mobile-menu-list">
            {games.map((game) => (
              <li key={game.slug}>
                <Link to={`/games/${game.slug}`} className="mobile-menu-link">
                  {game.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mobile-menu-section">
          <h2 className="mobile-menu-heading">Studio</h2>
          <ul className="mobile-menu-list">
            <li>
              <Link to="/about-us" className="mobile-menu-link">
                About
              </Link>
            </li>
            <li>
              <Link to="/investors" className="mobile-menu-link">
                Investors
              </Link>
            </li>
          </ul>
        </div>

        <div className="mobile-menu-section">
          <h2 className="mobile-menu-heading">Community</h2>
          <div className="mobile-menu-socials">
            {socialLinks.map((link) => (
              <SocialIcon key={link.name} {...link} />
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
