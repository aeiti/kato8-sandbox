/**
 * The card "art window" shared by all three studio-bio card frames.
 * Renders the person's portrait (`avatar`) when present, otherwise a
 * themed monogram placeholder over the accent gradient defined in
 * studio-bios.css. `className` carries the per-frame border/aspect-ratio.
 */
export default function BioCardArt({ person, className }) {
  return (
    <div className={`sb-art ${className || ''}`}>
      {person.avatar ? (
        <img className="sb-art__img" src={person.avatar} alt={person.name} />
      ) : (
        <span className="sb-art__monogram">{person.monogram || person.name?.[0]}</span>
      )}
      <span className="sb-art__sheen" aria-hidden="true" />
    </div>
  )
}
