# Xebra Holdings LLC — Website Project

## Business context

**Xebra Holdings LLC** is a registered single-member LLC (Michigan, filed
7/9/2026) owned by Isaac, based in Kalamazoo/Battle Creek, Michigan. It's
designed as an umbrella holding company for multiple future ventures, but
the only active business right now is a **GoHighLevel (GHL)-based AI
automation agency** serving home service contractors — HVAC, plumbing,
electrical, roofing, tree service — in the Kalamazoo/Battle Creek area.

**Target client:** 3–15 employee shops, single decision-maker, no existing
field service platform (ServiceTitan/Jobber/Housecall Pro are
disqualifiers), roughly 50–300 Google reviews as a size proxy.

**Core offer:** SMS-based automation — missed-call-to-text with calendar
booking, lead follow-up sequences, and review request automation. Runs on
GHL. Voice AI is a future upsell, not part of the base offer.

**Brand hook:** "Xebra" (zebra) is intentionally the umbrella/holding
company name — vague on purpose so industry-specific DBAs can sit under it
later. The zebra metaphor (sustainable business, resilience, herd/stripe
motifs) is a soft brand conversation-starter but should not be leaned on
too hard or made cartoonish — this is a B2B service business, not a
consumer brand.

**Long-term structure:** Xebra Holdings LLC is the parent entity. This
website currently represents the agency (the only live venture). When a
second venture launches, this site may need an "our ventures" layer added,
or the new venture may get its own domain/DBA — that's a future decision,
not something to solve now.

## Why this site exists right now

The immediate, practical trigger for this site is **A2P 10DLC campaign
registration** (the carrier-required process for sending business SMS in
the US). GHL's manual/standard campaign registration flow requires:
- A live, publicly accessible website (no "under construction" pages)
- A **Privacy Policy** page at a stable URL
- A **Terms & Conditions** page at a stable URL
- Content that matches the submitted "use case description" (transactional
  SMS related to missed-call follow-up and lead follow-up, not marketing)

A 3-page version (home, privacy policy, terms) lives in this folder —
`index.html`, `privacy-policy.html`, `terms.html`. The July 2026 branding
rework (near-black / off-white / neon purple, diagonal stripe motif) is
done; copy and structure are solid.

## What we're doing now: branding rework

Isaac wants to improve the branding/design of these pages beyond the
minimum-viable version. Some notes on his preferences to keep in mind:

- **Design/aesthetic work is not his favorite** — he's technical
  (IT/networking/cybersecurity background, comfortable with Python/ML),
  prefers implementation over open-ended creative direction. Give him
  strong opinionated defaults rather than lots of open questions.
- **Prefers deliverables first, rationale second (or not at all).** Show
  the result, don't lead with a long explanation.
- **Wants direct, opinionated recommendations**, not hedged options.
- This is a **B2B service business targeting contractors** — the design
  should read as credible, professional, and trustworthy to a
  50-year-old HVAC business owner, not trendy/startup-y. Avoid anything
  that feels like a SaaS landing page template.

## Current state of the 3 files

Location: this project folder, `index.html` (home), `privacy-policy.html`,
`terms.html`.

- Self-contained HTML fragments (not full documents) — each is a `<div>`
  with a scoped `<style>` block, designed to be pasted directly into a
  GoHighLevel Custom Code / HTML element on a page.
- Current palette (July 2026 rework): near-black (#0B0B0D), off-white
  (#F7F5F0), neon purple accent (#A742FF) — purple used sparingly (CTA
  buttons, hero highlight, small kicker ticks), per Isaac's feedback.
- Current type: Space Grotesk (display), Inter (body), loaded via Google
  Fonts link at the top of each fragment.
- Signature element: a striped divider (45° diagonal black/off-white
  bars) used as a section break — a subtle, non-literal nod to "Xebra."
  No purple borders on it (Isaac: too much purple).
- Logo: "Xebra" wordmark + small "Holdings LLC" tag — no slash or glyph
  (Isaac rejected the slash). Header reads "Xebra Holdings LLC" (the
  registered entity name); the "Consulting" wordmark was reverted 7/2026.
- Contact on the pages: email only, hello@xebraholdings.com (the only
  live inbox — hello@ does not exist). The phone (269) 394-4135 is
  deliberately NOT published: it's an internal GHL number for outbound
  automated SMS/cold calls and can't receive inbound calls yet. Don't
  re-add it without asking Isaac.

## Legally/compliance-required content — do not remove or water down

The Privacy Policy page **must** retain this exact paragraph somewhere
(carrier-required language for A2P compliance):

> No mobile information will be shared with third parties/affiliates for
> marketing/promotional purposes. Information sharing to subcontractors in
> support services, such as customer service, is permitted. All other use
> case categories exclude text messaging originator opt-in data and
> consent; this information will not be shared with any third parties.

The Terms page **must** retain SMS program disclosures: message
frequency varies, message/data rates may apply, STOP to opt out, HELP for
help, consent not a condition of purchase, carrier liability disclaimer.

Redesigning these pages visually is fine and encouraged. Rewriting or
cutting this specific compliance language is not — flag it to Isaac
explicitly if a redesign would require changing this wording.

## Deployment target

**This site is deployed via Cloudflare (Workers static assets), not GHL.**
The repo lives on GitHub (`IsaacLussier/xebra-holdings-site`, private) and
auto-deploys on every push to `main`.

- Cloudflare runs `npx wrangler deploy`. `wrangler.toml` at the repo root
  configures the assets directory (`[assets] directory = "."`) AND a Worker
  script (`main = "src/worker.js"`) — see below. Without `wrangler.toml` the
  build fails with "Could not detect a directory containing static files."
- `.assetsignore` keeps non-site files (`CLAUDE.md`, `README.md`,
  `serve.ps1`, `src/`, config) from being uploaded as public assets. **If
  you add any sensitive file to the repo root, add it to `.assetsignore`
  too** — otherwise it becomes publicly fetchable at xebraholdings.com/<file>.
- Home page is `index.html` (Cloudflare serves it at `/`). Clean URLs
  `/privacy-policy` and `/terms` come from the default asset html-handling.
- Custom domain `xebraholdings.com` is attached in the Cloudflare dashboard.
- Still no build step / framework / npm for the site's HTML/CSS itself —
  plain HTML/CSS/vanilla JS.

### Contact form backend (`src/worker.js`, `src/contact.js`)

The home page's "Contact Us" modal POSTs to `/api/contact`. That route is
handled by a small Worker script — **not** Cloudflare Pages Functions (this
project deploys as a Worker via `wrangler deploy`, not Pages, so the
`functions/` directory convention does not apply here and must not be used).

- `wrangler.toml` sets `main = "src/worker.js"` and `[assets] binding =
  "ASSETS"`. `src/worker.js` routes `POST /api/contact` to the handler in
  `src/contact.js`; everything else falls through to `env.ASSETS.fetch()`,
  which serves the static site exactly as before.
- `src/contact.js` validates the submission server-side (name, business,
  industry, 10-digit phone, optional email, required consent checkbox),
  filters a honeypot field, then forwards the lead into **GoHighLevel**
  (the CRM / single source of truth — not Resend or any other email
  service) via an Inbound Webhook, tagged `website-contact-form`, with a
  full A2P consent record (consent text, timestamp, IP, user-agent).
- Required Cloudflare secret: `GHL_WEBHOOK_URL` (Cloudflare dashboard →
  this Worker → Settings → Variables and Secrets → add as a **Secret**,
  never committed to the repo). Until it's set, the form fails gracefully
  and tells the visitor to email hello@xebraholdings.com directly.

**GHL is unaffected.** The phone number, calendar, workflows
(missed-call-to-text, lead follow-up), and A2P 10DLC registration all run on
GHL's side and don't depend on where the website is hosted. A2P's Website /
Privacy Policy / Terms URL fields should point to the Cloudflare domain.

To ship a change: edit the HTML, commit, `git push`. Do NOT re-add the
phone number to the site (see contact note above).

## Working style / next steps

- Isaac wants to rework the branding starting now. Treat the existing
  copy (business description, service list, contact info) as correct and
  final unless he says otherwise — focus the rework on visual design:
  palette, type, layout, the signature element, overall polish.
- Give one strong, opinionated design direction rather than multiple
  options to choose from, unless he asks for alternatives.
- After any redesign, confirm the two compliance paragraphs above are
  still intact before considering a page "done."
