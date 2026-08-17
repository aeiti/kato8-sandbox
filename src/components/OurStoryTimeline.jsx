import '../styles/our-story-timeline.css'

/**
 * "Our Story" milestone timeline — vendored from the external-site
 * `about-timeline-section` branch (commit 5699085, "Add Our Story
 * timeline section to About page"). It is NOT on external-site `main`
 * yet, so per PROCESS.md §1b we vendor a copy here instead of importing
 * from `kato8studios-site`.
 *
 * Renders an alternating-card timeline: cards zigzag left/right around a
 * centered vertical line; below 767px the line collapses to the left
 * edge and cards stack full-width. Driven by the `milestones` array —
 * edit it to add, remove, or reorder entries.
 *
 * When the branch graduates to external-site `main`, delete this file
 * and `src/styles/our-story-timeline.css` and switch consumers to import
 * the upstream section (see PROCESS.md §5).
 */
const milestones = [
  {
    date: 'December 2025',
    title: 'Milestone Title Here',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet.',
  },
  {
    date: 'January 2026',
    title: 'Milestone Title Here',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet.',
  },
  {
    date: 'January 2026',
    title: 'Milestone Title Here',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet.',
  },
  {
    date: 'January 2026',
    title: 'Milestone Title Here',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet.',
  },
]

export default function OurStoryTimeline() {
  return (
    <section className="our-story-section">
      <h2 className="our-story-heading">Our Story</h2>
      <ol className="timeline">
        {milestones.map((milestone, index) => {
          const side = index % 2 === 0 ? 'left' : 'right'
          return (
            <li key={index} className={`timeline-row timeline-row--${side}`}>
              <div className="timeline-card">
                <span className="timeline-date-badge">{milestone.date}</span>
                <div className="timeline-card-title">{milestone.title}</div>
                <p className="timeline-card-description">{milestone.description}</p>
              </div>
              <span className="timeline-dot" aria-hidden="true" />
            </li>
          )
        })}
      </ol>
    </section>
  )
}
