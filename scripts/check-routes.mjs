// Fails (exit 1) when the sandbox's route lists disagree. A route lives in
// four places, and each one silently degrades when it drifts:
//
//   src/App.jsx               <Route path="…">            — the page renders
//   src/data/seo-config.js    staticRoutes                 — meta + prerendered HTML
//   src/data/homeSections.js  sections/pages/experiments   — listed on the home page
//   src/data/og-images.js     ogImages                     — link-preview screenshot
//
// Rules:
//   - every static App.jsx route has a staticRoutes entry, and vice versa;
//   - every App.jsx route except `/` is listed in homeSections, and every
//     homeSections path is an App.jsx route;
//   - every og-images key is a prerendered route (stale screenshots fail).
//     A prerendered route with no screenshot only warns: it falls back to the
//     default image until `npm run og:capture -- <route>` runs.
//
// Run in CI by .github/workflows/check.yml:  node scripts/check-routes.mjs

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { staticRoutes, listPrerenderRoutes } from '../src/data/seo-config.js'
import { sections, pages, experiments } from '../src/data/homeSections.js'
import { ogImages } from '../src/data/og-images.js'

const appSrc = await readFile(fileURLToPath(new URL('../src/App.jsx', import.meta.url)), 'utf8')
const appRoutes = [...appSrc.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1])
const staticAppRoutes = appRoutes.filter((p) => !p.includes(':'))

const errors = []
const warnings = []
const missing = (from, to, label) => {
  const set = new Set(to)
  for (const p of from) if (!set.has(p)) errors.push(`${p}: ${label}`)
}

if (!staticAppRoutes.length) errors.push('found no <Route path="…"> in src/App.jsx')

const seoRoutes = Object.keys(staticRoutes)
missing(staticAppRoutes, seoRoutes, 'route in App.jsx but not in seo-config.js staticRoutes')
missing(seoRoutes, staticAppRoutes, 'in seo-config.js staticRoutes but not a route in App.jsx')

const homePaths = [...sections, ...pages, ...experiments].map((e) => e.path)
missing(
  staticAppRoutes.filter((p) => p !== '/'),
  homePaths,
  'route in App.jsx but not listed in homeSections.js',
)
missing(homePaths, staticAppRoutes, 'listed in homeSections.js but not a route in App.jsx')
const seen = new Set()
for (const p of homePaths) {
  if (seen.has(p)) errors.push(`${p}: listed more than once in homeSections.js`)
  seen.add(p)
}

const prerender = listPrerenderRoutes()
missing(Object.keys(ogImages), prerender, 'in og-images.js but not a prerendered route (stale screenshot)')
for (const p of prerender) {
  if (!ogImages[p]) warnings.push(`${p}: no og:image yet (run \`npm run og:capture -- ${p}\`)`)
}

for (const w of warnings) console.warn(`warning  ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`error    ${e}`)
  console.error(`\ncheck-routes: ${errors.length} route mismatch(es)`)
  process.exit(1)
}
console.log(`check-routes: ${staticAppRoutes.length} App routes, ${prerender.length} prerendered routes agree`)
