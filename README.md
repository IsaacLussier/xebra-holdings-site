# Xebra Holdings LLC — Website

Three pages for the Xebra Consulting site (the GoHighLevel-based AI
automation agency operating under Xebra Holdings LLC).

## Files

| File | Purpose |
|---|---|
| `index.html` | Home page (served at `/`) |
| `privacy-policy.html` | Privacy Policy — **required** for A2P 10DLC registration |
| `terms.html` | Terms & Conditions — **required** for A2P 10DLC registration |

Each file is a **self-contained HTML fragment**: one `<div>` with a scoped
`<style>` block. No build step, no framework, no npm — plain HTML/CSS only.
(They started as fragments to paste into a GoHighLevel Custom Code element;
they now double as a standalone static site — see Deployment below.)

## Deployment

The repo is deployed to **Cloudflare** (Workers static assets) and
auto-deploys on every push to `main`. Cloudflare runs `npx wrangler deploy`,
and [`wrangler.toml`](wrangler.toml) tells it the repo root is the site.
[`.assetsignore`](.assetsignore) keeps non-site files (`CLAUDE.md`, this
README, `serve.ps1`, config) from being served publicly.

Custom domain: `xebraholdings.com`.

To ship a change: edit the HTML, commit, and `git push`. That's the whole
loop.

## Page slugs / URLs

Cloudflare's default asset handling serves:

- `index.html` → `/`
- `privacy-policy.html` → `/privacy-policy`
- `terms.html` → `/terms`

The nav and footer links point at those clean paths. If you change a
filename, update the `href`s in all three files to match.

## Local preview

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open <http://localhost:8934/>. The server resolves clean URLs, so the
nav links behave exactly as they will once deployed.

## Design system

- **Palette:** near-black `#0B0B0D`, off-white `#F7F5F0`, neon purple accent
  `#A742FF` (used sparingly — CTAs, links, small ticks).
- **Type:** Space Grotesk (display) + Inter (body), via Google Fonts.
- **Signature element:** 45° diagonal black/off-white stripe divider — a
  non-literal nod to "Xebra."

## Do not break these

- `privacy-policy.html` contains a **carrier-required A2P paragraph** verbatim
  (in the purple callout under "How We Share Information").
- `terms.html` contains the **required SMS disclosures** (message frequency,
  message/data rates, STOP, HELP, consent not a condition of purchase, carrier
  liability) in the callout under "SMS Program Terms."

Both must survive any redesign. See `CLAUDE.md` for full project context.

## Contact shown on the site

Email only: `isaac@xebraholdings.com`. The phone number is deliberately **not**
published — it's an internal GHL number for outbound automated SMS and cold
calls and cannot receive inbound calls.

> Note: the site is a standalone frontend on Cloudflare. GoHighLevel still runs
> the phone number, calendar, workflows, and A2P registration separately — none
> of that depends on where this website is hosted.
