import { Link } from 'react-router-dom'
import { archived } from '../data/archive'
import '../styles/home.css'
import '../styles/archive.css'

/** `/archive`: retired sandbox pages, kept for reference. */
export default function ArchivePage() {
  return (
    <main className="sandbox-home">
      <div className="container">
        <header className="sandbox-home_header">
          <h1 className="sandbox-home_title">Archive</h1>
          <p className="sandbox-home_subtitle">
            Earlier versions of sandbox pages, kept for reference after they were replaced.
          </p>
        </header>

        <ul className="sandbox-home_list">
          {archived.map((entry) => (
            <li key={entry.path} className="sandbox-home_item">
              <Link to={entry.path} className="sandbox-home_item-link">
                {entry.title}
              </Link>
              <p className="sandbox-home_item-desc">{entry.description}</p>
              <p className="archive-entry_meta">
                Archived {entry.archived}
                {entry.replacedBy && <> · replaced by <Link to={entry.replacedBy}>{entry.replacedBy}</Link></>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
