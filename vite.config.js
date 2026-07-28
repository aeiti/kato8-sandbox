import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Deploy target controls the public base path.
//   dev   -> served at http://localhost:5173/            (base '/')
//   pages -> served at https://aeiti.github.io/kato8-sandbox/
//
// Default is 'dev' so plain `npm run dev` works locally.
// The deploy workflow sets VITE_DEPLOY_TARGET=pages before `npm run build`.
const target = process.env.VITE_DEPLOY_TARGET || 'dev'
const base = target === 'pages' ? '/kato8-sandbox/' : '/'

// Resolve external-site's public/assets/img from the sibling checkout
// (../external-site relative to the sandbox root). In local dev the
// sandbox and external-site live side by side in ~/GitHub/; in CI the
// deploy workflow checks both repos out side by side under $GITHUB_WORKSPACE.
const externalSiteImg = path.resolve(__dirname, '../external-site/public/assets/img')

// Serves and copies external-site's /assets/img/* so previews of Nav,
// Hero, GameCard, etc. can find the images they reference without the
// sandbox duplicating the whole asset tree.
function externalSiteAssets() {
  return {
    name: 'kato8-external-site-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (!url || !url.startsWith('/assets/img/')) return next()
        const rel = url.slice('/assets/img/'.length)
        const file = path.join(externalSiteImg, rel)
        if (!file.startsWith(externalSiteImg)) return next()
        fs.stat(file, (err, stat) => {
          if (err || !stat.isFile()) return next()
          res.setHeader('Content-Type', mimeFor(file))
          res.setHeader('Cache-Control', 'no-cache')
          fs.createReadStream(file).pipe(res)
        })
      })
    },
    closeBundle() {
      if (!fs.existsSync(externalSiteImg)) return
      const outDir = path.resolve(__dirname, 'docs/assets/img')
      copyRecursive(externalSiteImg, outDir)
    },
  }
}

const MIME = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
}

function mimeFor(file) {
  return MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (entry.isDirectory()) copyRecursive(s, d)
    else if (entry.isFile() && !fs.existsSync(d)) fs.copyFileSync(s, d)
  }
}

export default defineConfig({
  plugins: [react(), externalSiteAssets()],
  base,
  build: {
    outDir: 'docs',
  },
  resolve: {
    // Force imports coming from the linked external-site checkout to
    // resolve against the sandbox's own copies of these packages. Without
    // this, Vite/Rollup would walk up from external-site/src/... looking
    // for node_modules; local dev works because external-site has its
    // own populated node_modules, but CI only installs in the sandbox.
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
})
