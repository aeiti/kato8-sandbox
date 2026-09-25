import TemplateBioCard from './TemplateBioCard'
import BioCardArt from './BioCardArt'

// ↓ Real template art goes here (see PokemonTemplateCard for the swap note).
const TEMPLATE_SRC = '/assets/sandbox/templates/yugioh-card.svg'

/**
 * Yu-Gi-Oh! card built on a template IMAGE: the bio data is overlaid on the
 * blank Yu-Gi-Oh! frame. Same data as `YugiohBioCard`, image + overlay
 * strategy. Builds on `TemplateBioCard`; uses the `--ygo` slot overrides in
 * studio-bios.css (art lower/squarer, attribute badge, level-star strip).
 */
export default function YugiohTemplateCard({ person }) {
  const y = person.yugioh || {}
  const level = y.level ?? 4

  return (
    <TemplateBioCard person={person} variant="ygo" templateSrc={TEMPLATE_SRC}>
      <div className="sb-tpl__name">{person.name}</div>
      <div className="sb-tpl__attr">{y.attribute || 'LIGHT'}</div>
      <div className="sb-tpl__stars" aria-label={`Level ${level}`}>{'★'.repeat(level)}</div>

      <BioCardArt person={person} className="sb-tpl__art" />

      <div className="sb-tpl__role">[ {y.monsterType || 'Effect'} ]</div>

      <div className="sb-tpl__body">
        <p className="sb-tpl__line">{person.bio}</p>
        {(person.specialties || []).map((s) => (
          <p className="sb-tpl__line" key={s.name}>
            <b>● {s.name}:</b> {s.text}
          </p>
        ))}
      </div>

      <div className="sb-tpl__stats">
        <span>ATK/{y.atk ?? 1500}</span>
        <span>DEF/{y.def ?? 1500}</span>
      </div>
    </TemplateBioCard>
  )
}
