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
        <p>
          None yet. Add a route in <code>src/App.jsx</code> and drop a page in{' '}
          <code>src/pages/</code>.
        </p>
      </section>
    </main>
  )
}
