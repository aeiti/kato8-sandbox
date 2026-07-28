import { Link } from 'react-router-dom'
import '../styles/home.css'

const experiments = [
  {
    path: '/kickstarter-buttons',
    title: 'Kickstarter button — round 2',
    description:
      'Nine hover variants across three axes (shadow, motion, color) for the Kickstarter CTA. For team review.',
  },
]

export default function HomePage() {
  return (
    <main className="sandbox-home">
      <div className="container">
        <header className="sandbox-home_header">
          <h1 className="sandbox-home_title">Kato.8 Sandbox</h1>
          <p className="sandbox-home_subtitle">
            Design experiments, component previews, prototypes.
          </p>
        </header>

        <section className="sandbox-home_section">
          <h2 className="sandbox-home_section-title">Experiments</h2>
          <ul className="sandbox-home_list">
            {experiments.map((exp) => (
              <li key={exp.path} className="sandbox-home_item">
                <Link to={exp.path} className="sandbox-home_item-link">
                  {exp.title}
                </Link>
                <p className="sandbox-home_item-desc">{exp.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
