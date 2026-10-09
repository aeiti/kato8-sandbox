// Captures a 1200×630 link-preview screenshot of every prerendered route
// into public/assets/og/ and rewrites src/data/og-images.js to point at
// them. seo-config's ogImageFor() reads that map, so both <Seo> and
// scripts/prerender.mjs emit the screenshot as the route's og:image.
//
//   npm run og:capture                      # every route
//   npm run og:capture -- /investors /      # just these routes
//
// Pages load with `?bare=1` (App.jsx drops the back bar, Nav, and Footer;
// PreviewPage drops its preview bar), so the shared chrome doesn't fill
// the top third of every image and make every preview look alike.
//
// Component previews (`/components/<name>`) are usually much smaller than
// the frame, so they're cropped to their content (shot at 2× for
// sharpness) and centered on a 1200×630 card instead of leaving most of
// the image blank. Pages are shot as the top 1200×630 of the viewport.
//
// Starts its own Vite dev server on a free port (no build needed) and
// drives the locally installed Google Chrome through playwright-core, so
// there's no browser download. Commit the changed images + og-images.js;
// the deploy doesn't capture anything itself, so a page whose look
// changes keeps its old preview until this is rerun.
//
// A full run also removes screenshots for routes that no longer exist.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright-core'

import { SITE, listPrerenderRoutes } from '../src/data/seo-config.js'
import { ogImages } from '../src/data/og-images.js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public/assets/og')
const manifestPath = path.join(root, 'src/data/og-images.js')

const COMPONENT_ROUTE = /^\/components\/[^/]+$/
// Mobile-only components collapse at desktop width, so render them at a
// phone-sized viewport before cropping.
const MOBILE_ROUTES = new Set(['/components/mobile-menu', '/components/sandbox-mobile-menu'])
const MOBILE_VIEWPORT = { width: 390, height: 844 }
const CARD_PADDING = 48
// Shots are taken at 2× device pixels, so scaling past ~2.5× of CSS size
// starts to blur.
const MAX_UPSCALE = 2.5

// Bounding box of what's actually visible inside the bare preview stage:
// text, replaced elements (img / svg / inputs), and boxes that paint a
// background, border, or shadow. Transparent layout wrappers (often full
// width) are skipped so a small component crops tight.
function contentBox() {
  const stage = document.querySelector('.preview-frame_stage')
  if (!stage) return null
  let top = Infinity, left = Infinity, bottom = -Infinity, right = -Infinity
  const add = (r) => {
    if (!r.width || !r.height) return
    // Off-screen by design (e.g. a form's honeypot field at left: -10000px).
    if (r.right <= 0 || r.left >= window.innerWidth) return
    top = Math.min(top, r.top)
    left = Math.min(left, r.left)
    bottom = Math.max(bottom, r.bottom)
    right = Math.max(right, r.right)
  }
  const REPLACED = /^(IMG|SVG|VIDEO|CANVAS|INPUT|TEXTAREA|SELECT|BUTTON|IFRAME)$/i
  const walker = document.createTreeWalker(stage, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) continue
      const cs = getComputedStyle(node.parentElement)
      if (cs.visibility === 'hidden' || cs.opacity === '0') continue
      const range = document.createRange()
      range.selectNodeContents(node)
      add(range.getBoundingClientRect())
      continue
    }
    const cs = getComputedStyle(node)
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue
    const paints =
      REPLACED.test(node.tagName) ||
      cs.backgroundImage !== 'none' ||
      !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) ||
      parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth) > 0 ||
      cs.boxShadow !== 'none'
    if (paints) add(node.getBoundingClientRect())
  }
  if (top === Infinity) return null
  const bg = getComputedStyle(stage.closest('.preview-frame')).backgroundColor
  return { x: left + window.scrollX, y: top + window.scrollY, width: right - left, height: bottom - top, bg }
}

// Crop a component preview to its content and center it on a card.
async function captureComponent(browser, url, outPath, viewport) {
  const shotPage = await browser.newPage({ viewport, deviceScaleFactor: 2 })
  try {
    await settle(shotPage, url)
    const box = await shotPage.evaluate(contentBox)
    if (!box) return false
    const pad = 16
    const clip = {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: box.width + pad * 2,
      height: box.height + pad * 2,
    }
    const png = await shotPage.screenshot({ clip, fullPage: true, type: 'png' })
    const scale = Math.min(
      (SITE.ogImageWidth - CARD_PADDING * 2) / clip.width,
      (SITE.ogImageHeight - CARD_PADDING * 2) / clip.height,
      MAX_UPSCALE,
    )
    const imgWidth = Math.round(clip.width * scale)
    if (process.env.OG_DEBUG) console.log(`  box ${Math.round(clip.width)}×${Math.round(clip.height)} scale ${scale.toFixed(2)}`)
    const card = await browser.newPage({
      viewport: { width: SITE.ogImageWidth, height: SITE.ogImageHeight },
      deviceScaleFactor: 1,
    })
    try {
      await card.setContent(`<!doctype html><html><body style="margin:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:${box.bg}"><img src="data:image/png;base64,${png.toString('base64')}" style="width:${imgWidth}px;height:auto"></body></html>`)
      await card.waitForFunction(() => document.querySelector('img').complete)
      await card.screenshot({ path: outPath, type: 'jpeg', quality: 80 })
    } finally {
      await card.close()
    }
    return true
  } finally {
    await shotPage.close()
  }
}

async function settle(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  // Let entrance transitions and lazy images settle.
  await page.waitForTimeout(400)
}

// '/' -> home.jpg, '/components/nav' -> components--nav.jpg
function fileFor(route) {
  return route === '/' ? 'home.jpg' : `${route.replace(/^\/|\/$/g, '').replace(/\//g, '--')}.jpg`
}

function writeManifest(map) {
  const lines = Object.keys(map)
    .sort()
    .map((route) => `  ${JSON.stringify(route)}: ${JSON.stringify(map[route])},`)
  const body = lines.length ? `{\n${lines.join('\n')}\n}` : '{}'
  fs.writeFileSync(
    manifestPath,
    `// Generated by scripts/capture-og.mjs (\`npm run og:capture\`) — do not edit
// by hand. Maps each route to its 1200×630 link-preview screenshot under
// public/assets/og/. Read by ogImageFor() in seo-config.js.
export const ogImages = ${body}
`,
  )
}

async function main() {
  const allRoutes = listPrerenderRoutes()
  const requested = process.argv.slice(2)
  const unknown = requested.filter((r) => !allRoutes.includes(r))
  if (unknown.length) {
    throw new Error(`Not a prerendered route: ${unknown.join(', ')}`)
  }
  const routes = requested.length ? requested : allRoutes
  const fullRun = !requested.length

  fs.mkdirSync(outDir, { recursive: true })

  const server = await createServer({
    root,
    logLevel: 'error',
    server: { port: 0, strictPort: false },
  })
  await server.listen()
  const base = server.resolvedUrls.local[0].replace(/\/$/, '')

  let browser
  const map = fullRun ? {} : { ...ogImages }
  try {
    browser = await chromium.launch({ channel: 'chrome' })
    const page = await browser.newPage({
      viewport: { width: SITE.ogImageWidth, height: SITE.ogImageHeight },
      deviceScaleFactor: 1,
    })
    for (const route of routes) {
      const url = `${base}${route}?bare=1`
      const file = fileFor(route)
      const outPath = path.join(outDir, file)
      const viewport = MOBILE_ROUTES.has(route)
        ? MOBILE_VIEWPORT
        : { width: SITE.ogImageWidth, height: SITE.ogImageHeight }
      const carded =
        COMPONENT_ROUTE.test(route) && (await captureComponent(browser, url, outPath, viewport))
      if (!carded) {
        await settle(page, url)
        await page.screenshot({ path: outPath, type: 'jpeg', quality: 80 })
      }
      map[route] = `/assets/og/${file}`
      console.log(`captured ${route.padEnd(36)} → public/assets/og/${file}`)
    }
  } finally {
    await browser?.close()
    await server.close()
  }

  if (fullRun) {
    const keep = new Set(Object.values(map).map((p) => path.basename(p)))
    for (const file of fs.readdirSync(outDir)) {
      if (file.endsWith('.jpg') && !keep.has(file)) {
        fs.rmSync(path.join(outDir, file))
        console.log(`removed  public/assets/og/${file} (route no longer exists)`)
      }
    }
  }

  writeManifest(map)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
