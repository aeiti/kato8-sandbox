/**
 * Dev-only home manager — a Vite middleware plugin that lets you edit
 * the home-page listings (Browse / Pages / Experiments) from a browser
 * UI and publish them to the live site.
 *
 * Reachable at http://localhost:5173/__admin during `npm run dev`.
 *
 * How it stays out of production (three structural guards, no env checks):
 *   1. `apply: 'serve'` — Vite only loads this plugin for `vite` / dev,
 *      never for `vite build`.
 *   2. It lives in `scripts/`, outside `src/`, so it can't be imported
 *      into the app bundle.
 *   3. `/__admin` is a dev-server HTTP route, not a React route — the
 *      built SPA has no knowledge of it.
 *
 * Endpoints (all under /__admin):
 *   GET  /__admin                     → the manager UI (index.html)
 *   GET  /__admin/api/data            → { sections, pages, experiments }
 *   PUT  /__admin/api/block/<name>    → rewrite one array in homeSections.js
 *   POST /__admin/api/publish         → commit homeSections.js + push
 *
 * Publish commits ONLY homeSections.js and pushes the current branch to
 * origin. Run on `main` (the normal case) that triggers the Pages
 * deploy; on any other branch it reports back that you need to merge to
 * main. It never force-pushes and never touches other files.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UI_HTML = path.join(__dirname, 'index.html')

// The editable blocks: which file, and the anchor that precedes each
// data literal. All three live in one file today, but the shape allows
// spreading across files later (like external-site's dev-admin).
const TARGET_FILE = 'src/data/homeSections.js'
const BLOCKS = {
  sections: { file: TARGET_FILE, anchor: 'export const sections = ' },
  pages: { file: TARGET_FILE, anchor: 'export const pages = ' },
  experiments: { file: TARGET_FILE, anchor: 'export const experiments = ' },
}

const COMMIT_MESSAGE = 'Update home page listings via manager'

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 1_000_000) reject(new Error('body too large'))
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : null)
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

export function devAdmin() {
  return {
    name: 'kato8-dev-admin',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root
      // serialize.mjs is loaded lazily so a syntax error there surfaces
      // as a request-time 500 rather than crashing the whole dev server.
      const load = () => import('./serialize.mjs')

      server.middlewares.use('/__admin', async (req, res, next) => {
        const url = (req.url || '/').split('?')[0]

        try {
          // GET /__admin — serve the UI
          if (req.method === 'GET' && (url === '/' || url === '')) {
            res.setHeader('Content-Type', 'text/html')
            res.end(fs.readFileSync(UI_HTML, 'utf8'))
            return
          }

          // GET /__admin/api/info — current git branch (for the UI header)
          if (req.method === 'GET' && url === '/api/info') {
            let branch = null
            try {
              branch = git(root, ['rev-parse', '--abbrev-ref', 'HEAD'])
            } catch {
              /* not a git repo — leave null */
            }
            sendJson(res, 200, { branch, isMain: branch === 'main' })
            return
          }

          // GET /__admin/api/data — read all blocks
          if (req.method === 'GET' && url === '/api/data') {
            const { readBlock } = await load()
            const data = {}
            for (const [name, def] of Object.entries(BLOCKS)) {
              const src = fs.readFileSync(path.join(root, def.file), 'utf8')
              data[name] = readBlock(src, def.anchor)
            }
            sendJson(res, 200, data)
            return
          }

          // PUT /__admin/api/block/<name> — rewrite one block
          const blockMatch = url.match(/^\/api\/block\/([a-zA-Z]+)$/)
          if (req.method === 'PUT' && blockMatch) {
            const name = blockMatch[1]
            const def = BLOCKS[name]
            if (!def) return sendJson(res, 404, { error: `unknown block: ${name}` })

            const value = await readJsonBody(req)
            if (!Array.isArray(value)) {
              return sendJson(res, 400, { error: 'expected a JSON array' })
            }

            const { writeBlock } = await load()
            const filePath = path.join(root, def.file)
            const src = fs.readFileSync(filePath, 'utf8')
            const next = writeBlock(src, def.anchor, value)
            fs.writeFileSync(filePath, next)
            sendJson(res, 200, { ok: true, block: name, count: value.length })
            return
          }

          // POST /__admin/api/publish — commit + push homeSections.js
          if (req.method === 'POST' && url === '/api/publish') {
            let branch
            try {
              branch = git(root, ['rev-parse', '--abbrev-ref', 'HEAD'])
            } catch {
              return sendJson(res, 500, { error: 'not a git repository' })
            }

            git(root, ['add', '--', TARGET_FILE])
            const staged = git(root, ['diff', '--cached', '--name-only', '--', TARGET_FILE])
            if (!staged) {
              return sendJson(res, 200, {
                published: false,
                reason: 'No changes to publish — save an edit first.',
                branch,
              })
            }

            git(root, ['commit', '-m', COMMIT_MESSAGE, '--', TARGET_FILE])
            const sha = git(root, ['rev-parse', '--short', 'HEAD'])

            try {
              git(root, ['push', 'origin', 'HEAD'])
            } catch (err) {
              return sendJson(res, 500, {
                error: 'commit succeeded but push failed: ' + (err.stderr || err.message),
                branch,
                sha,
              })
            }

            const isMain = branch === 'main'
            sendJson(res, 200, {
              published: true,
              branch,
              sha,
              isMain,
              deploy: isMain,
              message: isMain
                ? `Pushed ${sha} to main — the Pages deploy is starting.`
                : `Pushed ${sha} to ${branch}. Merge it to main to deploy.`,
            })
            return
          }

          next()
        } catch (err) {
          sendJson(res, 500, { error: String(err && err.message ? err.message : err) })
        }
      })
    },
  }
}
