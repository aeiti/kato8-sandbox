import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'kato8studios-site/src/styles/main/tokens.css'
import 'kato8studios-site/src/styles/main/typography.css'
import 'kato8studios-site/src/styles/main/base.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
