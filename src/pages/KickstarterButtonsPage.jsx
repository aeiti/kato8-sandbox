import KickstarterButton from '../components/KickstarterButton'
import '../styles/kickstarter-button.css'
import '../styles/kickstarter-buttons-page.css'

const CATEGORIES = [
  {
    tag: 'Shadow',
    heading: 'What the offset shadow is made of',
    what: 'color / material',
    entries: [
      {
        variant: 's1',
        title: 'S1 — Green shadow',
        code: 'shadow: #009b62',
        why: 'Monochromatic — no dark-cobalt at all. Softer, more brand-green-forward.',
      },
      {
        variant: 's2',
        title: 'S2 — Squid-pink shadow',
        code: 'shadow: #e5718a',
        why: "Uses the site's accent color for the shadow. Ties the button to the rest of the palette.",
      },
      {
        variant: 's3',
        title: 'S3 — Soft diffused drop shadow',
        code: '0 4px 0 + 0 6px 14px',
        why: 'Combines hard-offset with a soft ambient shadow. Feels more premium/less flat.',
      },
    ],
  },
  {
    tag: 'Motion',
    heading: 'What moves on hover (beyond the arrow)',
    what: 'what animates',
    entries: [
      {
        variant: 'm1',
        title: 'M1 — K mark bumps',
        code: 'scale(1.15) rotate(-8deg)',
        why: 'Arrow still slides; K mark also gives a playful tilt. Adds character.',
      },
      {
        variant: 'm2',
        title: 'M2 — Whole button lifts',
        code: 'translateY(-3px)',
        why: 'Instead of arrow-slide, the whole button rises. Feels weighty and tactile.',
      },
      {
        variant: 'm3',
        title: 'M3 — Sheen sweep',
        code: 'light gradient sweeps across',
        why: 'A brief highlight sweeps left-to-right on hover. Modern SaaS feel; can look flashy.',
      },
    ],
  },
  {
    tag: 'Color',
    heading: 'Where the color goes on hover',
    what: 'background transition',
    entries: [
      {
        variant: 'c1',
        title: 'C1 — Green → dark cobalt',
        code: '#05CE78 → #1b1b26',
        why: 'Bg goes to the shadow color; text/K flip to green. Very dramatic invert, ties everything to cobalt.',
      },
      {
        variant: 'c2',
        title: 'C2 — Gradient deepen',
        code: 'bright→green → green→deep',
        why: 'Diagonal gradient at rest gets deeper on hover. More dimensional than flat.',
      },
      {
        variant: 'c3',
        title: 'C3 — Green → site pearl',
        code: '#05CE78 → #f5efef',
        why: "Bg flips to the site's off-white; text becomes green. Boldest inversion, most eye-catching.",
      },
    ],
  },
]

export default function KickstarterButtonsPage() {
  return (
    <main className="kickstarter-buttons-page">
      <header className="kickstarter-buttons-page_header">
        <h1 className="kickstarter-buttons-page_title">Kickstarter button — round 2</h1>
        <p className="kickstarter-buttons-page_subtitle">
          All keep the top pick's DNA:{' '}
          <strong>
            offset hard shadow at rest → shadow lift on hover, KS green base, Reem
            Kufi 400, arrow slide (except M2)
          </strong>
          . Each category varies <em>one</em> axis. Hover each to compare.
        </p>
      </header>

      {CATEGORIES.map((category) => (
        <section key={category.tag} className="kickstarter-buttons-page_category">
          <div className="kickstarter-buttons-page_cat-header">
            <span className="kickstarter-buttons-page_cat-tag">{category.tag}</span>
            <h2 className="kickstarter-buttons-page_cat-heading">{category.heading}</h2>
            <span className="kickstarter-buttons-page_cat-what">{category.what}</span>
          </div>
          <div className="kickstarter-buttons-page_grid">
            {category.entries.map((entry) => (
              <div key={entry.variant} className="kickstarter-buttons-page_swatch">
                <h3 className="kickstarter-buttons-page_swatch-title">{entry.title}</h3>
                <code className="kickstarter-buttons-page_swatch-code">{entry.code}</code>
                <div className="kickstarter-buttons-page_swatch-btn">
                  <KickstarterButton variant={entry.variant} href="#" />
                </div>
                <p className="kickstarter-buttons-page_swatch-why">{entry.why}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <footer className="kickstarter-buttons-page_note">
        <strong>How to pick:</strong> think about which category matters most.
        If the shadow should stay dark-cobalt (matches the site's{' '}
        <code>.button</code>), skip S1/S2. If you want the button to feel
        "alive," M1 or M3 layer on top of any color choice. If you want maximum
        visual pop when someone gets close to clicking, C3 (green→pearl) is the
        loudest.
      </footer>
    </main>
  )
}
