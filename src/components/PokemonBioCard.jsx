import BioCardArt from './BioCardArt'
import { getCardTheme } from '../data/studioBios'

/**
 * Pokémon-style collector card for one studio member. Reads name/role as
 * the card title + stage line, `specialties` as attacks, and the
 * `pokemon` block for HP / weakness / resistance / retreat. Themed by the
 * person's `type` via `--sb-accent`.
 */
export default function PokemonBioCard({ person }) {
  const theme = getCardTheme(person)
  const p = person.pokemon || {}

  if (person.cardImage) {
    return (
      <article className="sb-card sb-card--image">
        <img className="sb-card__image" src={person.cardImage} alt={person.name} />
      </article>
    )
  }

  return (
    <article className="sb-card sb-poke" style={{ '--sb-accent': theme.accent }}>
      <div className="sb-poke__inner">
        <div className="sb-poke__head">
          <div>
            <div className="sb-poke__stage">Studio Member</div>
            <div className="sb-poke__name">{person.name}</div>
          </div>
          <span className="sb-poke__hp">
            HP<b>{p.hp ?? 100}</b>
            <span className="sb-poke__type-dot" title={theme.pokemonType} />
          </span>
        </div>

        <BioCardArt person={person} className="sb-poke__art" />

        <div className="sb-poke__role">{person.role}</div>

        <div className="sb-poke__attacks">
          {(person.specialties || []).map((s) => (
            <div className="sb-poke__attack" key={s.name}>
              <div className="sb-poke__attack-head">
                <span className="sb-poke__energy" />
                <span className="sb-poke__attack-name">{s.name}</span>
              </div>
              <p className="sb-poke__attack-text">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="sb-poke__footer">
          <span>weakness <b>{p.weakness || '—'}</b></span>
          <span>resistance <b>{p.resistance || '—'}</b></span>
          <span>retreat <b>{'●'.repeat(p.retreat || 1)}</b></span>
        </div>
      </div>
    </article>
  )
}
