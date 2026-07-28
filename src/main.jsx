import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'kato8studios-site/src/styles/webflow-base.css'
import 'kato8studios-site/src/styles/main/tokens.css'
import 'kato8studios-site/src/styles/main/layout.css'
import 'kato8studios-site/src/styles/main/base.css'
import 'kato8studios-site/src/styles/main/nav.css'
import 'kato8studios-site/src/styles/main/typography.css'
import 'kato8studios-site/src/styles/main/buttons.css'
import 'kato8studios-site/src/styles/main/footer.css'
import 'kato8studios-site/src/styles/main/tags.css'
import 'kato8studios-site/src/styles/main/social-icons.css'
import 'kato8studios-site/src/styles/main/pages/home.css'
import 'kato8studios-site/src/styles/main/pages/about.css'
import 'kato8studios-site/src/styles/main/support.css'
import 'kato8studios-site/src/styles/main/newsletter-signup.css'
import 'kato8studios-site/src/styles/main/pages/games.css'
import 'kato8studios-site/src/styles/main/concept-art-gallery.css'
import 'kato8studios-site/src/styles/main/signup-form.css'
import 'kato8studios-site/src/styles/mobile-menu.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
