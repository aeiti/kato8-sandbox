# Component process

Standard workflow for building and sharing UI experiments in kato8-sandbox. Keep this doc in mind before opening a session — future Claude runs will read it and follow it, so the more we lock down conventions here, the more consistent the output gets.

## 0. Repo layout assumption

kato8-sandbox depends on the sibling `external-site` checkout via a `file:` package.json entry (`../external-site`). Both repos must live side by side. Typical layout:

```
~/GitHub/
├── external-site/     ← production site source of truth
├── kato8-staging/     ← staging mirror
└── kato8-sandbox/     ← this repo
```

If external-site isn't cloned next to kato8-sandbox, `npm install` will fail. Fix:

```bash
cd ~/GitHub
git clone https://github.com/terrytkato8/external-site.git
```

The symlink means edits in external-site show up in the sandbox on next page reload — no `npm update` needed. If you switch branches in external-site, the sandbox picks up the new state.

## 1. Add an experiment

Every experiment is a page with a route. Structure:

- File: `src/pages/<PascalName>Page.jsx`
- Route: `src/App.jsx` — add `<Route path="/<kebab-name>" element={<PascalName />} />`
- Optional CSS: `src/styles/<kebab-name>.css`, imported from the page component or from `src/main.jsx`

Naming:
- URL uses kebab-case matching the concept (`/kickstarter-buttons`, not `/ksBtns`).
- File uses PascalCase + `Page` suffix (`KickstarterButtonsPage.jsx`).
- CSS class prefix matches the concept (`.kickstarter-button` — not `.kbtn`) so grepping in future sessions finds everything.

## 1b. Add a full-page preview ("Pages")

Some sandbox entries are whole pages, not isolated experiments — a preview
of a real site page (e.g. the crowdfunding games landing + its detail
pages) for team review. These live under the **Pages** section on the home
page (`pages` array in `src/pages/HomePage.jsx`), a sibling of Browse and
Experiments.

Conventions specific to page previews:

- **Wrap the content in the real chrome.** Import `Nav` and `Footer` from
  `kato8studios-site` and render them around the page body so it reads like
  the live page, not a bare component.
- **Match the real route paths** where practical (e.g. `/crowdfunding-games`
  and `/crowdfunding-games/:slug`) so internal `<Link>`s work unchanged.
- **Mirror the main site's layout toggles.** The main site swaps `body` ↔
  `body-2` (full-bleed) per route; replicate that in `src/App.jsx` via
  `useLocation()` for the routes that need it.

### Vendoring exception — when "never copy" doesn't apply

Section 2's rule is *import from `kato8studios-site`, never copy*. That
assumes the code exists on external-site `main`. When you're previewing a
page whose source **isn't upstream yet** (e.g. it lives only on a staging
branch or an un-merged external-site branch), there's nothing to import —
so **vendor a copy** of just the not-yet-upstream pieces into the sandbox
(`src/components`, `src/data`, `src/styles`). Still import everything that
*is* upstream (Nav, Footer, tokens, Seo).

When the feature graduates to external-site `main`, delete the vendored
copies and switch those imports to `kato8studios-site/...` (see §5). Until
then, keep the vendored slug lists / data in sync with staging by hand.

## 2. Reuse main-site styles and components

The external-site repo is installed as `kato8studios-site` (its own package name). Import deep paths:

```jsx
// Design tokens (colors, fonts, spacing scale)
import 'kato8studios-site/src/styles/main/tokens.css'
// Typography defaults
import 'kato8studios-site/src/styles/main/typography.css'
// Base button
import 'kato8studios-site/src/styles/main/buttons.css'
```

Components:

```jsx
import Nav from 'kato8studios-site/src/components/Nav'
import Footer from 'kato8studios-site/src/components/Footer'
```

Assets live at `kato8studios-site/public/assets/...`. For static images, either copy the file into `kato8-sandbox/public/assets/` or reference the URL directly (the `asset()` helper doesn't work in sandbox because base is `/`).

**Don't re-declare tokens or duplicate CSS in the sandbox.** If a token is missing upstream, add it to external-site first; the sandbox picks it up on reload.

## 3. Test locally

Every experiment must be verified in a browser before you call it done — a code review checks the code, not the pixels.

1. `npm run dev` (Vite serves at http://localhost:5173)
2. Visit `/<your-route>`
3. Check both OS light and dark modes if the design depends on either.
4. Check mobile viewport (resize to 375×812 or use browser devtools).
5. Watch the browser console — no red errors, no missing assets.
6. If the experiment has interactions (hover, click, form input), exercise them and confirm they behave.
7. Compare against the main site at `http://localhost:5173/…` in a separate tab if the goal is visual consistency.

## 4. Share with team

The sandbox auto-deploys to GitHub Pages on every push to `main`:

**https://aeiti.github.io/kato8-sandbox/**

Share the deep link — e.g. `https://aeiti.github.io/kato8-sandbox/kickstarter-buttons` — and the SPA fallback (public/404.html + decode snippet in index.html) restores the client-side route. Direct visits and refreshes both work.

The deploy is driven by `.github/workflows/deploy.yml`, which checks out both this repo and `terrytkato8/external-site` side by side so the `file:` dep resolves in CI. If your experiment adds a new npm dep from external-site or needs an env var, update the workflow.

For work-in-progress that isn't ready to share yet, push to a branch instead of `main` — the workflow only fires on `main`. Screenshot or screen-record if you need to share before merging.

## 5. Graduating an experiment to production

When a design is approved and ready to ship:

1. Copy the component (JSX + CSS) into `external-site/src/components/` and `external-site/src/styles/main/`.
2. Wire it into the appropriate page(s) on a feature branch of external-site.
3. Follow external-site's standard change flow — see its `CLAUDE.md` for details (prod branch → mirror to kato8-staging → PR + verify staging → PR + verify prod).
4. Once the change is on prod, delete the sandbox experiment (page + route + any local CSS) and land the removal.

The sandbox is meant to be a graveyard of what didn't ship and a fast path for what did. Don't let dead experiments accumulate.

## Conventions summary

| Thing | Convention |
|---|---|
| Route | kebab-case (`/kickstarter-buttons`) |
| Page file | PascalCase + `Page.jsx` (`KickstarterButtonsPage.jsx`) |
| CSS class | Full descriptive names (`.kickstarter-button`) — no cryptic abbreviations |
| Reuse | Import from `kato8studios-site/…`, never copy files across — except vendoring not-yet-upstream page-preview code (§1b) |
| Testing | Browser verification is required before "done" |
| Cleanup | Delete on ship |
