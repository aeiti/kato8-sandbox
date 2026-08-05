import { Link, useParams } from 'react-router-dom'
import { previews, previewByName } from './registry'
import Seo from '../components/Seo'
import { staticRoutes, componentRoutes, NOT_FOUND_META } from '../data/seo-config'
import '../styles/previews.css'

export default function PreviewPage() {
  const { name } = useParams()
  if (!name) return <Gallery />
  const entry = previewByName[name]
  if (!entry) return <NotFound name={name} />
  return <SinglePreview entry={entry} />
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
                <h2 className="previews-gallery_item-title">{entry.label}</h2>
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

function SinglePreview({ entry }) {
  const meta = componentRoutes[entry.name]
  return (
    <div className={`preview-frame preview-frame--${entry.background}`}>
      {meta && <Seo path={`/components/${entry.name}`} {...meta} />}
      <div className="preview-frame_bar">
        <div className="container preview-frame_bar-inner">
          <Link to="/components" className="preview-frame_back">← Components</Link>
          <span className="preview-frame_label">{entry.label}</span>
          <span className="preview-frame_desc">{entry.description}</span>
        </div>
      </div>
      <div className="preview-frame_stage">{entry.render()}</div>
    </div>
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
