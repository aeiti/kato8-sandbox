import { useState } from 'react'
import { studioBios } from '../data/studioBios'
import PokemonBioCard from './PokemonBioCard'
import MagicBioCard from './MagicBioCard'
import YugiohBioCard from './YugiohBioCard'

/**
 * The studio-bios gallery: a responsive grid of collector cards plus a
 * style switcher that flips every card between the Pokémon, Magic, and
 * Yu-Gi-Oh! frames. All three read the same `studioBios` records, so the
 * data source is the single source of truth regardless of frame.
 */
const FRAMES = {
  pokemon: { label: 'Pokémon', Card: PokemonBioCard },
  magic: { label: 'Magic', Card: MagicBioCard },
  yugioh: { label: 'Yu-Gi-Oh!', Card: YugiohBioCard },
}

export default function StudioBioGallery() {
  const [frame, setFrame] = useState('pokemon')
  const Card = FRAMES[frame].Card

  return (
    <>
      <div className="sb-switcher" role="group" aria-label="Card style">
        {Object.entries(FRAMES).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className="sb-switcher__btn"
            aria-pressed={frame === key}
            onClick={() => setFrame(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="sb-grid">
        {studioBios.map((person) => (
          <Card key={person.slug} person={person} />
        ))}
      </div>
    </>
  )
}
