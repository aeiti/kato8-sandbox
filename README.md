# kato8-sandbox

Playground for Kato.8 design experiments, component previews, prototypes, and one-off tools we want to share with the team without shipping to production.

Nothing in this repo is deployed to the live site. Break things freely.

## Related repos

- [terrytkato8/external-site](https://github.com/terrytkato8/external-site) — production site
- [aeiti/kato8-staging](https://github.com/aeiti/kato8-staging) — staging mirror

## Stack

Vite + React + React Router. Same tools as the main site, minus the production chrome (no prerender, no image variants, no analytics, no SEO).

The main site (`external-site`) is installed as a `file:` dependency so we can pull in its CSS tokens, components, and data without duplicating them. This means **kato8-sandbox must live next to a checkout of external-site** — e.g. `~/GitHub/kato8-sandbox` and `~/GitHub/external-site`.

```bash
# One-time setup — clone the sibling first if you don't have it
cd ~/GitHub && git clone https://github.com/terrytkato8/external-site.git

# Then install and run
cd kato8-sandbox
npm install
npm run dev
```

## Structure

- `src/App.jsx` — route table.
- `src/pages/` — one file per experiment; add a matching `<Route>` in `App.jsx`.

## Process

See [PROCESS.md](./PROCESS.md) for the standard workflow — how to add an experiment, reuse main-site styles, test, share, and graduate work to production. Read it before starting a new experiment; future Claude sessions follow it, so keeping it accurate keeps the output consistent.
