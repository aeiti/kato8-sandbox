/**
 * Per-route SEO meta tags for the sandbox. Wraps react-helmet-async and
 * injects title, description, canonical URL, OpenGraph tags, and Twitter
 * card meta into the document head at runtime.
 *
 * Crawlers without JS (Discord, Slack, X) get the same tags from the
 * prerendered HTML written by scripts/prerender.mjs; this component
 * keeps the tags accurate during client-side navigation after hydration.
 *
 * Mirrors external-site/src/components/Seo.jsx so the two feel the same
 * when moving between repos.
 */
import { Helmet } from 'react-helmet-async'
import { SITE, canonicalUrl, ogImageFor } from '../data/seo-config'

function absoluteUrl(p) {
  if (!p) return null
  if (/^https?:\/\//.test(p)) return p
  return `${SITE.url}${p.startsWith('/') ? p : `/${p}`}`
}

export default function Seo({
  path,
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  noindex,
}) {
  const url = canonicalUrl(path)
  // A captured screenshot (or explicit ogImage) is a 1200×630 large card;
  // the square default logo only works as a small `summary` card.
  const largeImage = ogImage || ogImageFor(path)
  const image = absoluteUrl(largeImage || SITE.defaultImage)
  const twitterCard = largeImage ? SITE.twitterCard : 'summary'
  const finalOgTitle = ogTitle || title
  const finalOgDescription = ogDescription || description

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}

      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      {image && <meta property="og:image" content={image} />}
      {largeImage && !ogImage && <meta property="og:image:width" content={String(SITE.ogImageWidth)} />}
      {largeImage && !ogImage && <meta property="og:image:height" content={String(SITE.ogImageHeight)} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
