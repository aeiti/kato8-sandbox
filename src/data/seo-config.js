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
 * by concatenating `${SITE.url}${pathname}`.
 */

import { previewEntries } from '../previews/entries.js'

export const SITE = {
  url: 'https://aeiti.github.io/kato8-sandbox',
  name: 'Kato.8 Sandbox',
  defaultImage: '/assets/img/kato-webclip.png',
  twitterCard: 'summary_large_image',
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
  '/crowdfunding-games': {
    title: 'Crowdfunding Games | Kato.8 Sandbox',
    description:
      'Full-page preview of the crowdfunding games landing page — heading + a grid of demo game cards, each linking to its detail page.',
    ogTitle: 'Crowdfunding Games — page preview',
    ogDescription:
      'Preview of the crowdfunding games landing page and its per-game detail pages.',
  },
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
// (`/crowdfunding-games/:slug`). Slugs mirror the vendored
// `src/data/crowdfundingGames.js`; kept in sync by hand so this file stays
// import-light and Node-loadable by the prerender script.
const CROWDFUNDING_SLUGS = [
  'game-one',
  'game-two',
  'game-three',
  'game-four',
  'game-five',
  'game-six',
]

export const crowdfundingGameRoutes = Object.fromEntries(
  CROWDFUNDING_SLUGS.map((slug) => [
    slug,
    {
      title: 'Crowdfunding Game | Kato.8 Sandbox',
      description:
        'Preview of a crowdfunding demo game detail page — cover, title, tags, and description. Placeholder content.',
      ogTitle: 'Crowdfunding Game — page preview',
      ogDescription:
        'Preview of a crowdfunding demo game detail page. Placeholder content.',
    },
  ]),
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
