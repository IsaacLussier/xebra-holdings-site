// Worker entry point for this site's Cloudflare Workers-with-static-assets
// deployment (see wrangler.toml: `main = "src/worker.js"`, `[assets] binding
// = "ASSETS"`). Cloudflare runs `npx wrangler deploy`, which bundles this
// file as the Worker; the built-in `env.ASSETS.fetch()` call serves the
// static site (index.html, privacy-policy.html, terms.html, 404.html) for
// everything this Worker doesn't handle itself.
//
// Two custom behaviors here:
//   1. POST /api/contact — the contact-form handler.
//   2. Every HTML response gets run through HTMLRewriter to fill in the
//      shared header/modal "chrome" (see src/chrome.js) — this is what
//      keeps the header and Book a Consultation / Contact Us modals
//      identical across every page from one source, instead of each page
//      carrying its own copy that can drift out of sync (which is exactly
//      what happened before this existed — privacy-policy.html and
//      terms.html kept showing a stale header after index.html changed).

import { handleContact } from './contact.js';
import { HEADER_HTML, MODALS_HTML } from './chrome.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    const response = await env.ASSETS.fetch(request);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return response;
    }

    return new HTMLRewriter()
      .on('#xh-header-slot', {
        element(el) { el.setInnerContent(HEADER_HTML, { html: true }); }
      })
      .on('#xh-modals-slot', {
        element(el) { el.setInnerContent(MODALS_HTML, { html: true }); }
      })
      .transform(response);
  }
};
