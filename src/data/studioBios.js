/**
 * Single source of truth for the studio's personal bios, rendered as
 * collector's cards on `/studio-bios` (see `StudioBiosPage`). The same
 * records feed three different card frames — Pokémon, Magic: The
 * Gathering, and Yu-Gi-Oh! — so the data is deliberately richer than any
 * one frame needs; each frame reads the fields it cares about.
 *
 * Why data-driven instead of flat images: even if a person eventually
 * ships a single pre-rendered card PNG, keeping the structured record
 * lets us restyle every card at once, keep typography consistent, and
 * swap frames. The `cardImage` field is the escape hatch — when set,
 * a card component renders that image in place of the generated layout.
 *
 * These are intentionally PLACEHOLDERS — invented names, roles, and
 * bios so the page can be built and reviewed before real bios land.
 * Mirrors the placeholder approach in `src/data/crowdfundingGames.js`.
 *
 * Record shape (all optional unless noted):
 *   slug       — REQUIRED. React key + stable id.
 *   name       — REQUIRED. Person's display name (card title).
 *   role       — REQUIRED. Studio role (subtitle / type line).
 *   bio        — REQUIRED. Personal bio; shown as the card's flavor text.
 *   type       — one of the keys in `CARD_TYPES` below. Drives color
 *                theming and the per-frame type/attribute/color labels.
 *   monogram   — 1–2 letters shown in the art window placeholder.
 *   avatar     — optional `/assets/...` portrait for the art window.
 *                Falls back to the themed monogram block when absent.
 *   cardImage  — optional `/assets/...` fully pre-rendered card image.
 *                When set, cards render it instead of the generated frame.
 *   specialties— { name, text }[]. A couple of fun facts / strengths,
 *                surfaced as Pokémon attacks, Magic abilities, and the
 *                Yu-Gi-Oh! effect text.
 *   pokemon    — { hp, weakness, resistance, retreat }.
 *   magic      — { cost, rarity, power, toughness }. `cost` is a short
 *                mana string like '2UU' shown top-right.
 *   yugioh     — { level, attribute, monsterType, atk, def }.
 *
 * `type` semantics are studio-flavored (Vision, Systems, Craft, …), each
 * mapped once in `CARD_TYPES` to a base color plus the label each TCG
 * uses, so the records stay short and the mapping stays in one place.
 */

// Studio "types" — one per broad discipline. Each carries the accent
// color used across all three frames plus the per-frame label.
export const CARD_TYPES = {
  vision: {
    accent: '#e8b23a',
    pokemonType: 'Lightning',
    magicColor: 'Gold',
    yugiohAttribute: 'LIGHT',
  },
  systems: {
    accent: '#4c8bf5',
    pokemonType: 'Water',
    magicColor: 'Blue',
    yugiohAttribute: 'WATER',
  },
  craft: {
    accent: '#e5533c',
    pokemonType: 'Fire',
    magicColor: 'Red',
    yugiohAttribute: 'FIRE',
  },
  growth: {
    accent: '#4caf72',
    pokemonType: 'Grass',
    magicColor: 'Green',
    yugiohAttribute: 'EARTH',
  },
  sound: {
    accent: '#9b6cd8',
    pokemonType: 'Psychic',
    magicColor: 'Black',
    yugiohAttribute: 'DARK',
  },
  ops: {
    accent: '#6b7787',
    pokemonType: 'Metal',
    magicColor: 'White',
    yugiohAttribute: 'WIND',
  },
}

export const studioBios = [
  {
    slug: 'ada-nakamura',
    name: 'Ada Nakamura',
    role: 'Founder & Creative Director',
    type: 'vision',
    monogram: 'AN',
    bio: 'Started the studio out of a two-bedroom apartment with a whiteboard and too much coffee. Sets the north star for every project and still sketches level ideas on napkins.',
    specialties: [
      { name: 'North Star', text: 'Turns a vague vibe into a shippable pitch overnight.' },
      { name: 'Napkin Design', text: 'Any flat surface becomes a design document.' },
    ],
    pokemon: { hp: 120, weakness: 'Deadlines', resistance: 'Doubt', retreat: 2 },
    magic: { cost: '3WW', rarity: 'Mythic', power: 5, toughness: 5 },
    yugioh: { level: 8, monsterType: 'Visionary / Effect', atk: 2800, def: 2400 },
  },
  {
    slug: 'marcus-obi',
    name: 'Marcus Obi',
    role: 'Lead Engineer',
    type: 'systems',
    monogram: 'MO',
    bio: 'Keeps the whole thing running. Believes every bug has a story and every crash has a lesson. Has never met a build pipeline he could not shave three minutes off.',
    specialties: [
      { name: 'Hotfix', text: 'Ships a fix before the bug report finishes loading.' },
      { name: 'Refactor', text: 'Deletes more lines than he writes and the game runs faster.' },
    ],
    pokemon: { hp: 100, weakness: 'Legacy Code', resistance: 'Merge Conflicts', retreat: 1 },
    magic: { cost: '2UU', rarity: 'Rare', power: 3, toughness: 6 },
    yugioh: { level: 7, monsterType: 'Machine / Effect', atk: 2100, def: 2600 },
  },
  {
    slug: 'priya-rao',
    name: 'Priya Rao',
    role: 'Art Director',
    type: 'craft',
    monogram: 'PR',
    bio: 'Owns the look of everything. Fills sketchbooks faster than the shelf can hold them and can tell you why a single pixel feels wrong from across the room.',
    specialties: [
      { name: 'Style Pass', text: 'One review turns programmer-art into a mood board come to life.' },
      { name: 'Color Sense', text: 'Sees the off-hue nobody else can and fixes it in one nudge.' },
    ],
    pokemon: { hp: 90, weakness: 'Blank Canvas', resistance: 'Client Feedback', retreat: 1 },
    magic: { cost: '1RR', rarity: 'Mythic', power: 4, toughness: 3 },
    yugioh: { level: 7, monsterType: 'Artist / Effect', atk: 2400, def: 1800 },
  },
  {
    slug: 'lena-fischer',
    name: 'Lena Fischer',
    role: 'Game Designer',
    type: 'growth',
    monogram: 'LF',
    bio: 'Lives in spreadsheets and playtests. Can balance an economy in her sleep and will happily argue about jump arcs for an hour — then prove her point with a prototype.',
    specialties: [
      { name: 'Balance Pass', text: 'Every number nudged until the whole system just clicks.' },
      { name: 'Fast Prototype', text: 'A rough playable by lunch to settle any design debate.' },
    ],
    pokemon: { hp: 95, weakness: 'Scope Creep', resistance: 'Analysis Paralysis', retreat: 2 },
    magic: { cost: '2GG', rarity: 'Rare', power: 3, toughness: 4 },
    yugioh: { level: 6, monsterType: 'Strategist / Effect', atk: 2000, def: 2200 },
  },
  {
    slug: 'theo-marlowe',
    name: 'Theo Marlowe',
    role: 'Audio Director',
    type: 'sound',
    monogram: 'TM',
    bio: 'Makes the world feel alive. Records everything from thunderstorms to cereal boxes and turns it into a soundtrack you hum for weeks. Owns an alarming number of microphones.',
    specialties: [
      { name: 'Foley Magic', text: 'Turns kitchen junk into the perfect in-game sound.' },
      { name: 'Leitmotif', text: 'One theme you will be humming long after you quit.' },
    ],
    pokemon: { hp: 85, weakness: 'Silence', resistance: 'Feedback Loops', retreat: 1 },
    magic: { cost: '1BB', rarity: 'Rare', power: 2, toughness: 4 },
    yugioh: { level: 6, monsterType: 'Composer / Effect', atk: 1900, def: 2000 },
  },
  {
    slug: 'sam-delacroix',
    name: 'Sam Delacroix',
    role: 'Community & Operations',
    type: 'ops',
    monogram: 'SD',
    bio: 'The glue. Runs the Discord, the schedule, and the snack budget with equal care. If the studio feels calm on a launch day, it is because Sam absorbed the chaos first.',
    specialties: [
      { name: 'Firewall', text: 'Absorbs launch-day chaos so the team never feels it.' },
      { name: 'Rally', text: 'A three-line post that gets the whole community showing up.' },
    ],
    pokemon: { hp: 110, weakness: 'Burnout', resistance: 'Bad Reviews', retreat: 3 },
    magic: { cost: '2WW', rarity: 'Rare', power: 2, toughness: 6 },
    yugioh: { level: 7, monsterType: 'Guardian / Effect', atk: 1800, def: 2800 },
  },
]

export function getStudioBioBySlug(slug) {
  return studioBios.find((person) => person.slug === slug) || null
}

// Convenience: resolve a person's theme block from their `type` key,
// falling back to a neutral theme if a record uses an unknown type.
export function getCardTheme(person) {
  return CARD_TYPES[person?.type] || CARD_TYPES.ops
}
