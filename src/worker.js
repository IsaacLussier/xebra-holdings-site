// Worker entry point for this site's Cloudflare Workers-with-static-assets
// deployment (see wrangler.toml: `main = "src/worker.js"`, `[assets] binding
// = "ASSETS"`). Cloudflare runs `npx wrangler deploy`, which bundles this
// file as the Worker; the built-in `env.ASSETS.fetch()` call serves the
// static site (index.html, privacy-policy.html, terms.html, 404.html) for
// everything this Worker doesn't handle itself.
//
// The only custom route here is POST /api/contact — the contact-form
// handler. Everything else falls straight through to static asset serving,
// so this file must keep working even if the contact form logic changes.

import { handleContact } from './contact.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};
