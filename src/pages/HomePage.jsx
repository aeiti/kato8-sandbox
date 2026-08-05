import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { staticRoutes } from '../data/seo-config'
import '../styles/home.css'

const experiments = [
  {
    path: '/kickstarter-button-v2',
    title: 'Kickstarter Button v2',
    active: true,
    description:
      'Flatter, "official-partner" take on the shipped Kickstarter CTA — response to v1 reading as designed-by-AI. Side-by-side with v1 for team review.',
  },
  {
    path: '/kickstarter-buttons',
    title: 'Kickstarter Button',
    active: false,
    description:
      'Nine hover variants across three axes (shadow, motion, color) for the Kickstarter CTA. Top pick shipped to prod 2026-07-29; page kept as the historical record.',
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

const pages = [
  {
    path: '/crowdfunding-games',
    title: 'Crowdfunding Games',
    description:
      'Full-page preview of the crowdfunding games landing plus its six per-game detail pages (main-section layout, placeholder content). Live on staging; previewed here for review.',
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
          <h2 className="sandbox-home_section-title">Pages</h2>
          <ul className="sandbox-home_list">
            {pages.map((page) => (
              <li key={page.path} className="sandbox-home_item">
                <Link to={page.path} className="sandbox-home_item-link">
                  {page.title}
                </Link>
                <p className="sandbox-home_item-desc">{page.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="sandbox-home_section">
          <h2 className="sandbox-home_section-title">Experiments</h2>
          <ul className="sandbox-home_list">
            {experiments.map((exp) => (
              <li key={exp.path} className="sandbox-home_item">
                <div className="sandbox-home_item-heading">
                  <Link to={exp.path} className="sandbox-home_item-link">
                    {exp.title}
                  </Link>
                  <span
                    className={`sandbox-home_status sandbox-home_status--${exp.active ? 'active' : 'concluded'}`}
                  >
                    {exp.active ? 'Active' : 'Concluded'}
                  </span>
                </div>
                <p className="sandbox-home_item-desc">{exp.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
