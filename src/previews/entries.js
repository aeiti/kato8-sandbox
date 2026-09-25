/**
 * Plain-JS list of preview entries. Metadata only — no React imports —
 * so Node scripts (e.g. scripts/prerender.mjs) can consume it without
 * a JSX transform. registry.jsx builds on this list to attach render
 * thunks, and seo-config.js uses it to derive per-preview OG meta.
 *
 * Entry shape: { name, label, status, category, source, styles, description }
 *   name        route slug + registry render key (`/components/<name>`).
 *   label       display name shown in the gallery and preview bar.
 *   status      lifecycle badge: 'stable' | 'wip' | 'vendored' | 'deprecated'.
 *   category    gallery grouping heading (e.g. 'Navigation', 'Forms').
 *               Entries with no category fall under an 'Other' group.
 *               PreviewPage.jsx orders known categories via CATEGORY_ORDER.
 *   source      where the rendered component lives, as an import-style path.
 *   styles      the component's primary stylesheet, same path convention.
 *               For both `source` and `styles`: `src/...` paths are
 *               vendored in this repo (editable from the admin panel);
 *               `kato8studios-site/...` paths live in the sibling
 *               external-site checkout (read-only here).
 *   description one-line summary for the gallery card + OG meta.
 *
 * This whole array is a plain-data literal: keep it that way (no imports,
 * no expressions) so the dev-only admin panel (scripts/dev-admin/,
 * reachable at http://localhost:5173/__admin during `npm run dev`) can
 * parse and re-emit it. Comments inside the array are dropped on save.
 */

export const previewEntries = [
  {
    name: 'nav',
    label: 'Nav',
    status: 'stable',
    category: 'Navigation',
    source: 'kato8studios-site/src/components/Nav.jsx',
    styles: 'kato8studios-site/src/styles/main/nav.css',
    description: 'Top navigation bar with games dropdown, About link, and social icons. Mobile viewports collapse to a hamburger + MobileMenu.',
  },
  {
    name: 'footer',
    label: 'Footer',
    status: 'stable',
    category: 'Navigation',
    source: 'kato8studios-site/src/components/Footer.jsx',
    styles: 'kato8studios-site/src/styles/main/footer.css',
    description: 'Site-wide footer: studio blurb, per-game links, community links, and the bottom legal bar.',
  },
  {
    name: 'hero',
    label: 'Hero',
    status: 'stable',
    category: 'Sections',
    source: 'kato8studios-site/src/components/Hero.jsx',
    styles: 'kato8studios-site/src/styles/main/pages/home.css',
    description: 'Home-page hero: studio logo + mission tagline. Uses responsive srcSet for the logo image.',
  },
  {
    name: 'game-grid',
    label: 'GameGrid',
    status: 'stable',
    category: 'Games',
    source: 'kato8studios-site/src/components/GameGrid.jsx',
    styles: 'kato8studios-site/src/styles/main/pages/games.css',
    description: 'Home-page grid of GameCards, driven by the games data. Renders one card per entry in games.js.',
  },
  {
    name: 'game-card',
    label: 'GameCard',
    status: 'stable',
    category: 'Games',
    source: 'kato8studios-site/src/components/GameCard.jsx',
    styles: 'kato8studios-site/src/styles/main/pages/games.css',
    description: 'A single game tile. Rendered here with the first entry from games.js.',
  },
  {
    name: 'mobile-menu',
    label: 'MobileMenu',
    status: 'stable',
    category: 'Navigation',
    source: 'kato8studios-site/src/components/MobileMenu.jsx',
    styles: 'kato8studios-site/src/styles/mobile-menu.css',
    description: 'Slide-in menu used on narrow viewports. Rendered here in the always-open state; the close button is a no-op in preview.',
  },
  {
    name: 'gofundme-widget',
    label: 'GoFundMeWidget',
    status: 'stable',
    category: 'Fundraising',
    source: 'kato8studios-site/src/components/GoFundMeWidget.jsx',
    styles: 'kato8studios-site/src/styles/main/support.css',
    description: 'Embedded GoFundMe campaign iframe. Loads from gofundme.com.',
  },
  {
    name: 'support-section',
    label: 'SupportSection',
    status: 'stable',
    category: 'Fundraising',
    source: 'kato8studios-site/src/components/SupportSection.jsx',
    styles: 'kato8studios-site/src/styles/main/support.css',
    description: 'Home-page "Help Us Build Something Special" block: heading + pitch + GoFundMe widget.',
  },
  {
    name: 'social-icons',
    label: 'SocialIcons',
    status: 'stable',
    category: 'Navigation',
    source: 'kato8studios-site/src/components/SocialIcons.jsx',
    styles: 'kato8studios-site/src/styles/main/social-icons.css',
    description: 'Row of social-media icon links used by Nav and MobileMenu. Icons come from public/assets/img/social/.',
  },
  {
    name: 'newsletter-signup',
    label: 'NewsletterSignup',
    status: 'stable',
    category: 'Forms',
    source: 'kato8studios-site/src/components/NewsletterSignup.jsx',
    styles: 'kato8studios-site/src/styles/main/newsletter-signup.css',
    description: 'Email signup form. No network call when VITE_NEWSLETTER_ENDPOINT is unset (dev / preview default).',
  },
  {
    name: 'discord-signup-form',
    label: 'DiscordSignupForm',
    status: 'stable',
    category: 'Forms',
    source: 'kato8studios-site/src/components/DiscordSignupForm.jsx',
    styles: 'kato8studios-site/src/styles/main/signup-form.css',
    description: 'Per-game Discord community signup form. No network call without an endpoint prop.',
  },
  {
    name: 'playtest-signup-form',
    label: 'PlaytestSignupForm',
    status: 'stable',
    category: 'Forms',
    source: 'kato8studios-site/src/components/PlaytestSignupForm.jsx',
    styles: 'kato8studios-site/src/styles/main/signup-form.css',
    description: 'Per-game playtest signup form. No network call without an endpoint prop.',
  },
  {
    name: 'kickstarter-button',
    label: 'KickstarterButton',
    status: 'stable',
    category: 'Fundraising',
    source: 'kato8studios-site/src/components/KickstarterButton.jsx',
    styles: 'kato8studios-site/src/styles/main/kickstarter-button.css',
    description: 'Green CTA linking to a Kickstarter campaign. Rendered on game pages whose data entry defines a kickstarterUrl. Dark-cobalt inset stroke + hard-offset shadow that lifts on hover; arrow slides right.',
  },
  {
    name: 'our-story-timeline',
    label: 'OurStoryTimeline',
    status: 'wip',
    category: 'Sections',
    source: 'src/components/OurStoryTimeline.jsx',
    styles: 'src/styles/our-story-timeline.css',
    description: 'About-page "Our Story" milestone timeline: alternating cards zigzag around a centered line, collapsing to a left rail under 767px. WIP from external-site branch about-timeline-section — not yet on main, vendored here.',
  },
  {
    name: 'investor-request-form',
    label: 'InvestorRequestForm',
    status: 'vendored',
    category: 'Forms',
    source: 'src/components/InvestorRequestForm.jsx',
    styles: 'src/styles/investor-request-form.css',
    description: 'Investor-relations request form (name, email, company, investment range, message). Reuses the shared signup-form styling; no network call when VITE_INVESTOR_ENDPOINT is unset. New in the sandbox, not yet on main.',
  },
  {
    name: 'sandbox-nav',
    label: 'SandboxNav',
    status: 'vendored',
    category: 'Navigation',
    source: 'src/components/SandboxNav.jsx',
    styles: 'kato8studios-site/src/styles/main/nav.css',
    description: 'Copy of the main-site Nav with an added "Investors" tab (links to /investors). Used as the sandbox\'s global nav to preview the proposed tab. Not yet on main.',
  },
  {
    name: 'sandbox-mobile-menu',
    label: 'SandboxMobileMenu',
    status: 'vendored',
    category: 'Navigation',
    source: 'src/components/SandboxMobileMenu.jsx',
    styles: 'kato8studios-site/src/styles/mobile-menu.css',
    description: 'Copy of the main-site MobileMenu with an added "Investors" link in the Studio section. Rendered here in the always-open state; the close button is a no-op in preview. Not yet on main.',
  },
  {
    name: 'bio-cards',
    label: 'BioCard',
    status: 'wip',
    category: 'Studio',
    source: 'src/components/BioCard.jsx',
    styles: 'src/styles/studio-bios.css',
    description: 'Studio-bio collector cards. A shared BioCard base (card shell, --sb-accent theming, cardImage escape hatch) that every variation builds on. Shown here as all SIX variations for one member, side by side: the three CSS-drawn frames (Pokémon / Magic / Yu-Gi-Oh!) and the three image-template cards. Drives the /studio-bios page.',
  },
  {
    name: 'pokemon-template-card',
    label: 'PokemonTemplateCard',
    status: 'wip',
    category: 'Studio',
    source: 'src/components/PokemonTemplateCard.jsx',
    styles: 'src/styles/studio-bios.css',
    description: 'Bio data overlaid on a real Pokémon card TEMPLATE IMAGE (vs. the CSS-drawn frame). Built on the shared TemplateBioCard base. Currently shows a placeholder template SVG — drop the real art in at public/assets/sandbox/templates/pokemon-card.svg and re-tune the .sb-tpl slot positions.',
  },
  {
    name: 'magic-template-card',
    label: 'MagicTemplateCard',
    status: 'wip',
    category: 'Studio',
    source: 'src/components/MagicTemplateCard.jsx',
    styles: 'src/styles/studio-bios.css',
    description: 'Bio data overlaid on a real Magic card TEMPLATE IMAGE (vs. the CSS-drawn frame). Built on the shared TemplateBioCard base. Currently shows a placeholder template SVG — drop the real art in at public/assets/sandbox/templates/magic-card.svg and re-tune the .sb-tpl slot positions.',
  },
  {
    name: 'yugioh-template-card',
    label: 'YugiohTemplateCard',
    status: 'wip',
    category: 'Studio',
    source: 'src/components/YugiohTemplateCard.jsx',
    styles: 'src/styles/studio-bios.css',
    description: 'Bio data overlaid on a real Yu-Gi-Oh! card TEMPLATE IMAGE (vs. the CSS-drawn frame). Built on the shared TemplateBioCard base. Currently shows a placeholder template SVG — drop the real art in at public/assets/sandbox/templates/yugioh-card.svg and re-tune the .sb-tpl slot positions.',
  },
]

export const entryByName = Object.fromEntries(previewEntries.map((e) => [e.name, e]))
