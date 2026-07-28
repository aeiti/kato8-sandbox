import { Link } from 'react-router-dom'

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
    <main
      style={{
        padding: '2rem',
        maxWidth: 720,
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1>Kato.8 Sandbox</h1>
      <p style={{ color: '#666' }}>
        Design experiments, component previews, prototypes.
      </p>
      <section style={{ marginTop: '2rem' }}>
        <h2>Experiments</h2>
        <ul>
          {experiments.map((exp) => (
            <li key={exp.path} style={{ marginBottom: '.5rem' }}>
              <Link to={exp.path}>{exp.title}</Link>
              <div style={{ color: '#666', fontSize: '.9rem' }}>{exp.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
