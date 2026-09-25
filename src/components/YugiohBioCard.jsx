import BioCard from './BioCard'
import BioCardArt from './BioCardArt'

/**
 * Yu-Gi-Oh!-style collector card for one studio member. Name + attribute
 * badge up top, a row of level stars, role folded into the monster-type
 * line, the bio + specialties as effect text, and ATK/DEF from the
 * `yugioh` block. Builds on the shared `BioCard` base (shell, `--sb-accent`
 * theming, `cardImage` escape hatch).
 */
export default function YugiohBioCard({ person }) {
  const y = person.yugioh || {}
  const level = y.level ?? 4

  return (
    <BioCard person={person} frameClass="sb-ygo">
      <div className="sb-ygo__inner">
        <div className="sb-ygo__head">
          <span className="sb-ygo__name">{person.name}</span>
          <span className="sb-ygo__attr" title={y.attribute}>{y.attribute || 'LIGHT'}</span>
        </div>

        <div className="sb-ygo__stars" aria-label={`Level ${level}`}>
          {Array.from({ length: level }).map((_, i) => (
            <svg key={i} className="sb-ygo__star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8-5.1-4.6 6.9-.7z" />
            </svg>
          ))}
        </div>

        <BioCardArt person={person} className="sb-ygo__art" />

        <div className="sb-ygo__type">[ {y.monsterType || 'Effect'} ]</div>

        <div className="sb-ygo__text">
          <p className="sb-ygo__effect">{person.bio}</p>
          {(person.specialties || []).map((s) => (
            <p className="sb-ygo__effect" key={s.name}>
              <b>● {s.name}:</b> {s.text}
            </p>
          ))}
        </div>

        <div className="sb-ygo__stats">
          <span className="sb-ygo__serial">KATO8-{person.slug.slice(0, 3).toUpperCase()}</span>
          <span>ATK/{y.atk ?? 1500}</span>
          <span>DEF/{y.def ?? 1500}</span>
        </div>
      </div>
    </BioCard>
  )
}
