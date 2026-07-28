import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import KickstarterButtonsPage from './pages/KickstarterButtonsPage'
import PreviewPage from './previews/PreviewPage'

export default function App() {
  return (
    <div className="body">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kickstarter-buttons" element={<KickstarterButtonsPage />} />
        <Route path="/components" element={<PreviewPage />} />
        <Route path="/components/:name" element={<PreviewPage />} />
      </Routes>
    </div>
  )
}
