import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import KickstarterButtonsPage from './pages/KickstarterButtonsPage'
import KickstarterButtonV2Page from './pages/KickstarterButtonV2Page'
import PreviewPage from './previews/PreviewPage'

export default function App() {
  return (
    <div className="body">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kickstarter-buttons" element={<KickstarterButtonsPage />} />
        <Route path="/kickstarter-button-v2" element={<KickstarterButtonV2Page />} />
        <Route path="/components" element={<PreviewPage />} />
        <Route path="/components/:name" element={<PreviewPage />} />
      </Routes>
    </div>
  )
}
