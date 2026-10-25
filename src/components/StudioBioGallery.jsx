import { getStudioBiosByTeam } from '../data/studioBios'
import PokemonBioCard from './PokemonBioCard'
import MagicBioCard from './MagicBioCard'
import YugiohBioCard from './YugiohBioCard'

/**
 * The studio-bios gallery: one section per team (in `TEAMS` order), each a
 * responsive grid of collector cards. Every person is dealt in their own
 * frame — `person.style` picks Pokémon, Magic, or Yu-Gi-Oh! — so the
 * `studioBios` records stay the single source of truth for both the
 * grouping and the look. Pass `card` to deal every person into one card
 * component instead (e.g. `FrameBioCard` on /studio-bios-frames).
 */
const FRAMES = {
  pokemon: PokemonBioCard,
  magic: MagicBioCard,
  yugioh: YugiohBioCard,
}

export default function StudioBioGallery({ card }) {
  return getStudioBiosByTeam().map((team) => (
    <section className="sb-team" key={team.slug} aria-labelledby={`sb-team-${team.slug}`}>
      <h2 className="sb-team__title" id={`sb-team-${team.slug}`}>
        {team.label}
        <span className="sb-team__count">{team.people.length}</span>
      </h2>
      <div className="sb-grid">
        {team.people.map((person) => {
          const Card = card || FRAMES[person.style] || PokemonBioCard
          return <Card key={person.slug} person={person} />
        })}
      </div>
    </section>
  ))
}
