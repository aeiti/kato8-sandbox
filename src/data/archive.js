/**
 * Retired sandbox pages, listed on `/archive`. When a design is replaced,
 * its page moves here instead of being deleted, so there's still a record
 * of what it looked like. Archived pages live under `/archive/<slug>` and
 * are frozen: they keep their own copy of copy and styles, so later edits
 * to the live page don't change them.
 *
 * Entry shape: { path, title, archived, replacedBy, description }
 *   archived:   date it was retired (YYYY-MM-DD)
 *   replacedBy: the route that replaced it, or null
 * Newest first.
 */
export const archived = [
  {
    path: '/archive/investors-v1',
    title: 'Investors page — original',
    archived: '2026-10-28',
    replacedBy: '/investors',
    description:
      'The first investor / publisher page: a plain hero, three highlight cards, and the contact form, on the default page background. Replaced by the color design (cobalt hero band, games strip).',
  },
]
