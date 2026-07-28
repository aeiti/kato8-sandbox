/**
 * Plain-JS list of preview entries. Metadata only — no React imports —
 * so Node scripts (e.g. scripts/prerender.mjs) can consume it without
 * a JSX transform. registry.jsx builds on this list to attach render
 * thunks, and seo-config.js uses it to derive per-preview OG meta.
 */

export const previewEntries = [
  { name: 'nav',                  label: 'Nav',                  description: 'Top navigation bar with games dropdown, About link, and social icons. Mobile viewports collapse to a hamburger + MobileMenu.' },
  { name: 'footer',               label: 'Footer',               description: 'Site-wide footer: studio blurb, per-game links, community links, and the bottom legal bar.' },
  { name: 'hero',                 label: 'Hero',                 description: 'Home-page hero: studio logo + mission tagline. Uses responsive srcSet for the logo image.' },
  { name: 'game-grid',            label: 'GameGrid',             description: 'Home-page grid of GameCards, driven by the games data. Renders one card per entry in games.js.' },
  { name: 'game-card',            label: 'GameCard',             description: 'A single game tile. Rendered here with the first entry from games.js.' },
  { name: 'mobile-menu',          label: 'MobileMenu',           description: 'Slide-in menu used on narrow viewports. Rendered here in the always-open state; the close button is a no-op in preview.' },
  { name: 'gofundme-widget',      label: 'GoFundMeWidget',       description: 'Embedded GoFundMe campaign iframe. Loads from gofundme.com.' },
  { name: 'support-section',      label: 'SupportSection',       description: 'Home-page "Help Us Build Something Special" block: heading + pitch + GoFundMe widget.' },
  { name: 'social-icons',         label: 'SocialIcons',          description: 'Row of social-media icon links used by Nav and MobileMenu. Icons come from public/assets/img/social/.' },
  { name: 'newsletter-signup',    label: 'NewsletterSignup',     description: 'Email signup form. No network call when VITE_NEWSLETTER_ENDPOINT is unset (dev / preview default).' },
  { name: 'discord-signup-form',  label: 'DiscordSignupForm',    description: 'Per-game Discord community signup form. No network call without an endpoint prop.' },
  { name: 'playtest-signup-form', label: 'PlaytestSignupForm',   description: 'Per-game playtest signup form. No network call without an endpoint prop.' },
]

export const entryByName = Object.fromEntries(previewEntries.map((e) => [e.name, e]))
