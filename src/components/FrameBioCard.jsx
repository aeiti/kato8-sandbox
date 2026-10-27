import { useState } from 'react'
import BioCardArt from './BioCardArt'
import { getCardTheme } from '../data/studioBios'
import { asset } from '../utils/asset'
import '../styles/studio-bios.css'

/**
 * Collector card built from the studio's finished card artwork rather than
 * a CSS-drawn frame. The front is the frame image for the person's
 * `style` + `color` (public/assets/sandbox/frames/<style>-<color>.png)
 * with their photo set into the frame's art window; clicking flips it to
 * that style's back (back-<style>.png).
 *
 * When the person has a finished card from the designer (`cardImage`),
 * that image is the front as-is. Otherwise the blank frame still carries
 * the designer's sample text, so only the photo is personalized. Either
 * way the real name and title sit in a caption under the card.
 *
 * Art-window boxes are measured from the 750×1050 source images, as
 * percentages so they scale with the card.
 */
const ART_WINDOWS = {
  pokemon: { left: '11.07%', top: '12.57%', width: '78%', height: '35.81%' },
  magic: { left: '9.07%', top: '13.9%', width: '81.6%', height: '40.57%' },
  yugioh: { left: '12.27%', top: '23.24%', width: '74.93%', height: '49.43%' },
}

export default function FrameBioCard({ person }) {
  const [flipped, setFlipped] = useState(false)
  const style = ART_WINDOWS[person.style] ? person.style : 'pokemon'
  const color = person.color || 'dark-blue'

  return (
    <figure className="sbf">
      <button
        type="button"
        className="sbf-card"
        aria-pressed={flipped}
        aria-label={`${person.name} — ${flipped ? 'show front' : 'flip card'}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <span className="sbf-card__inner">
          <span className="sbf-face sbf-face--front">
            <img
              className="sbf-face__img"
              src={asset(person.cardImage || `/assets/sandbox/frames/${style}-${color}.png`)}
              alt=""
              loading="lazy"
            />
            {!person.cardImage && (
              <span
                className="sbf-art"
                style={{ ...ART_WINDOWS[style], '--sb-accent': getCardTheme(person).accent }}
              >
                <BioCardArt person={person} className="sbf-art__window" />
              </span>
            )}
          </span>
          <span className="sbf-face sbf-face--back">
            <img
              className="sbf-face__img"
              src={asset(`/assets/sandbox/frames/back-${style}.png`)}
              alt=""
              loading="lazy"
            />
          </span>
        </span>
      </button>
      <figcaption className="sbf-caption">
        <span className="sbf-caption__name">{person.name}</span>
        {person.role && <span className="sbf-caption__role">{person.role}</span>}
      </figcaption>
    </figure>
  )
}
