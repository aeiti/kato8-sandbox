/**
 * Home-page listing data — the three sections rendered on `/`:
 * Browse (`sections`), Pages (`pages`), and Experiments (`experiments`).
 *
 * Split out of `HomePage.jsx` so the dev-only home manager
 * (`scripts/dev-admin/`, reachable at http://localhost:5173/__admin
 * during `npm run dev`) can rewrite these arrays in place without
 * touching JSX. Each array is a plain-data literal: keep it that way
 * (no imports, no expressions) so the manager's serializer can parse
 * and re-emit it. Comments inside the arrays are dropped on save.
 *
 * Entry shapes:
 *   sections / pages: { path, title, description }
 *   experiments:      { path, title, active, description }
 * `active` drives the Active/Concluded badge on the Experiments list.
 */

export const sections = [
  {
    path: '/components',
    title: 'Components',
    description:
      'Every component from the main site (Nav, Footer, Hero, GameCard, forms, etc.), rendered in isolation for review.',
  },
]

export const pages = [
  {
    path: '/crowdfunding-games',
    title: 'Crowdfunding Games',
    description:
      'Full-page preview of the crowdfunding games landing plus its six per-game detail pages (main-section layout, placeholder content). Live on staging; previewed here for review.',
  },
]

export const experiments = [
  {
    path: '/kickstarter-button-v2',
    title: 'Kickstarter Button v2',
    active: true,
    description: 'Flatter, "official-partner" take on the shipped Kickstarter CTA — response to v1 reading as designed-by-AI. Side-by-side with v1 for team review.',
  },
  {
    path: '/our-story-timeline',
    title: 'Our Story timeline',
    active: true,
    description: 'Milestone timeline proposed for the bottom of the About page — alternating cards zigzag around a centered line, collapsing to a left rail on mobile. WIP from external-site branch about-timeline-section; vendored here (not yet on main).',
  },
  {
    path: '/newsletter-on-about',
    title: 'Newsletter on About',
    active: true,
    description: 'NewsletterSignup mounted below the Support Kato.8 section on the About page, with the top spacing tightened so the form hugs the section above. WIP from external-site branch mount-newsletter-on-about.',
  },
  {
    path: '/kickstarter-buttons',
    title: 'Kickstarter Button',
    active: false,
    description: 'Nine hover variants across three axes (shadow, motion, color) for the Kickstarter CTA. Top pick shipped to prod 2026-07-29; page kept as the historical record.',
  },
]
