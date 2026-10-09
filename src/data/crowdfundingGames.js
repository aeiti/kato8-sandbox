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
 *   itchUrl     — absolute http(s) URL of the game's itch.io page (optional).
 *                 Renders a "Play on itch.io" button on the detail page.
 *   Image paths are stored base-less (`/assets/sandbox/foo.png`); the card
 *   and detail page pipe them through `asset()` so they resolve on Pages.
 */

export const crowdfundingGames = [
  {
    slug: 'dead-hour',
    title: 'Dead Hour',
    categories: [
      'Survival Horror',
      'Roguelite',
    ],
    comingSoon: true,
    image: '/assets/sandbox/deadhour-01-horde.png',
    coverImage: {
      src: '/assets/sandbox/deadhour-cover-630x500.png',
      alt: 'Dead Hour',
    },
    itchUrl: 'https://terrytkato8.itch.io/dead-hour',
    description: 'Twelve nights. Twenty survivors. One helicopter. A top-down zombie roguelite where your guns fire themselves and your only job is to stay alive until extraction.',
    body: [
      'Your weapons fire on their own. Everything else is on you: where to move, what to upgrade, and how to hold out until the helicopter touches down. Each of the twelve nights brings a different mission. Survive the evac window, defend a repaired bus, escort survivors, scavenge supplies, or bring relays online while the horde closes in.',
      'Light is a resource. Your flashlight battery drains as you go, and the dead behave differently in the dark. Take too many bites and the infection wins, turning you into one of them. Put up barricades, turrets, and floodlights to buy yourself time.',
      'Choose from 20 survivors, each with their own weapon and ability, and evolve 24 weapons through their upgrade paths. Finished the campaign? Monster Matinee adds six B-movie-themed levels packed with nods to the films that inspired them.',
    ],
  },
  {
    slug: 'hollowbrook-apothecary',
    title: 'Hollowbrook Apothecary',
    categories: [
      'Cozy',
      'Simulation',
    ],
    comingSoon: false,
    image: '/assets/sandbox/2-garden-afternoon.png',
    coverImage: {
      src: '/assets/sandbox/cover-1.png',
      alt: 'Hollowbrook Apothecary',
    },
    itchUrl: 'https://terrytkato8.itch.io/hollowbrook-apothecary',
    description: 'Inherit your grandmother\'s cabin, her cauldron, and three recipes, then fill in the blank pages yourself. A cozy, hand-drawn potion-brewing sim about discovery, not instructions.',
    body: [
      'Your grandmother left you a cabin, a cauldron, and a recipe book with only three pages written. The rest is up to you. Combine ingredients, adjust the heat, stir, and watch what happens. Every brew is built from six essences (Ember, Tide, Root, Gale, Lumen, and Umbra), and every failure tells you something: too heavy on Ember, or it refuses to bind. Recipes you work out yourself brew better than any you can buy.',
      'Between brews, tend your ingredient beds, forage rare plants in Whisper Wood, and make the rounds of the village market, library, and deed office. Fill orders from the bulletin board, then grow the business with a glasshouse, a meadow, and the Brewworks.',
      'Ten potions across three tiers, with the top tier calling for finished potions as ingredients. Your journal remembers every combination you have tried, progressive hints and a Guided mode are there when you want them, and there are no fail states, so there is no wrong way to play.',
    ],
  },
  {
    slug: 'hotdog-hustler',
    title: 'Hotdog Hustler',
    categories: [
      'Simulation',
      'Casual',
    ],
    comingSoon: false,
    itchUrl: 'https://terrytkato8.itch.io/hotdog-hustler',
    description: 'Toast the buns, grill the dogs, and pile on exactly what each customer asked for before their patience runs out. A fast-paced hot dog cart sim on a cherry-blossom street.',
    body: [
      'Customers line up at your cart, place their orders, and start losing patience. Toast the bun before it burns, pull the sausage off the grill inside the safe window, add exactly the toppings they asked for, and hand it over before they walk off. Get a topping wrong and you lose half the order. Leave one off and you only lose what that topping is worth.',
      'Play in two modes, each with its own art style and controls. In side view you control a chef on foot, walking between the bun bag, toaster, cooler, grill, and plate, then carrying each finished dog to the pick-up ledge. Cook’s view puts you behind the cart at night under neon, where you click to start the grill, drag food onto the plate, and swipe toppings across the dog.',
      'Your earnings go back into the business. Unlock better toppings from 24 across three quality tiers to raise your prices, buy five equipment upgrades, and save toward a food truck. Every shift ends with a receipt showing your star rating, order log, mistakes, and tip. Your progress saves automatically in the browser.',
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
