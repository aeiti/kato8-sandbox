/**
 * Dev-only Studio Bios admin panel — a Vite middleware plugin for full
 * editing of the collector-card bios in `src/data/studioBios.js` from a
 * browser UI, then pushing to the live site.
 *
 * Deliberately a SEPARATE panel from the main home/components manager
 * (`plugin.mjs`, mounted at /__admin) so bios editing can be developed
 * and used on its own. It is built to the same conventions — same
 * `serialize.mjs` round-trip, same `/api/...` shape, same publish flow —
 * so folding it into the main panel later is mostly moving these
 * endpoints into plugin.mjs and this UI into a new tab. The two panels
 * cross-link in their headers.
 *
 * Reachable at http://localhost:5173/__bios during `npm run dev`.
 *
 * Stays out of production the same three structural ways as plugin.mjs:
 *   1. `apply: 'serve'` — never loaded for `vite build`.
 *   2. Lives in `scripts/`, outside `src/`, so it can't be bundled.
 *   3. `/__bios` is a dev-server HTTP route, not a React route.
 *
 * Endpoints (all under /__bios):
 *   GET  /__bios                    → the bios editor UI (bios-admin.html)
 *   GET  /__bios/api/info           → { branch, isMain }
 *   GET  /__bios/api/data           → { people, types }
 *   PUT  /__bios/api/people         → rewrite the `studioBios` array
 *   PUT  /__bios/api/types          → rewrite the `CARD_TYPES` object
 *   POST /__bios/api/upload         → save an uploaded image (avatar / card art)
 *   POST /__bios/api/publish        → commit + push the bios feature files
 *
 * Push commits ONLY the studio-bios feature files (the data source, the
 * page, its stylesheet, the five card components, and uploaded images
 * under public/assets/sandbox) — an explicit allowlist, so it never grabs
 * unrelated WIP. It never force-pushes.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UI_HTML = path.join(__dirname, 'bios-admin.html')

const DATA_FILE = 'src/data/studioBios.js'
const PEOPLE_ANCHOR = 'export const studioBios = '
const TYPES_ANCHOR = 'export const CARD_TYPES = '
const ASSETS_DIR = 'public/assets/sandbox'

// Files Push is allowed to commit — the whole studio-bios feature and
// nothing else. Explicit list (not a directory) so a Push never sweeps in
// unrelated components or pages.
const MANAGED_PATHS = [
  DATA_FILE,
  'src/pages/StudioBiosPage.jsx',
  'src/styles/studio-bios.css',
  'src/components/BioCardArt.jsx',
  'src/components/PokemonBioCard.jsx',
  'src/components/MagicBioCard.jsx',
  'src/components/YugiohBioCard.jsx',
  'src/components/StudioBioGallery.jsx',
  ASSETS_DIR,
]

const COMMIT_MESSAGE = 'Update studio bios via admin panel'
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Fields that must be stored as numbers, so form-input strings don't
// silently change the data's types on save. Grouped by where they live.
const NUMERIC_TOP = []
const NUMERIC_POKEMON = ['hp', 'retreat']
const NUMERIC_MAGIC = ['power', 'toughness']
const NUMERIC_YUGIOH = ['level', 'atk', 'def']

const IMAGE_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
}

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readJsonBody(req, maxBytes = 12_000_000) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > maxBytes) reject(new Error('body too large'))
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

/** Coerce the known numeric fields of one nested block from strings to
 *  numbers (dropping blank/NaN values), leaving other fields untouched. */
function coerceNumbers(obj, keys) {
  if (!obj || typeof obj !== 'object') return obj
  const out = { ...obj }
  for (const k of keys) {
    if (out[k] === '' || out[k] === null || out[k] === undefined) {
      delete out[k]
      continue
    }
    const n = Number(out[k])
    if (!Number.isNaN(n)) out[k] = n
  }
  return out
}

/**
 * Normalize one person record from the UI into the on-disk shape:
 * required slug (derived from the name if missing), trimmed strings,
 * numeric stat fields coerced to numbers, and empty optional blocks
 * dropped so the file stays tidy. Throws on an unusable record.
 */
function normalizePerson(p, index) {
  if (!p || typeof p !== 'object') {
    throw new Error(`person #${index + 1} is not an object`)
  }
  const name = String(p.name || '').trim()
  if (!name) throw new Error(`person #${index + 1} needs a name`)

  let slug = String(p.slug || '').trim().toLowerCase()
  if (!slug) {
    slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  if (!SLUG.test(slug)) {
    throw new Error(`invalid slug for "${name}": ${JSON.stringify(slug)}`)
  }

  const out = { slug, name, role: String(p.role || '').trim(), type: p.type || 'ops' }
  if (p.monogram) out.monogram = String(p.monogram).trim().slice(0, 3)
  out.bio = String(p.bio || '').trim()
  if (p.avatar) out.avatar = String(p.avatar).trim()
  if (p.cardImage) out.cardImage = String(p.cardImage).trim()

  out.specialties = (Array.isArray(p.specialties) ? p.specialties : [])
    .map((s) => ({ name: String(s.name || '').trim(), text: String(s.text || '').trim() }))
    .filter((s) => s.name || s.text)

  const pokemon = coerceNumbers(p.pokemon, NUMERIC_POKEMON)
  const magic = coerceNumbers(p.magic, NUMERIC_MAGIC)
  const yugioh = coerceNumbers(p.yugioh, NUMERIC_YUGIOH)
  if (pokemon && Object.keys(pokemon).length) out.pokemon = pokemon
  if (magic && Object.keys(magic).length) out.magic = magic
  if (yugioh && Object.keys(yugioh).length) out.yugioh = yugioh
  return coerceNumbers(out, NUMERIC_TOP)
}

/** Filesystem-safe image basename: lowercase, hyphen-separated. */
function safeImageName(name, ext) {
  const stem = String(name || '')
    .replace(/\.[^.]*$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return (stem || 'image') + '.' + ext
}

export function devBiosAdmin() {
  return {
    name: 'kato8-dev-bios-admin',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root
      const load = () => import('./serialize.mjs')
      const dataPath = path.join(root, DATA_FILE)

      server.middlewares.use('/__bios', async (req, res, next) => {
        const [rawUrl, query = ''] = (req.url || '/').split('?')
        const url = rawUrl

        try {
          // GET /__bios — serve the UI
          if (req.method === 'GET' && (url === '/' || url === '')) {
            res.setHeader('Content-Type', 'text/html')
            res.end(fs.readFileSync(UI_HTML, 'utf8'))
            return
          }

          // GET /__bios/api/info — current git branch (for the header)
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

          // GET /__bios/api/data — read the people array + the type themes
          if (req.method === 'GET' && url === '/api/data') {
            const { readBlock } = await load()
            const src = fs.readFileSync(dataPath, 'utf8')
            sendJson(res, 200, {
              people: readBlock(src, PEOPLE_ANCHOR),
              types: readBlock(src, TYPES_ANCHOR),
            })
            return
          }

          // PUT /__bios/api/people — rewrite the studioBios array
          if (req.method === 'PUT' && url === '/api/people') {
            const value = await readJsonBody(req)
            if (!Array.isArray(value)) {
              return sendJson(res, 400, { error: 'expected a JSON array of people' })
            }

            const people = value.map((p, i) => normalizePerson(p, i))
            const seen = new Set()
            for (const p of people) {
              if (seen.has(p.slug)) {
                return sendJson(res, 400, { error: `duplicate slug: ${p.slug}` })
              }
              seen.add(p.slug)
            }

            const { writeBlock } = await load()
            const src = fs.readFileSync(dataPath, 'utf8')
            fs.writeFileSync(dataPath, writeBlock(src, PEOPLE_ANCHOR, people))
            sendJson(res, 200, { ok: true, count: people.length, people })
            return
          }

          // PUT /__bios/api/types — rewrite the CARD_TYPES object
          if (req.method === 'PUT' && url === '/api/types') {
            const value = await readJsonBody(req)
            if (!value || typeof value !== 'object' || Array.isArray(value)) {
              return sendJson(res, 400, { error: 'expected a JSON object of types' })
            }
            for (const key of Object.keys(value)) {
              if (!SLUG.test(key)) {
                return sendJson(res, 400, { error: `invalid type key: ${key}` })
              }
            }

            const { writeBlock } = await load()
            const src = fs.readFileSync(dataPath, 'utf8')
            fs.writeFileSync(dataPath, writeBlock(src, TYPES_ANCHOR, value))
            sendJson(res, 200, { ok: true, keys: Object.keys(value) })
            return
          }

          // POST /__bios/api/upload — save an uploaded image under
          // public/assets/sandbox. Body: { filename, dataUrl }.
          if (req.method === 'POST' && url === '/api/upload') {
            const body = await readJsonBody(req)
            const dataUrl = body && body.dataUrl
            const m = typeof dataUrl === 'string'
              ? dataUrl.match(/^data:([^;]+);base64,(.*)$/)
              : null
            if (!m) {
              return sendJson(res, 400, { error: 'expected { filename, dataUrl } (base64 data URL)' })
            }
            const ext = IMAGE_EXT[m[1]]
            if (!ext) {
              return sendJson(res, 400, {
                error: `unsupported image type: ${m[1]} (png, jpg, gif, svg, webp)`,
              })
            }
            const buf = Buffer.from(m[2], 'base64')
            if (buf.length > 8_000_000) {
              return sendJson(res, 413, { error: 'image too large (8 MB max)' })
            }

            const dir = path.join(root, ASSETS_DIR)
            fs.mkdirSync(dir, { recursive: true })
            let file = safeImageName(body.filename, ext)
            if (fs.existsSync(path.join(dir, file))) {
              const stem = file.replace(/\.[^.]*$/, '')
              let n = 1
              while (fs.existsSync(path.join(dir, `${stem}-${n}.${ext}`))) n++
              file = `${stem}-${n}.${ext}`
            }
            fs.writeFileSync(path.join(dir, file), buf)
            const publicPath = `/assets/sandbox/${file}`
            sendJson(res, 200, { ok: true, file, path: publicPath, bytes: buf.length })
            return
          }

          // POST /__bios/api/publish — commit + push the bios feature files
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
