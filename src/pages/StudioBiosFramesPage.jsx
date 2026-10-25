import StudioBioGallery from '../components/StudioBioGallery'
import FrameBioCard from '../components/FrameBioCard'
import '../styles/studio-bios.css'

/**
 * Studio Bios — card artwork (`/studio-bios-frames`). Same people and team
 * sections as `/studio-bios`, but each card is the studio's finished frame
 * image with the person's photo in the art window, and flips to its back
 * on click. Data lives in `src/data/studioBios.js`.
 */
export default function StudioBiosFramesPage() {
  return (
    <section className="sb-page">
      <div className="sb-heading">
        <h1 className="sb-heading__title">Meet the Studio</h1>
        <p className="sb-heading__description">
          Every member of the team on their own trading card — grouped by Studio, USB, Last
          Light, and BBCU. Click a card to flip it.
        </p>
      </div>
      <StudioBioGallery card={FrameBioCard} />
    </section>
  )
}
