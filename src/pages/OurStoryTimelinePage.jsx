import OurStoryTimeline from '../components/OurStoryTimeline'
import Seo from '../components/Seo'
import { staticRoutes } from '../data/seo-config'
import '../styles/experiment-intro.css'

/**
 * Experiment: the "Our Story" milestone timeline destined for the About
 * page. Source is the external-site `about-timeline-section` branch,
 * which isn't on `main` yet — so the section is vendored into the
 * sandbox (see src/components/OurStoryTimeline.jsx and PROCESS §1b).
 *
 * The section is full-bleed (its own gradient + padding), so it renders
 * edge-to-edge below a short sandbox intro.
 */
export default function OurStoryTimelinePage() {
  return (
    <main>
      <Seo path="/our-story-timeline" {...staticRoutes['/our-story-timeline']} />
      <div className="experiment-intro container">
        <h1 className="experiment-intro_title">Our Story timeline</h1>
        <p className="experiment-intro_subtitle">
          Milestone timeline proposed for the bottom of the About page.
          Alternating cards zigzag around a centered line; below 767px the
          line collapses to a left rail and cards stack full-width. Content
          is placeholder — the <code>milestones</code> array in{' '}
          <code>OurStoryTimeline.jsx</code> drives the entries. Vendored from
          external-site branch <code>about-timeline-section</code> (not yet on
          main).
        </p>
      </div>
      <OurStoryTimeline />
    </main>
  )
}
