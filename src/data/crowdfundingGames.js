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
 *                 falls back to a plain placeholder block when absent. Write
 *                 `/assets/...` paths and pipe them through `asset()` if/when
 *                 real art is added (see `src/data/games.js` for the pattern).
 */

const LOREM_BODY = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
]

export const crowdfundingGames = [
  {
    slug: 'game-one',
    title: 'Game Name',
    categories: ['Category', 'Category'],
    comingSoon: true,
    description:
      'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: LOREM_BODY,
  },
  {
    slug: 'game-two',
    title: 'Game Name',
    categories: ['Category', 'Category'],
    comingSoon: true,
    description:
      'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: LOREM_BODY,
  },
  {
    slug: 'game-three',
    title: 'Game Name',
    categories: ['Category', 'Category'],
    comingSoon: true,
    description:
      'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: LOREM_BODY,
  },
  {
    slug: 'game-four',
    title: 'Game Name',
    categories: ['Category', 'Category'],
    comingSoon: true,
    description:
      'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: LOREM_BODY,
  },
  {
    slug: 'game-five',
    title: 'Game Name',
    categories: ['Category', 'Category'],
    comingSoon: true,
    description:
      'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: LOREM_BODY,
  },
  {
    slug: 'game-six',
    title: 'Game Name',
    categories: ['Category', 'Category'],
    comingSoon: true,
    description:
      'Short game description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    body: LOREM_BODY,
  },
]

/**
 * Look up a crowdfunding game by slug. Used by `CrowdfundingGamePage`.
 * Returns `undefined` if no entry matches.
 */
export function getCrowdfundingGameBySlug(slug) {
  return crowdfundingGames.find((game) => game.slug === slug)
}
