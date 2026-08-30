import StudioBioGallery from '../components/StudioBioGallery'
import Seo from '../components/Seo'
import { staticRoutes } from '../data/seo-config'
import '../styles/studio-bios.css'

/**
 * Studio Bios (`/studio-bios`) — each team member's personal bio rendered
 * as a collector's card, with a switcher to preview the same data in
 * Pokémon, Magic, and Yu-Gi-Oh! frames. Data lives in
 * `src/data/studioBios.js`; the shared Nav/Footer/back bar come from
 * `App.jsx`. Placeholder people until real bios land.
 */
export default function StudioBiosPage() {
  return (
    <section className="sb-page">
      <Seo path="/studio-bios" {...staticRoutes['/studio-bios']} />
      <div className="sb-heading">
        <h1 className="sb-heading__title">Meet the Studio</h1>
        <p className="sb-heading__description">
          Every member of the team, dealt out as a collector&rsquo;s card. Same bios, three
          frames — flip between them to see which look fits Kato.8 best.
        </p>
      </div>
      <StudioBioGallery />
    </section>
  )
}
