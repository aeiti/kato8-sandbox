# Investor contact Worker

A Cloudflare Worker that sits between the investor / publisher contact form
(`src/components/InvestorRequestForm.jsx`) and Formspree. For each submission
it checks the Cloudflare Turnstile bot test and a per-visitor rate limit,
forwards the submission to Formspree (so the studio inbox still gets it), and
emails the visitor a confirmation through Resend.

Everything here runs on free tiers: Workers (100,000 requests a day), Turnstile,
Resend (3,000 emails a month, 100 a day), and Formspree.

It isn't deployed yet. The investor page is still a sandbox prototype, and the
Worker only accepts requests from kato8studios.com (`ALLOWED_ORIGINS` in
`wrangler.toml`), so it stays unused until the page goes to prod.

## Local development

```bash
cd workers/investor-contact
npm install
cp .dev.vars.example .dev.vars   # safe test values, DRY_RUN=true
npm run dev                       # Worker on http://127.0.0.1:8787
npm test                          # unit tests, no network
```

With `DRY_RUN=true` nothing is sent: the Worker logs the Formspree payload and
the confirmation email instead. The Turnstile secret in `.dev.vars.example` is
Cloudflare's always-pass test key.

To try the real form against it, create a gitignored `.env.local` in the
sandbox root:

```
VITE_INVESTOR_ENDPOINT=http://127.0.0.1:8787
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Then run `npm run dev` in the sandbox and open the investor page. The site key
is Cloudflare's always-pass test key. Delete `.env.local` afterwards, and
before any local `npm run build`, since a build inlines its values.

## Going live

**Accounts (once):**

1. Create a free Cloudflare account.
2. Create a free Resend account, add `kato8studios.com` as a domain, and add
   the DNS records Resend shows. Wait until Resend says the domain is verified.
3. In Resend, create an API key with **sending access** only.
4. In Cloudflare, go to **Turnstile**, add a widget for `kato8studios.com`
   (plus `www.kato8studios.com`), and note its site key and secret key.

**Config:**

- `wrangler.toml`: set `REPLY_TO` to the inbox that should get replies, and
  check `FROM_ADDRESS` and `ALLOWED_ORIGINS`.
- Secrets, entered at the prompt and never committed or pasted into chat:

  ```bash
  npx wrangler login
  npx wrangler secret put TURNSTILE_SECRET
  npx wrangler secret put RESEND_API_KEY
  npx wrangler secret put FORMSPREE_ENDPOINT
  ```

**Deploy:** `npm run deploy` prints the Worker's URL
(`https://kato8-investor-contact.<account>.workers.dev`).

**Point the site at it:** in the prod site's build environment, set
`VITE_INVESTOR_ENDPOINT` to the Worker URL and `VITE_TURNSTILE_SITE_KEY` to
the Turnstile site key. Both are public values.

## Changing the confirmation email

The subject and text are `CONFIRMATION` in `src/index.js`. `npm test` checks
the copy has no em dashes. Redeploy after editing.
