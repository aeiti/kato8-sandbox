import { Link } from 'react-router-dom'
import '../styles/archive.css'

/**
 * Bar at the top of an archived page saying when it was retired and what
 * replaced it. Takes the page's entry from `src/data/archive.js`.
 */
export default function ArchiveNotice({ entry }) {
  return (
    <p className="archive-notice">
      Archived {entry.archived}.{' '}
      {entry.replacedBy && (
        <>
          Replaced by <Link to={entry.replacedBy}>{entry.replacedBy}</Link>.{' '}
        </>
      )}
      <Link to="/archive">All archived pages</Link>
    </p>
  )
}
