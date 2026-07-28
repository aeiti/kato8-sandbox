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
import { games } from 'kato8studios-site/src/data/games'

// Component previews. Each entry:
//   name        — URL slug at /components/<name>
//   label       — heading in gallery + individual page
//   description — one-line hint under the label
//   background  — 'light' (site white) or 'dark' (dark-cobalt); some
//                 components look right only against a specific bg
//   render      — thunk returning the JSX to preview
export const previews = [
  {
    name: 'nav',
    label: 'Nav',
    description: 'Top navigation bar with games dropdown, About link, and social icons. Mobile viewports collapse to a hamburger + MobileMenu.',
    background: 'light',
    render: () => <Nav />,
  },
  {
    name: 'footer',
    label: 'Footer',
    description: 'Site-wide footer: studio blurb, per-game links, community links, and the bottom legal bar.',
    background: 'light',
    render: () => <Footer />,
  },
  {
    name: 'hero',
    label: 'Hero',
    description: 'Home-page hero: studio logo + mission tagline. Uses responsive srcSet for the logo image.',
    background: 'light',
    render: () => <Hero />,
  },
  {
    name: 'game-grid',
    label: 'GameGrid',
    description: 'Home-page grid of GameCards, driven by the games data. Renders one card per entry in games.js.',
    background: 'light',
    render: () => <GameGrid />,
  },
  {
    name: 'game-card',
    label: 'GameCard',
    description: 'A single game tile. Rendered here with the first entry from games.js.',
    background: 'light',
    render: () => (
      <div className="games-cards-wrapper" style={{ maxWidth: 640, margin: '0 auto' }}>
        <GameCard game={games[0]} />
      </div>
    ),
  },
  {
    name: 'mobile-menu',
    label: 'MobileMenu',
    description: 'Slide-in menu used on narrow viewports. Rendered here in the always-open state; the close button is a no-op in preview.',
    background: 'light',
    render: () => <MobileMenu open onClose={() => {}} />,
  },
  {
    name: 'gofundme-widget',
    label: 'GoFundMeWidget',
    description: 'Embedded GoFundMe campaign iframe. Loads from gofundme.com.',
    background: 'light',
    render: () => <GoFundMeWidget size="large" />,
  },
  {
    name: 'support-section',
    label: 'SupportSection',
    description: 'Home-page "Help Us Build Something Special" block: heading + pitch + GoFundMe widget.',
    background: 'light',
    render: () => <SupportSection />,
  },
  {
    name: 'social-icons',
    label: 'SocialIcons',
    description: 'Row of social-media icon links used by Nav and MobileMenu. Icons come from public/assets/img/social/.',
    background: 'light',
    render: () => (
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        {socialLinks.map((link) => (
          <SocialIcon key={link.name} {...link} />
        ))}
      </div>
    ),
  },
  {
    name: 'newsletter-signup',
    label: 'NewsletterSignup',
    description: 'Email signup form. No network call when VITE_NEWSLETTER_ENDPOINT is unset (dev / preview default).',
    background: 'light',
    render: () => <NewsletterSignup source="sandbox" />,
  },
  {
    name: 'discord-signup-form',
    label: 'DiscordSignupForm',
    description: 'Per-game Discord community signup form. No network call without an endpoint prop.',
    background: 'light',
    render: () => (
      <DiscordSignupForm source="sandbox" gameTitle="Universal Serial Blade" />
    ),
  },
  {
    name: 'playtest-signup-form',
    label: 'PlaytestSignupForm',
    description: 'Per-game playtest signup form. No network call without an endpoint prop.',
    background: 'light',
    render: () => (
      <PlaytestSignupForm source="sandbox" gameTitle="Universal Serial Blade" />
    ),
  },
]

export const previewByName = Object.fromEntries(previews.map((p) => [p.name, p]))
