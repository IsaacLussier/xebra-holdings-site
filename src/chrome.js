// Shared site "chrome" — the header/nav and the contact + booking modal system.
// -----------------------------------------------------------------------------
// Single source of truth. Every page (index.html, privacy-policy.html,
// terms.html, 404.html) contains an empty slot:
//   <div id="xh-header-slot"></div>
//   <div id="xh-modals-slot"></div>
// src/worker.js runs every HTML response through HTMLRewriter and fills
// those slots with the strings below, so every page gets the identical
// header and working Book a Consultation / Contact Us modals without any
// page having to carry its own copy — the exact duplication that let the
// header drift out of sync between pages before this existed.
//
// To change the header or modals, edit here only. Page-specific CSS (each
// page's own <style> block already defines matching .xh header / .nav /
// .nav-cta / .x-logo rules, copied identically to every page from the
// original template) is left alone; it still styles whatever markup lands
// in the header slot. The sticky "Book a Consultation" bar is intentionally
// NOT part of this shared chrome — it stays index.html-only, since a sticky
// booking CTA following visitors down the Privacy Policy / Terms pages
// would read as pushy on legal content. Its script hook
// (getElementById('xhStickyCta')) safely no-ops on pages that don't have it.
// -----------------------------------------------------------------------------

export const HEADER_HTML = `
<header>
  <div class="nav wrap">
    <div class="x-logo">Xebra<span class="sub">Holdings LLC</span></div>
    <nav class="nav-links">
      <a href="/">Home</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms">Terms</a>
      <a class="nav-cta js-open-booking" href="#book" role="button">Book a Consultation</a>
    </nav>
  </div>
</header>`;

export const MODALS_HTML = `
<style>
/* ---------- contact modal ---------- */
.xh-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
  background: rgba(11,11,13,.62);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0B0B0D;
  line-height: 1.55;
}
.xh-modal.is-open { display: flex; }
.xh-modal * { box-sizing: border-box; }
.xh-modal .xh-dialog {
  position: relative;
  width: 100%;
  max-width: 460px;
  background: #F7F5F0;
  border-radius: 6px;
  box-shadow: 0 24px 60px rgba(0,0,0,.45);
  overflow: hidden;
  animation: xh-pop .18s ease;
}
@keyframes xh-pop {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.xh-modal .xh-dialog-top {
  background: #0B0B0D;
  color: #F7F5F0;
  padding: 26px 28px 22px;
}
.xh-modal .xh-dialog-top .kick {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #C98BFF;
  margin-bottom: 12px;
}
.xh-modal .xh-dialog-top .kick::before {
  content: "";
  width: 14px;
  height: 2px;
  background: #A742FF;
}
.xh-modal .xh-dialog-top h3 {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-size: 21px;
  margin: 0 0 6px;
}
.xh-modal .xh-dialog-top p {
  margin: 0;
  font-size: 14px;
  color: rgba(247,245,240,.7);
}
.xh-modal .xh-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 4px;
  background: rgba(247,245,240,.12);
  color: #F7F5F0;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background .15s ease;
}
.xh-modal .xh-close:hover { background: rgba(247,245,240,.24); }
.xh-modal form { padding: 24px 28px 28px; }
.xh-modal .xh-field { margin-bottom: 16px; }
.xh-modal label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}
.xh-modal label .req { color: #A742FF; }
.xh-modal input,
.xh-modal select {
  width: 100%;
  padding: 11px 12px;
  font-family: inherit;
  font-size: 14.5px;
  color: #0B0B0D;
  background: #fff;
  border: 1px solid rgba(11,11,13,.18);
  border-radius: 4px;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.xh-modal input:focus,
.xh-modal select:focus {
  outline: none;
  border-color: #A742FF;
  box-shadow: 0 0 0 3px rgba(167,66,255,.16);
}
.xh-modal .xh-consent {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin: 18px 0 20px;
  padding: 14px;
  background: rgba(11,11,13,.04);
  border: 1px solid rgba(11,11,13,.10);
  border-radius: 4px;
}
.xh-modal .xh-consent input {
  width: 18px;
  height: 18px;
  min-width: 18px;
  margin-top: 2px;
  accent-color: #A742FF;
}
.xh-modal .xh-consent label {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: #43434a;
  margin: 0;
}
.xh-modal .xh-submit {
  width: 100%;
  border: none;
  cursor: pointer;
  background: #A742FF;
  color: #0B0B0D;
  font-family: inherit;
  font-weight: 600;
  font-size: 15px;
  padding: 14px 26px;
  border-radius: 3px;
  box-shadow: 0 0 24px rgba(167,66,255,.3);
  transition: transform .15s ease, box-shadow .15s ease;
}
.xh-modal .xh-submit:hover { transform: translateY(-1px); box-shadow: 0 0 34px rgba(167,66,255,.4); }
.xh-modal .xh-fineprint {
  margin: 14px 0 0;
  font-size: 11.5px;
  color: #6E6E74;
  text-align: center;
}
.xh-modal .xh-fineprint a { color: #6E6E74; text-decoration: underline; }
.xh-modal .xh-field.has-error input,
.xh-modal .xh-field.has-error select {
  border-color: #d1435b;
  box-shadow: 0 0 0 3px rgba(209,67,91,.14);
}
.xh-modal .xh-err {
  display: none;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #d1435b;
}
.xh-modal .xh-field.has-error .xh-err { display: block; }
.xh-modal .xh-consent.has-error {
  border-color: #d1435b;
  background: rgba(209,67,91,.06);
}
.xh-modal .xh-consent { flex-wrap: wrap; }
.xh-modal .xh-consent .xh-err { flex-basis: 100%; margin-top: 8px; }
.xh-modal .xh-consent.has-error .xh-err { display: block; }
/* honeypot — off-screen, never shown to real users */
.xh-modal .xh-hp {
  position: absolute !important;
  left: -9999px;
  width: 1px; height: 1px;
  opacity: 0;
  pointer-events: none;
}
/* form-level status message */
.xh-modal .xh-status {
  display: none;
  margin: 0 0 14px;
  padding: 11px 13px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}
.xh-modal .xh-status.is-error {
  display: block;
  color: #8a1f30;
  background: rgba(209,67,91,.10);
  border: 1px solid rgba(209,67,91,.3);
}
.xh-modal .xh-submit:disabled { opacity: .6; cursor: default; }
/* success screen (hidden until send succeeds) */
.xh-modal .xh-success { display: none; padding: 44px 28px 34px; text-align: center; }
.xh-modal .xh-dialog.is-sent .xh-dialog-top,
.xh-modal .xh-dialog.is-sent form { display: none; }
.xh-modal .xh-dialog.is-sent .xh-success { display: block; }
.xh-modal .xh-success-check {
  width: 54px; height: 54px;
  margin: 0 auto 18px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: #A742FF;
  color: #0B0B0D;
  font-size: 26px;
  font-weight: 700;
}
.xh-modal .xh-success h3 {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 600; font-size: 21px;
  margin: 0 0 10px;
}
.xh-modal .xh-success p {
  font-size: 14.5px; color: #43434a;
  max-width: 340px; margin: 0 auto 26px;
}

/* ---------- booking modal ---------- */
.xh-modal .xh-dialog-lg { max-width: 640px; }
.xh-modal .xh-booking-embed { padding: 20px 28px 0; }
.xh-modal .xh-booking-embed iframe { min-height: 650px; }
.xh-modal .xh-booking-fallback {
  padding: 18px 28px 28px;
  margin: 0;
}
.xh-modal .xh-booking-fallback a {
  color: #7a2fd6;
  font-weight: 600;
  text-decoration: underline;
}
</style>

<!-- ---------- contact modal ---------- -->
<div class="xh-modal" id="xhContactModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="xhContactTitle">
  <div class="xh-dialog">
    <button type="button" class="xh-close js-close-contact" aria-label="Close">&times;</button>
    <div class="xh-dialog-top">
      <span class="kick">Get Started</span>
      <h3 id="xhContactTitle">Tell us about your shop</h3>
      <p>A couple of quick details and we'll reach out to see if it's a fit.</p>
    </div>

    <!--
      SUBMISSION: this form POSTs (JSON) to /api/contact, handled by the
      Cloudflare Worker at src/worker.js -> src/contact.js, which validates
      server-side, filters spam, and forwards the lead into GoHighLevel via
      an Inbound Webhook. The GHL webhook URL lives in a Cloudflare secret,
      never here.
    -->
    <form id="xhContactForm" novalidate>
      <!-- honeypot: hidden from humans, bots fill it and get silently dropped -->
      <input type="text" name="company_website" id="xhHp" class="xh-hp" tabindex="-1"
             autocomplete="off" aria-hidden="true">
      <div class="xh-field">
        <label for="xhName">Your name <span class="req">*</span></label>
        <input type="text" id="xhName" name="name" autocomplete="name" maxlength="60"
               aria-describedby="xhNameErr" required>
        <span class="xh-err" id="xhNameErr">Please enter your name.</span>
      </div>
      <div class="xh-field">
        <label for="xhBusiness">Business name <span class="req">*</span></label>
        <input type="text" id="xhBusiness" name="business" autocomplete="organization" maxlength="80"
               aria-describedby="xhBusinessErr" required>
        <span class="xh-err" id="xhBusinessErr">Please enter your business name.</span>
      </div>
      <div class="xh-field">
        <label for="xhIndustry">Industry / field <span class="req">*</span></label>
        <select id="xhIndustry" name="industry" aria-describedby="xhIndustryErr" required>
          <option value="" disabled selected>Select one…</option>
          <option>HVAC</option>
          <option>Plumbing</option>
          <option>Electrical</option>
          <option>Roofing</option>
          <option>Tree Service</option>
          <option>Other home service</option>
        </select>
        <span class="xh-err" id="xhIndustryErr">Please choose an industry.</span>
      </div>
      <div class="xh-field">
        <label for="xhPhone">Mobile phone <span class="req">*</span></label>
        <input type="tel" id="xhPhone" name="phone" autocomplete="tel" inputmode="numeric"
               placeholder="(269) 555-0134" maxlength="14" aria-describedby="xhPhoneErr" required>
        <span class="xh-err" id="xhPhoneErr">Enter a 10-digit US phone number.</span>
      </div>
      <div class="xh-field">
        <label for="xhEmail">Email</label>
        <input type="email" id="xhEmail" name="email" autocomplete="email" maxlength="120"
               inputmode="email" aria-describedby="xhEmailErr">
        <span class="xh-err" id="xhEmailErr">Please enter a valid email address.</span>
      </div>

      <div class="xh-consent">
        <input type="checkbox" id="xhConsent" name="consent" aria-describedby="xhConsentErr" required>
        <label for="xhConsent">
          I agree to receive automated and recurring text messages (appointment reminders,
          follow-ups, and review requests) from Xebra Holdings at the number provided.
          Consent is not a condition of purchase. Message frequency varies. Message &amp;
          data rates may apply. Reply STOP to opt out or HELP for help.
        </label>
        <span class="xh-err" id="xhConsentErr">You must agree before we can text you.</span>
      </div>

      <div class="xh-status" id="xhStatus" role="alert" aria-live="polite"></div>

      <button type="submit" class="xh-submit" id="xhSubmit">Send message</button>
      <p class="xh-fineprint">
        By submitting you agree to our
        <a href="/privacy-policy">Privacy Policy</a> and
        <a href="/terms">Terms</a>.
      </p>
    </form>

    <div class="xh-success" id="xhSuccess">
      <div class="xh-success-check" aria-hidden="true">&#10003;</div>
      <h3>Thanks &mdash; we got it.</h3>
      <p>We'll reach out shortly at the number you provided to see if it's a fit. Talk soon.</p>
      <button type="button" class="xh-submit js-close-contact">Close</button>
    </div>
  </div>
</div>

<!-- ---------- booking modal ---------- -->
<div class="xh-modal" id="xhBookingModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="xhBookingTitle">
  <div class="xh-dialog xh-dialog-lg">
    <button type="button" class="xh-close js-close-booking" aria-label="Close">&times;</button>
    <div class="xh-dialog-top">
      <span class="kick">Book a Consultation</span>
      <h3 id="xhBookingTitle">Grab a time that works</h3>
      <p>Pick a slot on our calendar — no back-and-forth needed.</p>
    </div>

    <!--
      GHL calendar embed — dedicated "website booking" calendar (a duplicate
      of the original Free Consultation calendar), kept separate from the
      calendar used by the missed-call-text-back automation so the two lead
      sources can be told apart. See Settings > Calendars > Meetings >
      [website booking calendar] > Share calendar > Embed code.

      Outstanding: on the GHL "Booking - Website Consultation" workflow,
      add an "In calendar" filter scoped to this specific calendar so it
      only tags bookings that came through this embed, not the
      missed-call-text-back calendar.
    -->
    <div class="xh-booking-embed">
      <iframe src="https://api.leadconnectorhq.com/widget/booking/8SCQeNrbqxJAz1xiGUe8"
              allow="payment" style="width: 100%; border: none; overflow: hidden;"
              scrolling="no" id="8SCQeNrbqxJAz1xiGUe8_1785791606218"></iframe>
    </div>

    <p class="xh-fineprint xh-booking-fallback">
      Not ready to book?
      <a href="#contact" class="js-swap-to-contact" role="button">Send us a message instead</a>
    </p>
  </div>
</div>
<script src="https://link.msgsndr.com/js/form_embed.js"></script>

<script>
(function () {
  var modal = document.getElementById('xhContactModal');
  if (!modal || modal.dataset.xhInit) return;   // guard against double-injection
  modal.dataset.xhInit = '1';

  var form = document.getElementById('xhContactForm');
  var dialog = modal.querySelector('.xh-dialog');
  var statusEl = document.getElementById('xhStatus');
  var lastFocus = null;

  function resetForm() {
    form.reset();
    ['xhName', 'xhBusiness', 'xhIndustry', 'xhPhone', 'xhEmail', 'xhConsent']
      .forEach(function (id) { clearError(id); });
    statusEl.className = 'xh-status';
    statusEl.textContent = '';
    dialog.classList.remove('is-sent');
  }

  function openModal(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    if (dialog.classList.contains('is-sent')) resetForm();   // fresh start after a prior send
    statusEl.className = 'xh-status';
    statusEl.textContent = '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = document.getElementById('xhName');
    if (first) first.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ---- booking modal ----
  var bookingModal = document.getElementById('xhBookingModal');
  var bookingLastFocus = null;

  function openBookingModal(e) {
    if (e) e.preventDefault();
    bookingLastFocus = document.activeElement;
    bookingModal.classList.add('is-open');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = bookingModal.querySelector('.js-close-booking');
    if (closeBtn) closeBtn.focus();
  }

  function closeBookingModal() {
    bookingModal.classList.remove('is-open');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (bookingLastFocus && bookingLastFocus.focus) bookingLastFocus.focus();
  }

  // open/close triggers for both modals (event delegation, works regardless of DOM load order)
  document.addEventListener('click', function (e) {
    var t = e.target;
    var openContact = t.closest ? t.closest('.js-open-contact') : null;
    if (openContact) { closeBookingModal(); openModal(e); return; }

    var openBooking = t.closest ? t.closest('.js-open-booking') : null;
    if (openBooking) { openBookingModal(e); return; }

    var swapToContact = t.closest ? t.closest('.js-swap-to-contact') : null;
    if (swapToContact) { e.preventDefault(); closeBookingModal(); openModal(); return; }

    var closeContact = t.closest ? t.closest('.js-close-contact') : null;
    if (closeContact) { closeModal(); return; }

    var closeBooking = t.closest ? t.closest('.js-close-booking') : null;
    if (closeBooking) { closeBookingModal(); return; }

    if (t === modal) { closeModal(); return; }        // contact backdrop click
    if (t === bookingModal) { closeBookingModal(); }   // booking backdrop click
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('is-open')) closeModal();
    if (bookingModal.classList.contains('is-open')) closeBookingModal();
  });

  // ---- sticky CTA: reveal after ~400px of scroll (index.html only — this
  // element doesn't exist on other pages, and getElementById returns null
  // there, so this whole block safely no-ops) ----
  var stickyCta = document.getElementById('xhStickyCta');
  if (stickyCta) {
    var onScroll = function () {
      stickyCta.classList.toggle('is-visible', window.scrollY > 400);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- phone: digits only, auto-format to (XXX) XXX-XXXX ----
  var phoneEl = document.getElementById('xhPhone');
  function formatPhone(digits) {
    digits = digits.replace(/\\D/g, '').slice(0, 10);
    var len = digits.length;
    if (len === 0) return '';
    if (len < 4) return '(' + digits;
    if (len < 7) return '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
    return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
  }
  phoneEl.addEventListener('input', function () {
    var caretAtEnd = this.selectionStart === this.value.length;
    this.value = formatPhone(this.value);
    if (caretAtEnd) { var p = this.value.length; this.setSelectionRange(p, p); }
    clearError('xhPhone');
  });
  // block obviously-wrong keystrokes (still allow nav/edit keys)
  phoneEl.addEventListener('keypress', function (e) {
    if (e.key && e.key.length === 1 && /\\D/.test(e.key)) e.preventDefault();
  });

  // ---- validation helpers ----
  var emailRe = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  function fieldWrap(el) { return el.closest('.xh-field') || el.closest('.xh-consent'); }
  function setError(id) {
    var el = document.getElementById(id), w = fieldWrap(el);
    if (w) w.classList.add('has-error');
  }
  function clearError(id) {
    var el = document.getElementById(id), w = fieldWrap(el);
    if (w) w.classList.remove('has-error');
  }
  // clear a field's error as soon as the user fixes it
  ['xhName', 'xhBusiness', 'xhIndustry', 'xhEmail', 'xhConsent'].forEach(function (id) {
    var el = document.getElementById(id);
    var evt = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
    el.addEventListener(evt, function () { clearError(id); });
  });

  function validate() {
    var ok = true, firstBad = null;
    function fail(id) { setError(id); if (!firstBad) firstBad = document.getElementById(id); ok = false; }

    if (document.getElementById('xhName').value.trim().length < 2) fail('xhName');
    if (document.getElementById('xhBusiness').value.trim().length < 2) fail('xhBusiness');
    if (!document.getElementById('xhIndustry').value) fail('xhIndustry');
    if (phoneEl.value.replace(/\\D/g, '').length !== 10) fail('xhPhone');

    var email = document.getElementById('xhEmail').value.trim();
    if (email && !emailRe.test(email)) fail('xhEmail');   // optional, but must be valid if given

    if (!document.getElementById('xhConsent').checked) fail('xhConsent');

    if (firstBad && firstBad.focus) firstBad.focus();
    return ok;
  }

  var submitBtn = document.getElementById('xhSubmit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var v = function (id) { return (document.getElementById(id).value || '').trim(); };
    var payload = {
      name: v('xhName'),
      business: v('xhBusiness'),
      industry: v('xhIndustry'),
      phone: v('xhPhone'),
      email: v('xhEmail'),
      consent: document.getElementById('xhConsent').checked,
      company_website: (document.getElementById('xhHp') || {}).value || ''  // honeypot
    };

    statusEl.className = 'xh-status';
    statusEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { ok: res.ok, data: data };
      });
    })
    .then(function (r) {
      if (r.ok && r.data.ok) {
        dialog.classList.add('is-sent');       // show the success screen
        return;
      }
      // surface any per-field errors the server flagged
      if (r.data.errors) {
        Object.keys(r.data.errors).forEach(function (k) {
          setError('xh' + k.charAt(0).toUpperCase() + k.slice(1));
        });
      }
      statusEl.className = 'xh-status is-error';
      statusEl.textContent = r.data.error ||
        'Something went wrong. Please try again, or email isaac@xebraholdings.com.';
    })
    .catch(function () {
      statusEl.className = 'xh-status is-error';
      statusEl.textContent =
        "Couldn't reach the server. Please email isaac@xebraholdings.com directly.";
    })
    .then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    });
  });
})();
</script>`;
