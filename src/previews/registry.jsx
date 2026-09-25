import Nav from 'kato8studios-site/src/components/Nav'
import Footer from 'kato8studios-site/src/components/Footer'
import Hero from 'kato8studios-site/src/components/Hero'
import GameCard from 'kato8studios-site/src/components/GameCard'
import GameGrid from 'kato8studios-site/src/components/GameGrid'
import MobileMenu from 'kato8studios-site/src/components/MobileMenu'
import GoFundMeWidget from 'kato8studios-site/src/components/GoFundMeWidget'
import SupportSection from 'kato8studios-site/src/components/SupportSection'
import { socialLinks, SocialIcon } from 'kato8studios-site/src/components/SocialIcons'
import NewsletterSignup from 'kato8studios-site/src/components/NewsletterSignup'
import DiscordSignupForm from 'kato8studios-site/src/components/DiscordSignupForm'
import PlaytestSignupForm from 'kato8studios-site/src/components/PlaytestSignupForm'
import ProdKickstarterButton from 'kato8studios-site/src/components/KickstarterButton'
import { games } from 'kato8studios-site/src/data/games'
// Vendored WIP (external-site branch about-timeline-section, not on main
// yet) — local import rather than from kato8studios-site. See PROCESS §1b.
import OurStoryTimeline from '../components/OurStoryTimeline'
// Vendored investor-page prototypes (not on main yet — see PROCESS §1b):
// a request form plus the Nav / MobileMenu copies that add the Investors tab.
import InvestorRequestForm from '../components/InvestorRequestForm'
import SandboxNav from '../components/SandboxNav'
import SandboxMobileMenu from '../components/SandboxMobileMenu'
// Studio-bio collector cards: three CSS-drawn frames over one shared
// BioCard base, plus three image-template variants over TemplateBioCard.
import PokemonBioCard from '../components/PokemonBioCard'
import MagicBioCard from '../components/MagicBioCard'
import YugiohBioCard from '../components/YugiohBioCard'
import PokemonTemplateCard from '../components/PokemonTemplateCard'
import MagicTemplateCard from '../components/MagicTemplateCard'
import YugiohTemplateCard from '../components/YugiohTemplateCard'
import { studioBios } from '../data/studioBios'
import { previewEntries, entryByName } from './entries.js'

// Render thunks keyed by preview name. Kept separate from entries.js
// (plain-data list, no React) so Node scripts like scripts/prerender.mjs
// can read the metadata without needing a JSX transform.
//
// Every entry uses background: 'light' for now; kept as a per-entry
// property so a future preview can opt into a dark stage without
// reshaping the frame.
const renderers = {
  'nav':                  () => <Nav />,
  'footer':               () => <Footer />,
  'hero':                 () => <Hero />,
  'game-grid':            () => <GameGrid />,
  'game-card':            () => (
    <div className="games-cards-wrapper" style={{ maxWidth: 640, margin: '0 auto' }}>
      <GameCard game={games[0]} />
    </div>
  ),
  'mobile-menu':          () => <MobileMenu open onClose={() => {}} />,
  'gofundme-widget':      () => <GoFundMeWidget size="large" />,
  'support-section':      () => <SupportSection />,
  'social-icons':         () => (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
      {socialLinks.map((link) => (
        <SocialIcon key={link.name} {...link} />
      ))}
    </div>
  ),
  'newsletter-signup':    () => <NewsletterSignup source="sandbox" />,
  'discord-signup-form':  () => (
    <DiscordSignupForm source="sandbox" gameTitle="Universal Serial Blade" />
  ),
  'playtest-signup-form': () => (
    <PlaytestSignupForm source="sandbox" gameTitle="Universal Serial Blade" />
  ),
  'kickstarter-button':   () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ProdKickstarterButton href="https://www.kickstarter.com/projects/kato8-lastlight/universal-serial-blade-usb" />
    </div>
  ),
  'our-story-timeline':   () => <OurStoryTimeline />,
  'investor-request-form': () => <InvestorRequestForm source="sandbox" />,
  'sandbox-nav':          () => <SandboxNav />,
  'sandbox-mobile-menu':  () => <SandboxMobileMenu open onClose={() => {}} />,
  'bio-cards':            () => {
    // One member across all three frames, so the shared BioCard base is
    // obvious at a glance. studioBios[0] is the founder (a `vision` type).
    const person = studioBios[0]
    return (
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        <PokemonBioCard person={person} />
        <MagicBioCard person={person} />
        <YugiohBioCard person={person} />
      </div>
    )
  },
  'pokemon-template-card': () => <PokemonTemplateCard person={studioBios[0]} />,
  'magic-template-card':   () => <MagicTemplateCard person={studioBios[0]} />,
  'yugioh-template-card':  () => <YugiohTemplateCard person={studioBios[0]} />,
}

export const previews = previewEntries.map((entry) => ({
  ...entry,
  background: 'light',
  render: renderers[entry.name],
}))

export const previewByName = Object.fromEntries(previews.map((p) => [p.name, p]))

export { previewEntries, entryByName }
