import BioCard from './BioCard'
import { asset } from '../utils/asset'

/**
 * Base for the image-template collector cards — the counterpart to the
 * CSS-drawn frames. Instead of drawing the card in CSS, it lays the studio
 * member's data over a real card TEMPLATE IMAGE (the blank art the studio
 * provides per TCG). The Pokémon / Magic / Yu-Gi-Oh! template variants all
 * build on this.
 *
 * It builds on `BioCard` (so it keeps the shared shell, `--sb-accent`
 * theming, and the `cardImage` escape hatch), then renders two layers:
 *   1. `templateSrc` — the blank template image, filling the card;
 *   2. a positioned overlay `layer` holding the variant's slots
 *      (name, art, stats, text …), placed by the `.sb-tpl__*` rules in
 *      studio-bios.css.
 *
 * `templateSrc` is a `/assets/...` path (piped through `asset()` so it
 * resolves on the Pages subpath). When absent, a hatched "add a template
 * image" placeholder renders so the missing asset is obvious.
 */
export default function TemplateBioCard({ person, variant, templateSrc, templateAlt = '', children }) {
  return (
    <BioCard person={person} frameClass={`sb-tpl sb-tpl--${variant}`}>
      {templateSrc ? (
        <img
          className="sb-tpl__img"
          src={asset(templateSrc)}
          alt={templateAlt}
          aria-hidden={templateAlt ? undefined : 'true'}
        />
      ) : (
        <div className="sb-tpl__img sb-tpl__img--missing">Add a {variant} template image</div>
      )}
      <div className="sb-tpl__layer">{children}</div>
    </BioCard>
  )
}
