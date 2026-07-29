// POST /api/contact handler, called from src/worker.js.
// -----------------------------------------------------------------------------
// Receives a contact-form submission from index.html, re-validates it
// server-side (never trust the browser — a bot can POST here directly and skip
// the page's JavaScript entirely), filters spam via a honeypot, then forwards
// the lead into GoHighLevel (our CRM / single source of truth) by POSTing to a
// GHL Inbound Webhook. A GHL Workflow on that webhook creates/updates the
// contact, applies the "website-contact-form" tag, and notifies Isaac.
//
// Keeping this Worker in the middle (instead of POSTing to GHL from the
// browser) hides the webhook URL from the public page and blocks spam before
// it ever reaches the CRM.
//
// REQUIRED environment variable (Cloudflare dashboard → this Worker →
// Settings → Variables and Secrets → add as a SECRET, never committed here):
//   GHL_WEBHOOK_URL   the Inbound Webhook URL from your GHL workflow trigger
// -----------------------------------------------------------------------------

const INDUSTRIES = ['HVAC', 'Plumbing', 'Electrical', 'Roofing', 'Tree Service', 'Other home service'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The tag applied to every lead that comes through the website contact form.
const LEAD_TAG = 'website-contact-form';

const CONSENT_TEXT =
  'I agree to receive automated and recurring text messages (appointment ' +
  'reminders, follow-ups, and review requests) from Xebra Holdings at the ' +
  'number provided. Consent is not a condition of purchase. Message frequency ' +
  'varies. Message & data rates may apply. Reply STOP to opt out or HELP for help.';

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function handleContact(request, env) {
  // ---- parse body (accept JSON or form-encoded) ----
  let data;
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.indexOf('application/json') !== -1) {
      data = await request.json();
    } else {
      const fd = await request.formData();
      data = Object.fromEntries(fd.entries());
    }
  } catch (e) {
    return json({ ok: false, error: 'Could not read the submission.' }, 400);
  }

  // ---- honeypot: real users never fill this. Pretend success, drop silently. ----
  if (data.company_website) {
    return json({ ok: true });
  }

  // ---- normalize + validate ----
  const name = String(data.name || '').trim();
  const business = String(data.business || '').trim();
  const industry = String(data.industry || '').trim();
  let digits = String(data.phone || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1); // drop US country code
  const email = String(data.email || '').trim();
  const consent = data.consent === true || data.consent === 'true' || data.consent === 'on';

  const errors = {};
  if (name.length < 2 || name.length > 60) errors.name = 'Please enter your name.';
  if (business.length < 2 || business.length > 80) errors.business = 'Please enter your business name.';
  if (INDUSTRIES.indexOf(industry) === -1) errors.industry = 'Please choose an industry.';
  if (digits.length !== 10) errors.phone = 'Enter a 10-digit US phone number.';
  if (email && (!EMAIL_RE.test(email) || email.length > 120)) errors.email = 'Please enter a valid email address.';
  if (!consent) errors.consent = 'Consent is required.';

  if (Object.keys(errors).length) {
    return json({ ok: false, errors: errors }, 422);
  }

  // ---- config check ----
  if (!env.GHL_WEBHOOK_URL) {
    console.log('contact: GHL_WEBHOOK_URL is not set');
    return json({ ok: false, error: 'The contact form is not fully set up yet. Please email isaac@xebraholdings.com.' }, 500);
  }

  // ---- build the payload GHL will map into a tagged contact ----
  const first = name.split(/\s+/)[0] || name;
  const last = name.split(/\s+/).slice(1).join(' ');
  const phoneE164 = '+1' + digits;
  const when = new Date().toISOString();
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';

  const payload = {
    firstName: first,
    lastName: last,
    fullName: name,
    email: email,
    phone: phoneE164,          // E.164 — the format GHL prefers
    companyName: business,
    industry: industry,
    source: 'Website Contact Form',
    tag: LEAD_TAG,             // available if you'd rather map the tag from the webhook
    // --- A2P / SMS opt-in consent record ---
    smsConsent: 'yes',
    consentText: CONSENT_TEXT,
    consentTimestamp: when,
    ip: ip,
    userAgent: ua
  };

  // ---- forward to GoHighLevel ----
  let res;
  try {
    res = await fetch(env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.log('contact: fetch to GHL threw', e && e.message);
    return json({ ok: false, error: "Couldn't submit right now. Please email isaac@xebraholdings.com." }, 502);
  }

  if (!res.ok) {
    const detail = await res.text().catch(function () { return ''; });
    console.log('contact: GHL responded', res.status, detail);
    return json({ ok: false, error: "Couldn't submit right now. Please email isaac@xebraholdings.com." }, 502);
  }

  return json({ ok: true });
}
