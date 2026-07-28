import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { staticRoutes } from '../data/seo-config'
import '../styles/home.css'

const experiments = [
  {
    path: '/kickstarter-buttons',
    title: 'Kickstarter button — round 2',
    description:
      'Nine hover variants across three axes (shadow, motion, color) for the Kickstarter CTA. For team review.',
  },
]

const sections = [
  {
    path: '/components',
    title: 'Components',
    description:
      'Every component from the main site (Nav, Footer, Hero, GameCard, forms, etc.), rendered in isolation for review.',
  },
]

export default function HomePage() {
  return (
    <main className="sandbox-home">
      <Seo path="/" {...staticRoutes['/']} />
      <div className="container">
        <header className="sandbox-home_header">
          <h1 className="sandbox-home_title">Kato.8 Sandbox</h1>
          <p className="sandbox-home_subtitle">
            Design experiments, component previews, prototypes.
          </p>
        </header>

        <section className="sandbox-home_section">
          <h2 className="sandbox-home_section-title">Browse</h2>
          <ul className="sandbox-home_list">
            {sections.map((section) => (
              <li key={section.path} className="sandbox-home_item">
                <Link to={section.path} className="sandbox-home_item-link">
                  {section.title}
                </Link>
                <p className="sandbox-home_item-desc">{section.description}</p>
              </li>
            ))}
          </ul>
        </section>

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
