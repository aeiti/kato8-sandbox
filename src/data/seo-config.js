/**
 * Single source of truth for per-route SEO metadata in the sandbox.
 * Consumed by:
 *   - the `<Seo>` component at runtime (each page passes its own entry).
 *   - `scripts/prerender.mjs` at build time, which iterates
 *     `listPrerenderRoutes()` and bakes the right meta tags into each
 *     route's static HTML file so crawlers (Discord, Slack, X) see them
 *     on first byte.
 *
 * Mirrors the shape of external-site/src/data/seo-config.js so the
 * mental model transfers between the two repos.
 *
 * SITE.url should include the Pages subpath — canonical URLs are built
 * by `canonicalUrl()`, which appends the pathname with a trailing slash
 * (GitHub Pages 301-redirects `/route` to `/route/`).
 *
 * Preview images: `scripts/capture-og.mjs` (`npm run og:capture`)
 * screenshots every prerendered route at 1200×630 into
 * `public/assets/og/` and records them in `og-images.js`. `ogImageFor()`
 * picks a route's screenshot up from there; a route with no screenshot
 * yet falls back to `SITE.defaultImage` with a small `summary` card.
 */

import { previewEntries } from '../previews/entries.js'
import { crowdfundingGames } from './crowdfundingGames.js'
import { ogImages } from './og-images.js'

export const SITE = {
  url: 'https://aeiti.github.io/kato8-sandbox',
  name: 'Kato.8 Sandbox',
  defaultImage: '/assets/img/kato-webclip.png',
  twitterCard: 'summary_large_image',
  // Size of the captured screenshots (scripts/capture-og.mjs).
  ogImageWidth: 1200,
  ogImageHeight: 630,
}

export function canonicalUrl(pathname) {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`
  return `${SITE.url}${p}`
}

// The route's captured screenshot, or null when it hasn't been captured.
export function ogImageFor(pathname) {
  const key = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname
  return ogImages[key] || null
}

const HOME_TITLE = 'Kato.8 Sandbox'
const HOME_DESC =
  'Design experiments, component previews, and prototypes for the Kato.8 Studios main site.'

export const staticRoutes = {
  '/': {
    title: HOME_TITLE,
    description: HOME_DESC,
    ogTitle: HOME_TITLE,
    ogDescription: HOME_DESC,
  },
  '/components': {
    title: 'Components | Kato.8 Sandbox',
    description:
      'Every component from the Kato.8 main site rendered in isolation for team review — nav, footer, hero, game cards, forms, and more.',
    ogTitle: 'Components — Kato.8 Sandbox',
    ogDescription:
      'Team-review gallery: every main-site component in isolation, live from the source.',
  },
  '/kickstarter-buttons': {
    title: 'Kickstarter Button | Kato.8 Sandbox',
    description:
      'Nine hover variants across three axes (shadow, motion, color) for the Kickstarter CTA. For team review.',
    ogTitle: 'Kickstarter Button',
    ogDescription:
      'Nine hover variants for the Kickstarter CTA, side-by-side for team review.',
  },
  '/kickstarter-button-v2': {
    title: 'Kickstarter Button v2 | Kato.8 Sandbox',
    description:
      'Flatter, "official-partner" take on the Kickstarter CTA — a response to v1 reading as designed-by-AI. Side-by-side with v1 for review.',
    ogTitle: 'Kickstarter Button v2',
    ogDescription:
      'Flatter, official-partner take on the Kickstarter CTA. Compare against v1.',
  },
  '/our-story-timeline': {
    title: 'Our Story timeline | Kato.8 Sandbox',
    description:
      'Milestone timeline proposed for the About page — alternating cards around a centered line, collapsing to a left rail on mobile. WIP preview.',
    ogTitle: 'Our Story timeline',
    ogDescription:
      'About-page milestone timeline preview — alternating cards, mobile left-rail collapse.',
  },
  '/newsletter-on-about': {
    title: 'Newsletter on About | Kato.8 Sandbox',
    description:
      'NewsletterSignup mounted below the Support Kato.8 section on the About page, with tightened top spacing. WIP preview.',
    ogTitle: 'Newsletter on About',
    ogDescription:
      'Preview of NewsletterSignup mounted on the About page with tightened spacing.',
  },
  '/investors': {
    title: 'Investors | Kato.8 Sandbox',
    description:
      'Prototype investor / publisher page for Kato.8 — a partnership hero plus a contact form for investors and publishers. Adds an "Investors" nav tab. WIP preview.',
    ogTitle: 'Investors — page prototype',
    ogDescription:
      'Prototype investor / publisher page: partnership hero + contact form, with a new Investors nav tab.',
  },
  '/crowdfunding-games': {
    title: 'Crowdfunding Games | Kato.8 Sandbox',
    description:
      'Full-page preview of the crowdfunding games landing page — heading + a grid of demo game cards, each linking to its detail page.',
    ogTitle: 'Crowdfunding Games — page preview',
    ogDescription:
      'Preview of the crowdfunding games landing page and its per-game detail pages.',
  },
  '/studio-bios': {
    title: 'Studio Bios | Kato.8 Sandbox',
    description:
      'Meet-the-team page prototype: each studio member’s bio rendered as a collector’s card, with a switcher for Pokémon, Magic, and Yu-Gi-Oh! frames. Placeholder people.',
    ogTitle: 'Studio Bios — collector cards',
    ogDescription:
      'The studio team as collector cards — Pokémon, Magic, and Yu-Gi-Oh! frames over one shared bio data source. Placeholder content.',
  },
  '/home-usb-background': {
    title: 'Home — USB Background | Kato.8 Sandbox',
    description:
      'Archived home-page look: hero over a fixed USB cover-art parallax backdrop with cleaned-up game cards.',
    ogTitle: 'Home — USB Background — page preview',
    ogDescription:
      'Archived home page snapshot with the parallax USB cover-art background and cleaned-up game cards.',
  },
  '/investors-color': {
    title: 'Investors (color) | Kato.8 Sandbox',
    description:
      'Color variant of the investor / publisher page for comparison with /investors — a dark-cobalt hero band with the nav’s pink→peach wave, plus a strip of the studio’s three games above the contact form. WIP preview.',
    ogTitle: 'Investors — color variant',
    ogDescription:
      'Investor page variant: cobalt hero band with the pink→peach wave, plus a games strip. Compare with /investors.',
  },
  // ADMIN:SEO-ROUTES — pages created from the dev admin panel insert their
  // entry above this line. Keep it as the last line of staticRoutes.
}

// Per-component preview routes, derived from the registry so adding a
// new preview automatically gets prerendered without a second edit here.
export const componentRoutes = Object.fromEntries(
  previewEntries.map((entry) => [
    entry.name,
    {
      title: `${entry.label} | Kato.8 Sandbox`,
      description: entry.description,
      ogTitle: `${entry.label} — Component preview`,
      ogDescription: entry.description,
    },
  ]),
)

// Per-game meta for the crowdfunding demo detail pages
// (`/crowdfunding-games/:slug`). The dev admin panel (/__admin →
// Crowdfunding) rewrites this slug list whenever it saves the games, so
// added/renamed/deleted games keep their prerendered OG pages. Title and
// description come from the game's own entry in crowdfundingGames.js
// (import-free, so still Node-loadable by the prerender script), falling
// back to generic copy for a slug with no matching game.
const CROWDFUNDING_SLUGS = [
  'dead-hour',
  'hollowbrook-apothecary',
  'hotdog-hustler',
  'boardwalk',
  'blind-slight',
  'game-six',
]

export const crowdfundingGameRoutes = Object.fromEntries(
  CROWDFUNDING_SLUGS.map((slug) => {
    const game = crowdfundingGames.find((g) => g.slug === slug)
    const name = game?.title || 'Crowdfunding Game'
    const description =
      game?.description ||
      'Preview of a crowdfunding demo game detail page — cover, title, tags, and description. Placeholder content.'
    return [
      slug,
      {
        title: `${name} | Kato.8 Sandbox`,
        description,
        ogTitle: `${name} — crowdfunding game preview`,
        ogDescription: description,
      },
    ]
  }),
)

export const NOT_FOUND_META = {
  title: 'Not found | Kato.8 Sandbox',
  description: "The page you're looking for doesn't exist.",
  noindex: true,
}

export function getRouteMeta(pathname) {
  if (staticRoutes[pathname]) return staticRoutes[pathname]
  const m = pathname.match(/^\/components\/([^/]+)\/?$/)
  if (m && componentRoutes[m[1]]) return componentRoutes[m[1]]
  const cf = pathname.match(/^\/crowdfunding-games\/([^/]+)\/?$/)
  if (cf && crowdfundingGameRoutes[cf[1]]) return crowdfundingGameRoutes[cf[1]]
  return null
}

// All routes the prerender script emits static HTML for.
export function listPrerenderRoutes() {
  return [
    ...Object.keys(staticRoutes),
    ...Object.keys(componentRoutes).map((name) => `/components/${name}`),
    ...Object.keys(crowdfundingGameRoutes).map((slug) => `/crowdfunding-games/${slug}`),
  ]
}
