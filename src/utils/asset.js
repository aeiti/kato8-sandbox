/**
 * Prefix any `/assets/...` path with Vite's `BASE_URL` so it resolves
 * whether the site is served from `/` (local dev) or `/kato8-sandbox/`
 * (GitHub Pages). Mirrors the helper in external-site.
 */
export const asset = (p) =>
  p.replace(/\/assets\//g, `${import.meta.env.BASE_URL}assets/`)
