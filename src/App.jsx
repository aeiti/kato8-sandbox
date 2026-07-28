import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import KickstarterButtonsPage from './pages/KickstarterButtonsPage'

export default function App() {
  return (
    <div className="body">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kickstarter-buttons" element={<KickstarterButtonsPage />} />
      </Routes>
    </div>
  )
}
