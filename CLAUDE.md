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

A minimal 3-page version (home, privacy policy, terms) already exists in
this folder — `home.html`, `privacy-policy.html`, `terms.html` — built
fast to unblock A2P submission. **These are placeholders, not final.** The
copy and structure are solid; the visual design is intentionally basic and
is what we're reworking now.

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

Location: this project folder, `home.html`, `privacy-policy.html`,
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
- Logo: plain "Xebra" wordmark + small "Consulting" tag — no slash or
  glyph (Isaac rejected the slash). "Xebra Holdings LLC" stays in the
  footer copyright and legal-page body text (registered entity name).
- Contact on the pages: email only, isaac@xebraholdings.com (the only
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

These pages are **not** deployed via a normal git-based host (Vercel,
Netlify, etc.) — they get pasted manually into GoHighLevel's Custom Code /
HTML elements inside a GHL Website (not a GHL Funnel — Funnels are for
single-purpose conversion pages, Websites support normal multi-page
navigation, which is what Privacy Policy/Terms/Home need).

Implication: no build step, no framework, no npm dependencies for these
three files specifically — plain HTML/CSS/vanilla JS only, since that's
what pastes cleanly into GHL's editor. If Isaac wants a build pipeline
(React, etc.) for a *future*, fully independent site hosted outside GHL,
that's a separate, bigger decision — don't assume it here unless he says
so.

## Working style / next steps

- Isaac wants to rework the branding starting now. Treat the existing
  copy (business description, service list, contact info) as correct and
  final unless he says otherwise — focus the rework on visual design:
  palette, type, layout, the signature element, overall polish.
- Give one strong, opinionated design direction rather than multiple
  options to choose from, unless he asks for alternatives.
- After any redesign, confirm the two compliance paragraphs above are
  still intact before considering a page "done."
