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
    title: 'Kickstarter Button — Round 2 | Kato.8 Sandbox',
    description:
      'Nine hover variants across three axes (shadow, motion, color) for the Kickstarter CTA. For team review.',
    ogTitle: 'Kickstarter Button — Round 2',
    ogDescription:
      'Nine hover variants for the Kickstarter CTA, side-by-side for team review.',
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

export const NOT_FOUND_META = {
  title: 'Not found | Kato.8 Sandbox',
  description: "The page you're looking for doesn't exist.",
  noindex: true,
}

export function getRouteMeta(pathname) {
  if (staticRoutes[pathname]) return staticRoutes[pathname]
  const m = pathname.match(/^\/components\/([^/]+)\/?$/)
  if (m && componentRoutes[m[1]]) return componentRoutes[m[1]]
  return null
}

// All routes the prerender script emits static HTML for.
export function listPrerenderRoutes() {
  return [
    ...Object.keys(staticRoutes),
    ...Object.keys(componentRoutes).map((name) => `/components/${name}`),
  ]
}
