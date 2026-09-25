import TemplateBioCard from './TemplateBioCard'
import BioCardArt from './BioCardArt'

// ↓ Real template art goes here. Drop the file in at this path, or point
//   this at wherever it lands. Slot positions live in studio-bios.css
//   (.sb-tpl__* — and re-tune them once the real frame replaces the
//   placeholder, since the real art's slots will sit differently).
const TEMPLATE_SRC = '/assets/sandbox/templates/pokemon-card.svg'

/**
 * Pokémon card built on a template IMAGE: the bio data is overlaid on the
 * blank Pokémon frame. Same data as `PokemonBioCard`, different rendering
 * strategy (image + overlay vs. CSS-drawn). Builds on `TemplateBioCard`.
 */
export default function PokemonTemplateCard({ person }) {
  const p = person.pokemon || {}

  return (
    <TemplateBioCard person={person} variant="poke" templateSrc={TEMPLATE_SRC}>
      <div className="sb-tpl__name">{person.name}</div>
      <div className="sb-tpl__stat-top">HP {p.hp ?? 100}</div>

      <BioCardArt person={person} className="sb-tpl__art" />

      <div className="sb-tpl__role">{person.role}</div>

      <div className="sb-tpl__body">
        {(person.specialties || []).map((s) => (
          <p className="sb-tpl__line" key={s.name}>
            <b>{s.name}.</b> {s.text}
          </p>
        ))}
      </div>

      <div className="sb-tpl__stats">
        <span>WEAK {p.weakness || '—'}</span>
        <span>RETREAT {'●'.repeat(p.retreat || 1)}</span>
      </div>
    </TemplateBioCard>
  )
}
