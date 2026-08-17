/**
 * Dev-only admin panel — a Vite middleware plugin that lets you edit the
 * home-page listings (Browse / Pages / Experiments) AND the component
 * preview library (name, slug, status, description, and — for components
 * vendored in this repo — their actual source), then push to the live
 * site from a browser UI.
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
 *   GET  /__admin/api/info            → { branch, isMain }
 *   GET  /__admin/api/data            → { sections, pages, experiments, components }
 *   PUT  /__admin/api/block/<name>    → rewrite one home-listing array
 *   POST /__admin/api/components      → rewrite previewEntries (+ slug renames)
 *   GET  /__admin/api/source?name=<n> → read one component's source file
 *   PUT  /__admin/api/source          → write one vendored component's source
 *   POST /__admin/api/publish         → commit + push the managed files
 *
 * Push commits ONLY the files this panel manages (home listings, the
 * preview entries + registry, and vendored component source) and pushes
 * the current branch to origin. On `main` (the normal case) that triggers
 * the Pages deploy; on any other branch it reports that you need to merge
 * to main. It never force-pushes and never touches unmanaged files.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UI_HTML = path.join(__dirname, 'index.html')

const HOME_FILE = 'src/data/homeSections.js'
const ENTRIES_FILE = 'src/previews/entries.js'
const REGISTRY_FILE = 'src/previews/registry.jsx'
const ENTRIES_ANCHOR = 'export const previewEntries = '

// Home-listing blocks — plain-data arrays edited by anchor.
const LISTING_BLOCKS = {
  sections: { file: HOME_FILE, anchor: 'export const sections = ' },
  pages: { file: HOME_FILE, anchor: 'export const pages = ' },
  experiments: { file: HOME_FILE, anchor: 'export const experiments = ' },
}

// Files Push is allowed to commit — everything this panel can write, and
// nothing else. `src/components` is a directory (vendored component
// source); the rest are single files.
const MANAGED_PATHS = [
  HOME_FILE,
  ENTRIES_FILE,
  REGISTRY_FILE,
  'src/components',
]

const COMMIT_MESSAGE = 'Update home + components via admin panel'
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

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
      if (data.length > 2_000_000) reject(new Error('body too large'))
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

/**
 * Resolve a component `source` (as stored in entries.js) to an absolute
 * path plus whether it's editable here. `src/...` paths are vendored in
 * this repo and editable; anything else resolves through node_modules
 * (the sibling external-site checkout) and is read-only. Returns null for
 * paths that escape their allowed root (traversal guard).
 */
function resolveSource(root, source) {
  if (typeof source !== 'string' || !source) return null
  if (source.startsWith('src/')) {
    const base = path.join(root, 'src')
    const abs = path.resolve(root, source)
    if (abs !== base && !abs.startsWith(base + path.sep)) return null
    return { abs, editable: true }
  }
  const base = path.join(root, 'node_modules')
  const abs = path.resolve(base, source)
  if (!abs.startsWith(base + path.sep)) return null
  return { abs, editable: false }
}

/**
 * Rename one renderer key in registry.jsx (`'from': (…)` → `'to': (…)`),
 * so the preview keeps rendering after a slug change. Throws if `from`
 * isn't present exactly once, or `to` already exists.
 */
function renameRegistryKey(src, from, to) {
  const fromKey = "'" + from + "':"
  const toKey = "'" + to + "':"
  if (src.includes(toKey)) {
    throw new Error(`registry already has a renderer for '${to}'`)
  }
  const parts = src.split(fromKey)
  if (parts.length !== 2) {
    throw new Error(
      `expected exactly one renderer for '${from}' in registry.jsx, found ${parts.length - 1}`
    )
  }
  return parts.join(toKey)
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

      const readEntries = async () => {
        const { readBlock } = await load()
        const src = fs.readFileSync(path.join(root, ENTRIES_FILE), 'utf8')
        return readBlock(src, ENTRIES_ANCHOR)
      }

      server.middlewares.use('/__admin', async (req, res, next) => {
        const [rawUrl, query = ''] = (req.url || '/').split('?')
        const url = rawUrl

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
            for (const [name, def] of Object.entries(LISTING_BLOCKS)) {
              const src = fs.readFileSync(path.join(root, def.file), 'utf8')
              data[name] = readBlock(src, def.anchor)
            }
            data.components = await readEntries()
            sendJson(res, 200, data)
            return
          }

          // PUT /__admin/api/block/<name> — rewrite one home-listing block
          const blockMatch = url.match(/^\/api\/block\/([a-zA-Z]+)$/)
          if (req.method === 'PUT' && blockMatch) {
            const name = blockMatch[1]
            const def = LISTING_BLOCKS[name]
            if (!def) {
              return sendJson(res, 404, {
                error:
                  name === 'components'
                    ? 'use POST /api/components for the component library'
                    : `unknown block: ${name}`,
              })
            }

            const value = await readJsonBody(req)
            if (!Array.isArray(value)) {
              return sendJson(res, 400, { error: 'expected a JSON array' })
            }

            const { writeBlock } = await load()
            const filePath = path.join(root, def.file)
            const src = fs.readFileSync(filePath, 'utf8')
            const nextSrc = writeBlock(src, def.anchor, value)
            fs.writeFileSync(filePath, nextSrc)
            sendJson(res, 200, { ok: true, block: name, count: value.length })
            return
          }

          // POST /__admin/api/components — rewrite previewEntries. Body:
          //   { entries: [...], renames: [{ from, to }] }
          // Renames keep registry.jsx's render keys in sync with slugs.
          if (req.method === 'POST' && url === '/api/components') {
            const body = await readJsonBody(req)
            const entries = body && body.entries
            const renames = (body && body.renames) || []
            if (!Array.isArray(entries)) {
              return sendJson(res, 400, { error: 'expected { entries: [...] }' })
            }

            // Validate slugs (unique, well-formed).
            const seen = new Set()
            for (const e of entries) {
              if (!e || typeof e.name !== 'string' || !SLUG.test(e.name)) {
                return sendJson(res, 400, {
                  error: `invalid slug: ${JSON.stringify(e && e.name)} (use lowercase, digits, hyphens)`,
                })
              }
              if (seen.has(e.name)) {
                return sendJson(res, 400, { error: `duplicate slug: ${e.name}` })
              }
              seen.add(e.name)
            }

            // Apply renames to registry.jsx first; if any fails we abort
            // before touching entries.js so nothing goes half-written.
            const registryPath = path.join(root, REGISTRY_FILE)
            if (renames.length) {
              let registrySrc = fs.readFileSync(registryPath, 'utf8')
              for (const { from, to } of renames) {
                if (!SLUG.test(from) || !SLUG.test(to)) {
                  return sendJson(res, 400, {
                    error: `invalid rename ${from} → ${to}`,
                  })
                }
                registrySrc = renameRegistryKey(registrySrc, from, to)
              }
              fs.writeFileSync(registryPath, registrySrc)
            }

            const { writeBlock } = await load()
            const entriesPath = path.join(root, ENTRIES_FILE)
            const src = fs.readFileSync(entriesPath, 'utf8')
            const nextSrc = writeBlock(src, ENTRIES_ANCHOR, entries)
            fs.writeFileSync(entriesPath, nextSrc)
            sendJson(res, 200, {
              ok: true,
              count: entries.length,
              renamed: renames.length,
            })
            return
          }

          // GET /__admin/api/source?name=<name>&field=<source|styles>
          // Read one of a component's files. `field` defaults to source.
          if (req.method === 'GET' && url === '/api/source') {
            const params = new URLSearchParams(query)
            const name = params.get('name')
            const field = params.get('field') || 'source'
            if (field !== 'source' && field !== 'styles') {
              return sendJson(res, 400, { error: `unknown field: ${field}` })
            }
            const entries = await readEntries()
            const entry = entries.find((e) => e.name === name)
            if (!entry) return sendJson(res, 404, { error: `unknown component: ${name}` })

            const rel = entry[field]
            const resolved = resolveSource(root, rel)
            if (!resolved) {
              return sendJson(res, 200, {
                name,
                field,
                source: rel || '',
                editable: false,
                exists: false,
                content: '',
                note: rel
                  ? 'No resolvable path for this file.'
                  : `This component has no ${field} path set.`,
              })
            }
            const exists = fs.existsSync(resolved.abs)
            sendJson(res, 200, {
              name,
              field,
              source: rel,
              editable: resolved.editable,
              exists,
              content: exists ? fs.readFileSync(resolved.abs, 'utf8') : '',
            })
            return
          }

          // PUT /__admin/api/source — write one of a component's vendored
          // files. Body: { name, content, field? }. field defaults to
          // source. Sibling (read-only) files are 403.
          if (req.method === 'PUT' && url === '/api/source') {
            const body = await readJsonBody(req)
            const name = body && body.name
            const content = body && body.content
            const field = (body && body.field) || 'source'
            if (typeof content !== 'string') {
              return sendJson(res, 400, { error: 'expected { name, content }' })
            }
            if (field !== 'source' && field !== 'styles') {
              return sendJson(res, 400, { error: `unknown field: ${field}` })
            }
            const entries = await readEntries()
            const entry = entries.find((e) => e.name === name)
            if (!entry) return sendJson(res, 404, { error: `unknown component: ${name}` })

            const rel = entry[field]
            const resolved = resolveSource(root, rel)
            if (!resolved) {
              return sendJson(res, 400, { error: `unresolvable ${field}: ${rel}` })
            }
            if (!resolved.editable) {
              return sendJson(res, 403, {
                error: `${rel} lives in external-site and is read-only here.`,
              })
            }
            fs.writeFileSync(resolved.abs, content)
            sendJson(res, 200, { ok: true, name, field, bytes: Buffer.byteLength(content) })
            return
          }

          // POST /__admin/api/publish — commit + push the managed files
          if (req.method === 'POST' && url === '/api/publish') {
            let branch
            try {
              branch = git(root, ['rev-parse', '--abbrev-ref', 'HEAD'])
            } catch {
              return sendJson(res, 500, { error: 'not a git repository' })
            }

            git(root, ['add', '--', ...MANAGED_PATHS])
            const staged = git(root, [
              'diff', '--cached', '--name-only', '--', ...MANAGED_PATHS,
            ])
            if (!staged) {
              return sendJson(res, 200, {
                published: false,
                reason: 'No changes to push — save an edit first.',
                branch,
              })
            }

            git(root, ['commit', '-m', COMMIT_MESSAGE, '--', ...MANAGED_PATHS])
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
              files: staged.split('\n').filter(Boolean),
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
