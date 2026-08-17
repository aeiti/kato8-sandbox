import GoFundMeWidget from 'kato8studios-site/src/components/GoFundMeWidget'
import NewsletterSignup from 'kato8studios-site/src/components/NewsletterSignup'
import Seo from '../components/Seo'
import { staticRoutes } from '../data/seo-config'
import '../styles/newsletter-on-about.css'

/**
 * Experiment: NewsletterSignup mounted at the bottom of the About page.
 * Source is the external-site `mount-newsletter-on-about` branch, which
 * (1) drops `<NewsletterSignup source="about" />` below the Support
 * Kato.8 section and (2) tightens the form's top spacing so it hugs that
 * section instead of sitting a full stacked margin below it.
 *
 * `NewsletterSignup` and `GoFundMeWidget` are already on external-site
 * `main`, so they're imported from `kato8studios-site` — nothing is
 * vendored. The only new CSS is the branch's spacing pull-up, scoped
 * under `.newsletter-on-about` (see src/styles/newsletter-on-about.css)
 * so it doesn't affect the standalone NewsletterSignup gallery preview.
 *
 * The Support Kato.8 markup is copied from `AboutPage.jsx` on main so
 * the spacing relationship the branch tunes is visible in context. Its
 * classes (`support-kato8-section`, `frame-122`, …) come from the
 * globally-imported about.css / support.css.
 */
export default function NewsletterOnAboutPage() {
  return (
    <main className="newsletter-on-about">
      <Seo path="/newsletter-on-about" {...staticRoutes['/newsletter-on-about']} />

      <div className="support-kato8-section">
        <div className="frame-122">
          <div className="support-section_heading">Support Kato.8</div>
          <div className="paragraph-2">
            If you'd like to support the early stages of Kato.8's journey, you
            can learn more about our plans and contribute through our GoFundMe.
            Every bit of support helps move the studio one step closer to our
            first release.
          </div>
        </div>
        <GoFundMeWidget size="large" />
      </div>

      <NewsletterSignup source="about" />
    </main>
  )
}
