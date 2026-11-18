/**
 * Helpers shared by the two dev-only admin panels (`plugin.mjs` at
 * /__admin and `bios-plugin.mjs` at /__bios): JSON request/response,
 * git, image upload, and Push — which opens a pull request.
 *
 * Push never commits or pushes the dev's own checkout. It:
 *   1. fetches origin/main;
 *   2. diffs the managed files' uncommitted edits against HEAD (Push no
 *      longer commits locally, so there is nothing else to carry; a
 *      feature branch's own commits are never swept in);
 *   3. creates `content/<yyyymmdd-hhmm>` from origin/main in a temporary
 *      worktree and applies that diff there (3-way, so a newer main is
 *      kept, and a real conflict stops the Push);
 *   4. runs the full build (vite build + prerender, and check-routes when
 *      present) in that worktree — a broken build never gets pushed;
 *   5. commits, pushes the branch, and opens a PR with `gh pr create`.
 * Merging that PR is what deploys (the Pages workflow runs on main).
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFile, execFileSync } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export function readJsonBody(req, maxBytes = 2_000_000) {
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

export function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

/** Current branch, or null outside a git repo. */
export function currentBranch(root) {
  try {
    return git(root, ['rev-parse', '--abbrev-ref', 'HEAD'])
  } catch {
    return null
  }
}

// ---- Image upload ----------------------------------------------------

// Image types the uploader accepts, mapped to their canonical extension.
export const IMAGE_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
}

/** Filesystem-safe image basename: lowercase, hyphen-separated. */
export function safeImageName(name, ext) {
  const stem = String(name || '')
    .replace(/\.[^.]*$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return (stem || 'image') + '.' + ext
}

/**
 * Save a `{ filename, dataUrl }` upload under `<root>/<assetsDir>`, never
 * clobbering an existing file (suffixes -1, -2, …). Returns
 * `[status, body]`; on success body is `{ ok, file, path, bytes }` where
 * `path` is the public URL (`/assets/sandbox/<file>`).
 */
export function saveUpload(root, assetsDir, body) {
  const dataUrl = body && body.dataUrl
  const m = typeof dataUrl === 'string' ? dataUrl.match(/^data:([^;]+);base64,(.*)$/) : null
  if (!m) return [400, { error: 'expected { filename, dataUrl } (base64 data URL)' }]
  const ext = IMAGE_EXT[m[1]]
  if (!ext) return [400, { error: `unsupported image type: ${m[1]} (png, jpg, gif, svg, webp)` }]
  const buf = Buffer.from(m[2], 'base64')
  if (buf.length > 8_000_000) return [413, { error: 'image too large (8 MB max)' }]

  const dir = path.join(root, assetsDir)
  fs.mkdirSync(dir, { recursive: true })
  let file = safeImageName(body.filename, ext)
  if (fs.existsSync(path.join(dir, file))) {
    const stem = file.replace(/\.[^.]*$/, '')
    let n = 1
    while (fs.existsSync(path.join(dir, `${stem}-${n}.${ext}`))) n++
    file = `${stem}-${n}.${ext}`
  }
  fs.writeFileSync(path.join(dir, file), buf)
  const publicPath = '/' + path.posix.join(assetsDir.replace(/^public\//, ''), file)
  return [200, { ok: true, file, path: publicPath, bytes: buf.length }]
}

// ---- Push → pull request ---------------------------------------------

async function run(cmd, args, cwd, env, { raw = false } = {}) {
  try {
    const { stdout } = await execFileAsync(cmd, args, {
      cwd,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      env: env ? { ...process.env, ...env } : process.env,
    })
    return raw ? stdout : stdout.trim()
  } catch (err) {
    const out = `${err.stdout || ''}\n${err.stderr || ''}`.trim()
    const tail = out.split('\n').slice(-15).join('\n')
    throw new Error(`${cmd} ${args[0]} failed${tail ? ':\n' + tail : ''}`)
  }
}

function stamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
}

/**
 * Open a PR against main carrying this checkout's changes to `paths`
 * (files or directories, relative to `root`). Resolves to
 * `{ published: false, reason }` when there is nothing new, or
 * `{ published: true, prUrl, branch, files, message }`. Throws (with the
 * failing command's output) on a conflict, a failed build, or a failed
 * push; the temporary worktree is always removed.
 */
export async function publishPullRequest({ root, paths, commitMessage, title, panel }) {
  await run('git', ['fetch', 'origin', 'main'], root)

  // Uncommitted edits to the managed paths. Applied 3-way onto
  // origin/main, so a checkout that is behind main still works.
  // Untrimmed: a patch's last context line can end in whitespace.
  const patch = await run('git', ['diff', '--binary', 'HEAD', '--', ...paths], root, null, { raw: true })
  const untracked = (
    await run('git', ['ls-files', '--others', '--exclude-standard', '-z', '--', ...paths], root)
  )
    .split('\0')
    .filter(Boolean)
  if (!patch && !untracked.length) {
    return { published: false, reason: 'No changes to push — save an edit first.' }
  }

  let branch = `content/${stamp()}`
  for (let n = 2; await run('git', ['ls-remote', '--heads', 'origin', branch], root); n++) {
    branch = `content/${stamp()}-${n}`
  }

  // The worktree sits next to an `external-site` link, mirroring the
  // sibling layout vite.config.js and the `file:` dependency expect.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kato8-publish-'))
  const wt = path.join(tmp, 'kato8-sandbox')
  fs.symlinkSync(path.resolve(root, '../external-site'), path.join(tmp, 'external-site'))
  await run('git', ['worktree', 'add', '--no-track', '-b', branch, wt, 'origin/main'], root)
  let pushed = false

  try {
    if (patch) {
      const patchFile = path.join(tmp, 'changes.patch')
      fs.writeFileSync(patchFile, patch)
      try {
        await run('git', ['apply', '--3way', '--whitespace=nowarn', patchFile], wt)
      } catch (err) {
        throw new Error(
          'Could not apply your edits onto origin/main — usually a conflict with newer ' +
            'changes on main. Pull main into this checkout, re-check your edits, and Push again.\n' +
            err.message,
        )
      }
    }
    for (const rel of untracked) {
      const dest = path.join(wt, rel)
      if (fs.existsSync(dest) && !fs.readFileSync(dest).equals(fs.readFileSync(path.join(root, rel)))) {
        throw new Error(`${rel} is new here but main already has a different file at that path`)
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(path.join(root, rel), dest)
    }

    await run('git', ['add', '-A', '--', ...paths], wt)
    const files = (await run('git', ['diff', '--cached', '--name-only'], wt)).split('\n').filter(Boolean)
    if (!files.length) {
      return { published: false, reason: 'Nothing new — main already has these changes.' }
    }

    fs.symlinkSync(path.join(root, 'node_modules'), path.join(wt, 'node_modules'))
    await run('npm', ['run', 'build'], wt, { VITE_DEPLOY_TARGET: 'pages' })
    if (fs.existsSync(path.join(wt, 'scripts/check-routes.mjs'))) {
      await run('node', ['scripts/check-routes.mjs'], wt)
    }

    await run('git', ['commit', '-m', commitMessage], wt)
    await run('git', ['push', '-u', 'origin', branch], wt)
    pushed = true

    const body = [
      `Opened from the dev admin panel (${panel}).`,
      '',
      'Files:',
      ...files.map((f) => `- \`${f}\``),
      '',
      '`npm run build` passed locally before push. Merging deploys to GitHub Pages.',
    ].join('\n')
    const prUrl = await run(
      'gh',
      ['pr', 'create', '--base', 'main', '--head', branch, '--title', title, '--body', body],
      wt,
    )
    return {
      published: true,
      prUrl,
      branch,
      files,
      message: `Opened ${prUrl} — build passed. Merging it deploys. Your edits stay uncommitted here: after the merge, discard them and pull main.`,
    }
  } catch (err) {
    if (pushed) err.message = `Pushed ${branch} but could not open the PR: ${err.message}`
    throw err
  } finally {
    await run('git', ['worktree', 'remove', '--force', wt], root).catch(() => {})
    await run('git', ['branch', '-D', branch], root).catch(() => {})
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}
