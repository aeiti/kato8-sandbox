import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <div className="body">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}
