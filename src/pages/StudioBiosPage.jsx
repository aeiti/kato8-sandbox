import StudioBioGallery from '../components/StudioBioGallery'
import Seo from '../components/Seo'
import { staticRoutes } from '../data/seo-config'
import '../styles/studio-bios.css'

/**
 * Studio Bios (`/studio-bios`) — each team member's personal bio rendered
 * as a collector's card in their own Pokémon, Magic, or Yu-Gi-Oh! frame,
 * grouped by team. Data lives in `src/data/studioBios.js`; the shared
 * Nav/Footer/back bar come from `App.jsx`.
 */
export default function StudioBiosPage() {
  return (
    <section className="sb-page">
      <Seo path="/studio-bios" {...staticRoutes['/studio-bios']} />
      <div className="sb-heading">
        <h1 className="sb-heading__title">Meet the Studio</h1>
        <p className="sb-heading__description">
          Every member of the team, dealt out as a collector&rsquo;s card — grouped by
          Studio, USB, Last Light, and BBCU.
        </p>
      </div>
      <StudioBioGallery />
    </section>
  )
}
