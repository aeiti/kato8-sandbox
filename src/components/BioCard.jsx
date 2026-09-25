import { getCardTheme } from '../data/studioBios'
import '../styles/studio-bios.css'

/**
 * Base collector card — the shared shell every studio-bio frame builds on.
 * The Pokémon, Magic, and Yu-Gi-Oh! cards are all thin wrappers around
 * this; it owns the three things they have in common:
 *
 *   1. the `.sb-card` <article> shell (fixed collector-card aspect ratio,
 *      rounded corners, hover lift — see studio-bios.css);
 *   2. the per-person accent color, exposed as the `--sb-accent` custom
 *      property from the person's theme, which each frame's CSS reads;
 *   3. the `cardImage` escape hatch — when a person has a fully
 *      pre-rendered card image, that image is rendered instead and the
 *      frame markup is skipped entirely.
 *
 * Frames stay declarative: they pass a `frameClass` (e.g. `sb-poke`) and
 * their inner markup as `children`. `children` may be a function, which
 * receives the resolved theme so a frame can label its Pokémon type, Magic
 * color, or Yu-Gi-Oh! attribute without re-resolving it.
 *
 * Importing the stylesheet here (rather than only from the page) keeps a
 * card self-contained, so it renders correctly in the component-library
 * preview and anywhere else it's dropped in.
 */
export default function BioCard({ person, frameClass = '', children }) {
  if (person.cardImage) {
    return (
      <article className="sb-card sb-card--image">
        <img className="sb-card__image" src={person.cardImage} alt={person.name} />
      </article>
    )
  }

  const theme = getCardTheme(person)
  return (
    <article className={`sb-card ${frameClass}`.trim()} style={{ '--sb-accent': theme.accent }}>
      {typeof children === 'function' ? children(theme) : children}
    </article>
  )
}
