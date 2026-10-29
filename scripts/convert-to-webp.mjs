// Converts PNG/JPEG images to WebP next to the source (same stem), then
// removes the source. For designer exports dropped into public/assets —
// the studio-bio cards and frame backs were 400–600 KB PNGs each.
//
//   node scripts/convert-to-webp.mjs public/assets/sandbox/cards [more dirs or files…]
//   node scripts/convert-to-webp.mjs --keep <…>     # keep the source files
//
// Update whatever references the old paths (e.g. `cardImage` in
// src/data/studioBios.js) to the .webp names afterwards.

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE_EXTS = new Set(['.png', '.jpg', '.jpeg'])
const QUALITY = 90

const args = process.argv.slice(2)
const keep = args.includes('--keep')
const targets = args.filter((a) => a !== '--keep')
if (!targets.length) {
  console.error('usage: node scripts/convert-to-webp.mjs [--keep] <dir|file>…')
  process.exit(1)
}

async function sources(target) {
  const stat = await fs.stat(target)
  if (stat.isFile()) return [target]
  const names = await fs.readdir(target)
  return names.map((n) => path.join(target, n))
}

let before = 0
let after = 0
for (const target of targets) {
  for (const file of await sources(target)) {
    if (!SOURCE_EXTS.has(path.extname(file).toLowerCase())) continue
    const out = file.replace(/\.[^.]+$/, '.webp')
    await sharp(file).webp({ quality: QUALITY, effort: 6 }).toFile(out)
    const [a, b] = await Promise.all([fs.stat(file), fs.stat(out)])
    before += a.size
    after += b.size
    console.log(`${file} → ${path.basename(out)}  ${Math.round(a.size / 1024)} KB → ${Math.round(b.size / 1024)} KB`)
    if (!keep) await fs.rm(file)
  }
}
console.log(`total ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB`)
