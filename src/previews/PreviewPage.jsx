import { Link, useParams, useSearchParams } from 'react-router-dom'
import { previews, previewByName } from './registry'
import Seo from '../components/Seo'
import { staticRoutes, componentRoutes, NOT_FOUND_META } from '../data/seo-config'
import '../styles/previews.css'

export default function PreviewPage() {
  const { name } = useParams()
  const [params] = useSearchParams()
  // `?bare=1` renders the component alone (no preview bar; App also drops
  // its chrome) so the dev admin panel can embed it in a live-preview iframe.
  const bare = params.get('bare') === '1'
  if (!name) return <Gallery />
  const entry = previewByName[name]
  if (!entry) return <NotFound name={name} />
  return <SinglePreview entry={entry} bare={bare} />
}

function ComponentStage({ entry }) {
  return typeof entry.render === 'function' ? (
    entry.render()
  ) : (
    <div className="container preview-frame_norender">
      <p>
        No renderer is wired for <code>{entry.name}</code> yet. Add one to{' '}
        <code>src/previews/registry.jsx</code> to preview it live.
      </p>
    </div>
  )
}

function Gallery() {
  return (
    <main className="previews-gallery">
      <Seo path="/components" {...staticRoutes['/components']} />
      <div className="container">
        <header className="previews-gallery_header">
          <h1 className="previews-gallery_title">Components</h1>
          <p className="previews-gallery_subtitle">
            Every component from the main site, rendered in isolation. Click a card to view it on its own page.
          </p>
        </header>

        <ul className="previews-gallery_list">
          {previews.map((entry) => (
            <li key={entry.name} className="previews-gallery_item">
              <Link to={`/components/${entry.name}`} className="previews-gallery_item-link">
                <div className="previews-gallery_item-head">
                  <h2 className="previews-gallery_item-title">{entry.label}</h2>
                  <StatusBadge status={entry.status} />
                </div>
                <p className="previews-gallery_item-desc">{entry.description}</p>
                <span className="previews-gallery_item-cta">
                  Open preview →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

function SinglePreview({ entry, bare }) {
  const meta = componentRoutes[entry.name]
  if (bare) {
    return (
      <div className={`preview-frame preview-frame--bare preview-frame--${entry.background}`}>
        <div className="preview-frame_stage">
          <ComponentStage entry={entry} />
        </div>
      </div>
    )
  }
  return (
    <div className={`preview-frame preview-frame--${entry.background}`}>
      {meta && <Seo path={`/components/${entry.name}`} {...meta} />}
      <div className="preview-frame_bar">
        <div className="container preview-frame_bar-inner">
          <Link to="/components" className="preview-frame_back">← Components</Link>
          <span className="preview-frame_label">{entry.label}</span>
          <StatusBadge status={entry.status} />
          <span className="preview-frame_desc">{entry.description}</span>
        </div>
      </div>
      <div className="preview-frame_stage">
        <ComponentStage entry={entry} />
      </div>
    </div>
  )
}

// Lifecycle badge derived from each entry's `status`. 'stable' is the
// default and shows nothing to keep the gallery quiet; everything else
// (wip / vendored / deprecated / custom) renders a small pill.
function StatusBadge({ status }) {
  if (!status || status === 'stable') return null
  return (
    <span className="status-badge" data-status={status}>
      {status}
    </span>
  )
}

function NotFound({ name }) {
  return (
    <main className="previews-notfound">
      <Seo path={`/components/${name}`} {...NOT_FOUND_META} />
      <div className="container">
        <h1>No preview named "{name}"</h1>
        <p>
          <Link to="/components">← Back to components</Link>
        </p>
      </div>
    </main>
  )
}
