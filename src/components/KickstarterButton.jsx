/**
 * Kickstarter CTA button. Round-2 variants under evaluation.
 *
 *   variant  — one of s1/s2/s3 (shadow), m1/m2/m3 (motion), c1/c2/c3 (color).
 *   href     — Kickstarter campaign URL.
 *   label    — button text; defaults to "Back on Kickstarter".
 *
 * All 9 variants share the same base: KS green background, Reem Kufi 400,
 * dark-cobalt offset shadow, arrow slide on hover. Each variant tweaks one
 * axis. See src/pages/KickstarterButtonsPage.jsx for the full showcase.
 */
export default function KickstarterButton({
  variant,
  href,
  label = 'Back on Kickstarter',
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`kickstarter-button kickstarter-button--${variant}`}
    >
      <img
        src="/assets/img/kickstarter-logo-k-white.svg"
        alt=""
        className="kickstarter-button_logo"
      />
      <span className="kickstarter-button_text">{label}</span>
      <span className="kickstarter-button_arrow" aria-hidden="true">
        →
      </span>
    </a>
  )
}
