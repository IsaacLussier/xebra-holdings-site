# Xebra Holdings LLC — Website

Three pages for the Xebra Consulting site (the GoHighLevel-based AI
automation agency operating under Xebra Holdings LLC).

## Files

| File | Purpose |
|---|---|
| `home.html` | Home page |
| `privacy-policy.html` | Privacy Policy — **required** for A2P 10DLC registration |
| `terms.html` | Terms & Conditions — **required** for A2P 10DLC registration |

Each file is a **self-contained HTML fragment**: one `<div>` with a scoped
`<style>` block. They are pasted directly into a GoHighLevel Custom Code /
HTML element on a GHL **Website** page (not a Funnel). No build step, no
framework, no npm — plain HTML/CSS only, because that's what pastes cleanly
into the GHL editor.

## Page slugs

The nav and footer links in every file expect these slugs in GHL:

- Home → `/`
- Privacy Policy → `/privacy-policy`
- Terms → `/terms`

If GHL assigns different slugs, update the `href`s in all three files.

## Local preview

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open <http://localhost:8934/>. The server resolves clean URLs, so the
nav links work exactly as they will in GHL.

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
