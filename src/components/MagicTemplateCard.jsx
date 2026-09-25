import TemplateBioCard from './TemplateBioCard'
import BioCardArt from './BioCardArt'

// ↓ Real template art goes here (see PokemonTemplateCard for the swap note).
const TEMPLATE_SRC = '/assets/sandbox/templates/magic-card.svg'

/**
 * Magic card built on a template IMAGE: the bio data is overlaid on the
 * blank Magic frame. Same data as `MagicBioCard`, image + overlay strategy.
 * Builds on `TemplateBioCard`.
 */
export default function MagicTemplateCard({ person }) {
  const m = person.magic || {}

  return (
    <TemplateBioCard person={person} variant="mtg" templateSrc={TEMPLATE_SRC}>
      <div className="sb-tpl__name">{person.name}</div>
      <div className="sb-tpl__stat-top">{m.cost || ''}</div>

      <BioCardArt person={person} className="sb-tpl__art" />

      <div className="sb-tpl__role">Legendary Creature — {person.role}</div>

      <div className="sb-tpl__body">
        {(person.specialties || []).map((s) => (
          <p className="sb-tpl__line" key={s.name}>
            <b>{s.name}.</b> {s.text}
          </p>
        ))}
        <p className="sb-tpl__flavor">“{person.bio}”</p>
      </div>

      <div className="sb-tpl__stats">
        <span>{m.rarity || 'Rare'} · Kato.8</span>
        <span className="sb-tpl__pt">{m.power ?? 2}/{m.toughness ?? 2}</span>
      </div>
    </TemplateBioCard>
  )
}
