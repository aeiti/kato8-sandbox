/**
 * Single source of truth for the crowdfunding games. Consumed by the
 * landing grid (`CrowdfundingGameGrid` / `CrowdfundingGameCard`) and the
 * per-game detail pages (`CrowdfundingGamePage`, routed via
 * `/crowdfunding-games/:slug`).
 *
 * Mirrors the model used by the three core games in `src/data/games.js`:
 * one array of entries plus a `getCrowdfundingGameBySlug()` lookup.
 *
 * These are intentionally placeholders — real campaigns, art, and copy get
 * filled in later. Body copy is lorem ipsum.
 *
 * Editable from the dev admin panel (/__admin → Crowdfunding), which
 * rewrites the `crowdfundingGames` array below in place and keeps
 * `CROWDFUNDING_SLUGS` in `src/data/seo-config.js` in sync. Keep the array
 * a plain literal (no shared constants or computed values) so the panel
 * can read and rewrite it; comments inside the array are dropped on save.
 *
 * Shape (all fields optional unless noted):
 *   slug        — REQUIRED. URL slug for `/crowdfunding-games/:slug` and React key.
 *   title       — display title (card + detail hero).
 *   categories  — string[]. Rendered as pill tags on both card and detail page.
 *   comingSoon  — boolean. Shows a "Coming Soon" tag on the detail hero.
 *   description — short blurb shown on the landing card.
 *   body        — string[]. Paragraphs shown in the detail page's main section.
 *   image       — URL or `/assets/...` path (optional). Card background;
 *                 falls back to a plain placeholder block when absent.
 *   coverImage  — { src, alt } (optional). Portrait cover on the detail hero;
 *                 falls back to a plain placeholder block when absent.
 *   Image paths are stored base-less (`/assets/sandbox/foo.png`); the card
 *   and detail page pipe them through `asset()` so they resolve on Pages.
 */

export const crowdfundingGames = [
  {
    slug: 'dead-hour',
    title: 'Dead Hour',
    categories: [
      'Category',
      'Category',
    ],
    comingSoon: true,
    image: '/assets/sandbox/deadhour-01-horde.png',
    coverImage: {
      src: '/assets/sandbox/deadhour-cover-630x500.png',
      alt: 'Dead Hour',
    },
    description: 'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    ],
  },
  {
    slug: 'hollowbrook-apothecary',
    title: 'Hollowbrook Apothecary',
    categories: [
      'Category',
      'Category',
    ],
    comingSoon: true,
    image: '/assets/sandbox/2-garden-afternoon.png',
    coverImage: {
      src: '/assets/sandbox/cover-1.png',
      alt: 'Dead Hour',
    },
    description: 'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    ],
  },
  {
    slug: 'boardwalk',
    title: 'Boardwalk',
    categories: [
      'Category',
      'Category',
    ],
    comingSoon: true,
    description: 'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    ],
  },
  {
    slug: 'blind-slight',
    title: 'Blind Slight',
    categories: [
      'Category',
      'Category',
    ],
    comingSoon: true,
    description: 'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    ],
  },
  {
    slug: 'game-five',
    title: 'Game Name',
    categories: [
      'Category',
      'Category',
    ],
    comingSoon: true,
    description: 'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    ],
  },
  {
    slug: 'game-six',
    title: 'Game Name',
    categories: [
      'Category',
      'Category',
    ],
    comingSoon: true,
    description: 'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    ],
  },
]

/**
 * Look up a crowdfunding game by slug. Used by `CrowdfundingGamePage`.
 * Returns `undefined` if no entry matches.
 */
export function getCrowdfundingGameBySlug(slug) {
  return crowdfundingGames.find((game) => game.slug === slug)
}
