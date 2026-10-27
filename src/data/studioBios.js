/**
 * Single source of truth for the studio's personal bios, rendered as
 * collector's cards on `/studio-bios` (see `StudioBiosPage`). Each person
 * is dealt in their own card frame — Pokémon, Magic: The Gathering, or
 * Yu-Gi-Oh! — in their own color, and the page groups them by team.
 *
 * Why data-driven instead of flat images: even if a person eventually
 * ships a single pre-rendered card PNG, keeping the structured record
 * lets us restyle every card at once, keep typography consistent, and
 * swap frames. The `cardImage` field is the escape hatch — when set,
 * a card component renders that image in place of the generated layout.
 *
 * Source: the team's "Website_ProfilePic" sheet (Name, Style, Color, Team,
 * Title, Bio) plus the profile pictures that came with it. Every person
 * now has the designer's finished card (`cardImage`, in
 * public/assets/sandbox/cards/<slug>.png); the text fields still feed
 * captions and alt text, and the generated frames if a card is removed.
 *
 * Record shape (all optional unless noted):
 *   slug       — REQUIRED. React key + stable id.
 *   name       — REQUIRED. Person's display name (card title).
 *   team       — REQUIRED. A team `slug` from `TEAMS` below; the page
 *                renders one section per team, in `TEAMS` order.
 *   style      — REQUIRED. Card frame: 'pokemon' | 'magic' | 'yugioh'.
 *   color      — one of the keys in `CARD_COLORS` below. Drives color
 *                theming and the per-frame type/attribute/color labels.
 *   role       — Title (subtitle / type line). May be empty.
 *   bio        — Personal bio; shown as the card's flavor text. May be empty.
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
 */

// Teams, in the order the page lists them. An array (not an object) so
// the order survives the /__bios serializer, which sorts object keys.
// `slug` is what a person's `team` field holds; `label` is the heading.
export const TEAMS = [
  {
    label: 'Studio',
    slug: 'studio',
  },
  {
    label: 'USB',
    slug: 'usb',
  },
  {
    label: 'Last Light',
    slug: 'last-light',
  },
  {
    label: 'BBCU',
    slug: 'bbcu',
  },
]

// Card colors from the studio's card templates. Each carries the accent
// color used across all three frames plus the per-frame label.
export const CARD_COLORS = {
  'dark-blue': {
    accent: '#43527c',
    magicColor: 'Blue',
    pokemonType: 'Water',
    yugiohAttribute: 'WATER',
  },
  'dark-pink': {
    accent: '#df7a93',
    magicColor: 'Red',
    pokemonType: 'Psychic',
    yugiohAttribute: 'FIRE',
  },
  'light-blue': {
    accent: '#707aa5',
    magicColor: 'Blue',
    pokemonType: 'Water',
    yugiohAttribute: 'WIND',
  },
  'light-pink': {
    accent: '#f08fb2',
    magicColor: 'White',
    pokemonType: 'Fairy',
    yugiohAttribute: 'LIGHT',
  },
}

export const studioBios = [
  {
    name: 'Terry Teng',
    slug: 'terry-teng',
    role: 'Founder & CEO',
    team: 'studio',
    style: 'magic',
    color: 'dark-blue',
    monogram: 'TT',
    avatar: '/assets/sandbox/team/terry-teng.jpg',
    cardImage: '/assets/sandbox/cards/terry-teng.png',
    bio: 'With over 13 years in tech and gaming, Terry has made it his mission to change the culture and landscape of the current video game industry. Previous work experience at Google, Meta/Facebook, Riot Games, Xsolla, etc.',
    specialties: [],
  },
  {
    name: 'Ana Helena Vieira (Intern)',
    slug: 'ana-helena-vieira',
    role: 'Developer',
    team: 'usb',
    style: 'pokemon',
    color: 'light-pink',
    monogram: 'AV',
    avatar: '/assets/sandbox/team/ana-helena-vieira.jpg',
    cardImage: '/assets/sandbox/cards/ana-helena-vieira.png',
    bio: 'Someone that fixes bugs',
    specialties: [],
  },
  {
    name: 'George Wang',
    slug: 'george-wang',
    role: 'BBCU Game Dev',
    team: 'bbcu',
    style: 'magic',
    color: 'dark-blue',
    monogram: 'GW',
    avatar: '/assets/sandbox/team/george-wang.jpg',
    cardImage: '/assets/sandbox/cards/george-wang.png',
    bio: '',
    specialties: [],
  },
  {
    name: 'Sophia Jones',
    slug: 'sophia-jones',
    role: 'BBCU Game Dev',
    team: 'bbcu',
    style: 'magic',
    color: 'light-blue',
    monogram: 'SJ',
    avatar: '/assets/sandbox/team/sophia-jones.jpg',
    cardImage: '/assets/sandbox/cards/sophia-jones.png',
    bio: '',
    specialties: [],
  },
  {
    name: 'Keolani',
    slug: 'keolani',
    role: '2D Artist',
    team: 'usb',
    style: 'pokemon',
    color: 'dark-pink',
    monogram: 'K',
    avatar: '/assets/sandbox/team/keolani.jpg',
    cardImage: '/assets/sandbox/cards/keolani.png',
    bio: '2D artist and general visuals.',
    specialties: [],
  },
  {
    name: 'Pride',
    slug: 'pride',
    role: '2D and 3D Artist',
    team: 'usb',
    style: 'pokemon',
    color: 'dark-blue',
    monogram: 'P',
    avatar: '/assets/sandbox/team/pride.jpg',
    cardImage: '/assets/sandbox/cards/pride.png',
    bio: 'Long time game designer, both tabletop and digital. Loves classic games and old-school vibes.',
    specialties: [],
  },
  {
    name: 'Justin N',
    slug: 'justin-n',
    role: 'Art Lead / 3D Lead',
    team: 'bbcu',
    style: 'magic',
    color: 'dark-blue',
    monogram: 'JN',
    avatar: '/assets/sandbox/team/justin-n.jpg',
    cardImage: '/assets/sandbox/cards/justin-n.png',
    bio: '3D Artist with over 10 years of experience in the games and film industry with a focus on building fascinating and unique environments.',
    specialties: [],
  },
  {
    name: 'Hailey H',
    slug: 'hailey-h',
    role: 'Art director / Lead concept artist',
    team: 'usb',
    style: 'pokemon',
    color: 'dark-blue',
    monogram: 'HH',
    avatar: '/assets/sandbox/team/hailey-h.jpg',
    cardImage: '/assets/sandbox/cards/hailey-h.png',
    bio: '2D and general visuals.',
    specialties: [],
  },
  {
    name: 'Ian R',
    slug: 'ian-r',
    role: 'Audio Designer',
    team: 'bbcu',
    style: 'pokemon',
    color: 'dark-blue',
    monogram: 'IR',
    avatar: '/assets/sandbox/team/ian-r.jpg',
    cardImage: '/assets/sandbox/cards/ian-r.png',
    bio: 'Music and audio professional based in San Francisco, California whose compositions and arrangements for film, installation, and stage have been performed throughout the United States and Europe. As an emerging game audio professional, Ian\'s music and audio design have also been featured on several new indie projects. Ian holds a Master of Music in Technology and Applied Composition from the San Francisco Conservatory of Music and enjoys singing dumb songs to his cat.',
    specialties: [],
  },
  {
    name: 'Katie L',
    slug: 'katie-l',
    role: 'Graphic Design and UI/UX Intern',
    team: 'studio',
    style: 'pokemon',
    color: 'light-blue',
    monogram: 'KL',
    cardImage: '/assets/sandbox/cards/katie-l.png',
    bio: 'Graphic design and UI/UX intern. Social media.',
    specialties: [],
  },
  {
    name: 'Lindsay W',
    slug: 'lindsay-w',
    role: '2D Artist and Animator',
    team: 'usb',
    style: 'pokemon',
    color: 'light-blue',
    monogram: 'LW',
    avatar: '/assets/sandbox/team/lindsay-w.jpg',
    cardImage: '/assets/sandbox/cards/lindsay-w.png',
    bio: '2D animator and artist.',
    specialties: [],
  },
  {
    name: 'Rhianna',
    slug: 'rhianna',
    role: 'Game Development and Design',
    team: 'usb',
    style: 'pokemon',
    color: 'dark-pink',
    monogram: 'R',
    avatar: '/assets/sandbox/team/rhianna.jpg',
    cardImage: '/assets/sandbox/cards/rhianna.png',
    bio: 'Game development and design. General visuals.',
    specialties: [],
  },
  {
    name: 'Liz Polilli',
    slug: 'liz-polilli',
    role: '2D Artist',
    team: 'usb',
    style: 'pokemon',
    color: 'dark-pink',
    monogram: 'LP',
    cardImage: '/assets/sandbox/cards/liz-polilli.png',
    bio: '2D artist and general visuals.',
    specialties: [],
  },
  {
    name: 'Ryan Folk',
    slug: 'ryan-folk',
    role: 'Level Designer',
    team: 'usb',
    style: 'yugioh',
    color: 'dark-blue',
    monogram: 'RF',
    cardImage: '/assets/sandbox/cards/ryan-folk.png',
    bio: '[Level/Design] All Digital Assets on the field can be manipulated and placed by this card. Using this effect in the Opponent\'s Standby Phase adds 1500 ATK and DEF Points to every monster on the player\'s side of the field.',
    specialties: [],
  },
  {
    name: 'Marcus Gordon',
    slug: 'marcus-gordon',
    role: 'General Artist',
    team: 'last-light',
    style: 'pokemon',
    color: 'dark-blue',
    monogram: 'MG',
    avatar: '/assets/sandbox/team/marcus-gordon.jpg',
    cardImage: '/assets/sandbox/cards/marcus-gordon.png',
    bio: 'Graduate from the University of Southern California (USC) Computer Science Games Major; a world-leading joint program between the Viterbi School of Engineering and the School of Cinematic Arts. Over 12 years of experience in a variety of fields of game design including 3D artist, programmer, and musical composer. Achieved rare honor of supporting two Senior Capstone Game Design projects as a Freshman. Competitively selected for both USC\'s National Honors Society and the initial student group for a new joint Microsoft Games and USC Computer Science Games development program.',
    specialties: [],
  },
  {
    name: 'Matthew Pablo',
    slug: 'matthew-pablo',
    role: 'Audio Designer',
    team: 'usb',
    style: 'pokemon',
    color: 'dark-blue',
    monogram: 'MP',
    avatar: '/assets/sandbox/team/matthew-pablo.jpg',
    cardImage: '/assets/sandbox/cards/matthew-pablo.png',
    bio: 'An industry audio leader with over 14 years of experience in games, music, and entertainment, Matthew has led audio alongside legendary game designer Warren Spector and created music and sound for Disney, Pokémon, Marvel, AMC, and collaborated with artists such as deadmau5. A Berklee College of Music graduate, his work spans audio direction, sound design, composition, technical audio, music supervision, and music production.',
    specialties: [],
  },
  {
    name: 'Desiree Ott (Intern)',
    slug: 'desiree-ott',
    role: 'Game Design Intern',
    team: 'studio',
    style: 'magic',
    color: 'light-blue',
    monogram: 'DO',
    avatar: '/assets/sandbox/team/desiree-ott.jpg',
    cardImage: '/assets/sandbox/cards/desiree-ott.png',
    bio: 'Game Design student, former competitive esports player, and current Game Design Intern.\n\nRemove three Iteration counters: Untap all Designers you control. They gain “The players will figure it out” until end of turn.',
    specialties: [],
  },
  {
    name: 'Ashlee W',
    slug: 'ashlee-w',
    role: 'Graphic Design Intern',
    team: 'studio',
    style: 'magic',
    color: 'dark-pink',
    monogram: 'AW',
    cardImage: '/assets/sandbox/cards/ashlee-w.png',
    bio: 'Graphic design intern from Houston, Texas. Undergrad student at UHCL.',
    specialties: [],
  },
  {
    name: 'Ryan Kenfield',
    slug: 'ryan-kenfield',
    role: 'Game Designer',
    team: 'last-light',
    style: 'magic',
    color: 'dark-blue',
    monogram: 'RK',
    cardImage: '/assets/sandbox/cards/ryan-kenfield.png',
    bio: 'Technical Designer with 5+ years in game development. Ryan has worked with companies like Disney Imagineering and Formula 1 creating games and interactives for their parks. Has created shows for Adult Swim Smalls and is always working on his own animated sitcom. Fun fact Ryan also is a Cannes award winning actor.',
    specialties: [],
  },
  {
    name: 'Kit Hannay',
    slug: 'kit-hannay',
    role: '2D Artist',
    team: 'last-light',
    style: 'pokemon',
    color: 'light-pink',
    monogram: 'KH',
    cardImage: '/assets/sandbox/cards/kit-hannay.png',
    bio: 'Kit is a comic artist, illustrator, and solo game developer from upstate NY. When she\'s not doodling, she can be found in a dark corner curled up with a book.',
    specialties: [],
  },
]

export function getStudioBioBySlug(slug) {
  return studioBios.find((person) => person.slug === slug) || null
}

// Convenience: resolve a person's theme block from their `color` key,
// falling back to dark blue if a record uses an unknown color.
export function getCardTheme(person) {
  return CARD_COLORS[person?.color] || CARD_COLORS['dark-blue']
}

// A team's display label from its slug (falls back to the raw slug).
export function getTeamLabel(slug) {
  return TEAMS.find((team) => team.slug === slug)?.label || slug
}

// People grouped into `TEAMS` order: [{ slug, label, people }], skipping
// teams with nobody in them. Unknown team slugs are dropped.
export function getStudioBiosByTeam(people = studioBios) {
  return TEAMS
    .map((team) => ({ ...team, people: people.filter((p) => p.team === team.slug) }))
    .filter((group) => group.people.length)
}
