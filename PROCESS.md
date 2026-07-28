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

The sandbox is not deployed yet. Interim options:
- Screenshot the page in both states you want to compare (rest / hover / mobile / dark).
- Record a short screen capture if you're showing motion or transitions.
- Push your branch and pair-open on a call.

When we set up a deploy target (Cloudflare Pages / Vercel / GitHub Pages), document the URL pattern here.

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
| Reuse | Import from `kato8studios-site/…`, never copy files across |
| Testing | Browser verification is required before "done" |
| Cleanup | Delete on ship |
