# CSS back-ports — ON HOLD until further notice

Two spacing fixes that exist on **staging** (`aeiti/kato8-staging`, live and
working) but never made it to **prod** (`terrytkato8/external-site`). They flow
the staging→prod direction the standard prod-first flow doesn't cover. Parked
here on hold; they'll eventually be applied to prod, but not yet.

## Status

- **On hold** — do not apply to prod until released. Surfaced 2026-08-16 by the
  prod drift report (`scripts/staging-drift.mjs`); moved here so they stop
  reading as "review me now."
- **Source of truth:** staging `main`. The fixes are live there; these patches
  are a point-in-time snapshot (captured 2026-08-16) in case staging drifts.

## The two items

### 1. `newsletter-signup.css` — tighten the signup form against the widget above

Pulls the newsletter form up so it sits ~24px below the GoFundMe widget instead
of the full stacked margin, with a smaller pull-up at ≤991px. See
`newsletter-signup.patch`.

### 2. `support.css` — asymmetric support-section margins

Splits `margin-block` into a larger top and smaller bottom (96/48 desktop,
48/24 at ≤767px), so the section spacing reads intentionally rather than evenly
padded. See `support.patch`.

## Applying when released

The patches are unified diffs rooted at external-site paths. From an
external-site checkout on a fresh feature branch:

```bash
git apply /path/to/kato8-sandbox/backlog/css-backports/newsletter-signup.patch
git apply /path/to/kato8-sandbox/backlog/css-backports/support.patch
```

Then verify against staging (the source of truth) in case it moved since the
snapshot, and ship via external-site's `/ship` flow (these are `src/` files, so
they mirror — full path: prod branch → mirror to staging → staging already has
them, so the planner will report ALREADY MIRRORED → prod PR + verify).

On release, drop these entries from the prod drift baseline
(`scripts/staging-drift-baseline.json`) and delete this directory.
