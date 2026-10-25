import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getRouteMeta } from '../data/seo-config'

// Sandbox chrome for every page but the home index: a grey toolbar with the
// "← Sandbox" link, and the page itself loaded in a same-origin iframe styled
// as a browser window. The iframe (rather than a styled wrapper div) keeps
// pages pixel-identical to prod — `position: fixed` backdrops, `100vw` bands,
// and media queries all resolve against the window, not the whole viewport.
//
// Inside the iframe App renders the page as prod does (Nav + page + Footer)
// and posts its route here (see useReportFrameRoute), so the outer URL —
// and with it the toolbar title and App's <Seo> — follow client-side
// navigation within the frame.

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const TITLE_SUFFIX = / \| Kato\.8 Sandbox$/

export const isInFrame = typeof window !== 'undefined' && window.self !== window.top

export default function SandboxFrame() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname + location.search
  // The iframe's src is only set from the outer URL when the two disagree
  // (first load, outer back/forward). Navigation that starts inside the
  // frame updates the outer URL to match without reloading the iframe.
  const [src, setSrc] = useState(path)
  const framePath = useRef(path)
  const title = (getRouteMeta(location.pathname.replace(/(.)\/$/, '$1'))?.title || '').replace(
    TITLE_SUFFIX,
    '',
  )

  useEffect(() => {
    function onMessage(e) {
      if (e.origin !== window.location.origin || e.data?.type !== 'sandbox:route') return
      framePath.current = e.data.path
      if (e.data.path === '/') navigate('/')
      else navigate(e.data.path, { replace: true })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate])

  useEffect(() => {
    if (path !== framePath.current) {
      framePath.current = path
      setSrc(path)
    }
  }, [path])

  return (
    <div className="sandbox-shell">
      <header className="sandbox-toolbar">
        <span className="sandbox-toolbar_dots" aria-hidden="true">
          <span /><span /><span />
        </span>
        <Link to="/" className="sandbox-toolbar_back">← Sandbox</Link>
        <span className="sandbox-toolbar_sep" aria-hidden="true">/</span>
        <span className="sandbox-toolbar_title">{title}</span>
        <code className="sandbox-toolbar_path">{location.pathname}</code>
        <a
          className="sandbox-toolbar_open"
          href={`${BASE}${location.pathname}?frame=0`}
          target="_blank"
          rel="noreferrer"
        >
          Open unframed ↗
        </a>
      </header>
      <div className="sandbox-window">
        <iframe className="sandbox-window_page" src={`${BASE}${src}`} title={title || 'Sandbox page'} />
      </div>
    </div>
  )
}

// Runs inside the iframe: report the current route to the parent frame.
export function useReportFrameRoute() {
  const location = useLocation()
  const path = location.pathname + location.search
  useEffect(() => {
    if (!isInFrame) return
    window.parent.postMessage({ type: 'sandbox:route', path }, window.location.origin)
  }, [path])
}
