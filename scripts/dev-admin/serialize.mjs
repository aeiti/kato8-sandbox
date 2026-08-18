/**
 * Read/rewrite a single data literal inside a source file, by anchor.
 *
 * The home manager (see plugin.mjs) uses this to edit the `sections`,
 * `pages`, and `experiments` arrays in `src/data/homeSections.js`
 * without disturbing anything else in the file. The approach mirrors
 * external-site's dev-admin serializer:
 *
 *   1. locate the literal by an anchor string (e.g. `export const
 *      experiments = `), then bracket-match to its exact end, skipping
 *      over string literals and comments so braces inside them don't
 *      miscount depth;
 *   2. read it by evaluating the sliced literal;
 *   3. write it by pretty-printing the new value and splicing it back
 *      in, then RE-READING the result and deep-comparing to the input —
 *      on any mismatch we throw and never touch the file.
 *
 * Deliberately dependency-free (no AST parser). Only ever runs against
 * our own dev source, and only under `vite` (never in a build).
 */

// Canonical key order so saved objects don't churn regardless of the
// order the UI sends keys in. Covers both editable literals:
//   home listings  → { path, title, active, description }
//   preview entries → { name, label, status, category, source, styles, description }
// Unknown keys sort after these, alphabetical + stable.
const KEY_ORDER = ['name', 'label', 'path', 'title', 'active', 'status', 'category', 'source', 'styles', 'description']
const IDENT = /^[A-Za-z_$][\w$]*$/

function orderedKeys(obj) {
  return Object.keys(obj).sort((a, b) => {
    const ia = KEY_ORDER.indexOf(a)
    const ib = KEY_ORDER.indexOf(b)
    if (ia === -1 && ib === -1) return a < b ? -1 : a > b ? 1 : 0
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

function quoteString(s) {
  const escaped = s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
  return "'" + escaped + "'"
}

/**
 * Pretty-print a JSON-ish value as a JS literal. Arrays and objects are
 * always multiline (2-space indent, trailing commas, single quotes) to
 * match the hand-authored style in homeSections.js.
 */
export function printValue(value, indent = 0) {
  const pad = '  '.repeat(indent)
  const padIn = '  '.repeat(indent + 1)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((v) => padIn + printValue(v, indent + 1))
    return '[\n' + items.join(',\n') + ',\n' + pad + ']'
  }

  if (value && typeof value === 'object') {
    const keys = orderedKeys(value)
    if (keys.length === 0) return '{}'
    const parts = keys.map((k) => {
      const key = IDENT.test(k) ? k : quoteString(k)
      return padIn + key + ': ' + printValue(value[k], indent + 1)
    })
    return '{\n' + parts.join(',\n') + ',\n' + pad + '}'
  }

  if (typeof value === 'string') return quoteString(value)
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  if (value === null) return 'null'
  throw new Error('printValue: unserializable ' + typeof value)
}

/**
 * Index of the bracket that closes the one at `openIndex`, skipping
 * strings ('/"/`) and // and /* comments.
 */
function matchBracket(src, openIndex) {
  const open = src[openIndex]
  const close = open === '[' ? ']' : '}'
  let depth = 0
  let inStr = null

  for (let i = openIndex; i < src.length; i++) {
    const ch = src[i]

    if (inStr) {
      if (ch === '\\') i++ // skip escaped char
      else if (ch === inStr) inStr = null
      continue
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = ch
      continue
    }
    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i)
      if (nl === -1) break
      i = nl
      continue
    }
    if (ch === '/' && src[i + 1] === '*') {
      const endc = src.indexOf('*/', i + 2)
      if (endc === -1) break
      i = endc + 1
      continue
    }

    if (ch === open) depth++
    else if (ch === close && --depth === 0) return i
  }

  throw new Error('matchBracket: unbalanced from ' + openIndex)
}

/** Char offsets `{ start, end }` (end exclusive) of the literal after `anchor`. */
export function findBlock(src, anchor) {
  const at = src.indexOf(anchor)
  if (at === -1) throw new Error('findBlock: anchor not found: ' + anchor)
  let i = at + anchor.length
  while (i < src.length && src[i] !== '[' && src[i] !== '{') i++
  if (i >= src.length) throw new Error('findBlock: no literal after anchor: ' + anchor)
  return { start: i, end: matchBracket(src, i) + 1 }
}

/** Parse the literal after `anchor` into a plain JS value. */
export function readBlock(src, anchor) {
  const { start, end } = findBlock(src, anchor)
  const literal = src.slice(start, end)
  // eslint-disable-next-line no-new-func — our own dev source only
  return new Function('return (' + literal + ')')()
}

/**
 * JSON.stringify with object keys sorted recursively, so the comparison
 * is by DATA, not key order. printValue re-emits objects in canonical
 * KEY_ORDER, so a value whose keys arrive in a different order (e.g. a
 * newly-added entry with `active` last) is still an equal round-trip.
 */
function stableStringify(value) {
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']'
  }
  if (value && typeof value === 'object') {
    const parts = Object.keys(value)
      .sort()
      .map((k) => JSON.stringify(k) + ':' + stableStringify(value[k]))
    return '{' + parts.join(',') + '}'
  }
  return JSON.stringify(value)
}

/**
 * Return a new source string with the literal after `anchor` replaced by
 * `value`, pretty-printed. Throws (leaving nothing changed) if the
 * regenerated literal doesn't re-parse to a deep-equal value (compared by
 * data, independent of key order).
 */
export function writeBlock(src, anchor, value) {
  const { start, end } = findBlock(src, anchor)
  const literal = printValue(value, 0)
  const next = src.slice(0, start) + literal + src.slice(end)

  const reparsed = readBlock(next, anchor)
  if (stableStringify(reparsed) !== stableStringify(value)) {
    throw new Error('writeBlock: round-trip mismatch for ' + anchor)
  }
  return next
}
