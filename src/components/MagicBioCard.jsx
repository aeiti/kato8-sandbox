import BioCardArt from './BioCardArt'
import { getCardTheme } from '../data/studioBios'

/**
 * Magic: The Gathering-style collector card for one studio member. Name +
 * mana cost in the title bar, role as the type line, `specialties` as
 * rules abilities, the bio as italic flavor text, and the `magic` block
 * for cost / rarity / power / toughness. Themed by `type` via `--sb-accent`.
 */
export default function MagicBioCard({ person }) {
  const theme = getCardTheme(person)
  const m = person.magic || {}

  if (person.cardImage) {
    return (
      <article className="sb-card sb-card--image">
        <img className="sb-card__image" src={person.cardImage} alt={person.name} />
      </article>
    )
  }

  return (
    <article className="sb-card sb-mtg" style={{ '--sb-accent': theme.accent }}>
      <div className="sb-mtg__inner">
        <div className="sb-mtg__bar">
          <span className="sb-mtg__name">{person.name}</span>
          <span className="sb-mtg__cost">{m.cost || ''}</span>
        </div>

        <BioCardArt person={person} className="sb-mtg__art" />

        <div className="sb-mtg__type">
          <span>Legendary Creature — {person.role}</span>
          <span className="sb-mtg__set">★</span>
        </div>

        <div className="sb-mtg__text">
          {(person.specialties || []).map((s) => (
            <p className="sb-mtg__ability" key={s.name}>
              <b>{s.name}.</b> {s.text}
            </p>
          ))}
          <p className="sb-mtg__flavor">“{person.bio}”</p>
        </div>

        <div className="sb-mtg__footer">
          <span className="sb-mtg__meta">
            {m.rarity || 'Rare'} · {theme.magicColor} · Kato.8 Studios
          </span>
          <span className="sb-mtg__pt">
            {m.power ?? 2}/{m.toughness ?? 2}
          </span>
        </div>
      </div>
    </article>
  )
}
