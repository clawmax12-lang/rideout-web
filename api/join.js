// Vercel serverless function: waitlist signup -> Supabase + welcome email (Resend).
// The Supabase URL + anon key are public (RLS is insert-only). The only secret is
// RESEND_API_KEY, provided as a Vercel Environment Variable (never committed).
const SUPABASE_URL = "https://sjesxyievpxkcmsunjfp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXN4eWlldnB4a2Ntc3VuamZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzgyODQsImV4cCI6MjA5Nzg1NDI4NH0.tEedczjLIWZgXl0RMOjT8c-3z8V6HAH1_9rioD3zPPw";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM = "Tablehopp <hej@tablehopp.app>";
const REPLY_TO = "hej@tablehopp.app";
const SUBJECT = "Du är inne!";
const SUBJECT_EN = "You're in!";
const UNSUB = "mailto:hej@tablehopp.app?subject=avsluta";
const UNSUB_EN = "mailto:hej@tablehopp.app?subject=unsubscribe";
const SITE = "https://tablehopp.app";
const PRIVACY = SITE + "/integritet";

// Simple welcome email: warm hello + "we'll email you when your city goes live".
// No leaderboard/referral content (removed 2026-07-03 by founder decision).
const htmlSv = () => `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:'Boldonse';font-style:normal;font-weight:900;src:url(https://tablehopp.app/assets/fonts/Boldonse-latin.woff2) format('woff2')}</style></head>
<body style="margin:0;padding:0;background:#bfe2f1;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#bfe2f1;font-size:1px;line-height:1px;">Tack f&ouml;r att du hoppade p&aring; &mdash; h&auml;r &auml;r vad som h&auml;nder nu.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#bfe2f1;padding:42px 16px;font-family:Arial,Helvetica,'Segoe UI',sans-serif;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:524px;background:#ffffff;border:2px solid #191919;border-radius:20px;box-shadow:9px 9px 0 #191919;overflow:hidden;">
    <tr><td align="center" style="padding:32px 34px 4px;">
      <img src="https://tablehopp.app/assets/img/tablehopp-logo-email.png" width="60" height="60" alt="Tablehopp" style="display:block;border:0;outline:none;">
    </td></tr>
    <tr><td style="padding:24px 34px 8px;">
      <h1 style="margin:0 0 24px;font-family:'Boldonse','Arial Black','Helvetica Neue',Arial,sans-serif;font-size:32px;line-height:1.3;font-weight:900;letter-spacing:.01em;color:#191919;text-transform:uppercase;">Du &auml;r <span style="background:#EEFF2E;padding:0 .14em;">inne!</span></h1>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Hej!</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Tack f&ouml;r att du hoppade p&aring; v&auml;ntelistan &mdash; p&aring; riktigt, det betyder mycket s&aring; h&auml;r tidigt.</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Jag heter <strong>William</strong> och jag bygger Tablehopp. Id&eacute;n &auml;r enkel: en cykelfest. Ni &auml;ter f&ouml;rr&auml;tt hos en granne, trampar vidare till varmr&auml;tten hos n&auml;sta och efterr&auml;tten hos en tredje &mdash; och l&ouml;ser ledtr&aring;dar p&aring; v&auml;gen. En kv&auml;ll, flera stopp, hela g&auml;nget.</p>
    </td></tr>
    <tr><td style="padding:10px 34px 0;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#9a8a1f;">Vad h&auml;nder nu</p>
      <p style="margin:0 0 26px;font-size:17px;line-height:1.6;color:#222;">Vi lanserar p&aring; App Store inom n&aring;gra veckor. Du f&aring;r ett mejl s&aring; fort appen &auml;r ute &mdash; inget tjat, bara n&auml;r det &auml;r skarpt.</p>
    </td></tr>
    <tr><td style="padding:26px 34px 34px;">
      <p style="margin:0;font-size:17px;line-height:1.6;color:#222;">Vi ses p&aring; sadeln.<br><strong>// William</strong>, grundare</p>
    </td></tr>
    <tr><td style="background:#fafafa;border-top:2px solid #191919;padding:18px 34px;">
      <p style="margin:0;font-size:12px;line-height:1.5;color:#8a8a8a;">Du f&aring;r det h&auml;r mejlet f&ouml;r att du gick med i Tablehopps v&auml;ntelista. Undrar du n&aring;got? Maila <a href="mailto:hej@tablehopp.app" style="color:#191919;">hej@tablehopp.app</a>. &nbsp;·&nbsp; <a href="${UNSUB}" style="color:#8a8a8a;">Avregistrera</a> &nbsp;·&nbsp; <a href="${PRIVACY}" style="color:#8a8a8a;">Integritetspolicy</a></p>
    </td></tr>
  </table>
  <p style="max-width:524px;margin:16px auto 0;font-size:11px;color:#5b7f92;text-align:center;">Tablehopp · cykelfesten · tablehopp.app</p>
</td></tr></table>
</body></html>`;

const htmlEn = () => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:'Boldonse';font-style:normal;font-weight:900;src:url(https://tablehopp.app/assets/fonts/Boldonse-latin.woff2) format('woff2')}</style></head>
<body style="margin:0;padding:0;background:#bfe2f1;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#bfe2f1;font-size:1px;line-height:1px;">Thanks for hopping on &mdash; here's what happens next.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#bfe2f1;padding:42px 16px;font-family:Arial,Helvetica,'Segoe UI',sans-serif;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:524px;background:#ffffff;border:2px solid #191919;border-radius:20px;box-shadow:9px 9px 0 #191919;overflow:hidden;">
    <tr><td align="center" style="padding:32px 34px 4px;">
      <img src="https://tablehopp.app/assets/img/tablehopp-logo-email.png" width="60" height="60" alt="Tablehopp" style="display:block;border:0;outline:none;">
    </td></tr>
    <tr><td style="padding:24px 34px 8px;">
      <h1 style="margin:0 0 24px;font-family:'Boldonse','Arial Black','Helvetica Neue',Arial,sans-serif;font-size:32px;line-height:1.3;font-weight:900;letter-spacing:.01em;color:#191919;text-transform:uppercase;">You're <span style="background:#EEFF2E;padding:0 .14em;">in!</span></h1>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Hi there!</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Thanks for joining the waitlist &mdash; truly, it means a lot this early.</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">I'm <strong>William</strong>, and I'm building Tablehopp. The idea is simple: a progressive dinner on bikes. You have the starter at one neighbor's place, pedal on to the main course at the next and dessert at a third &mdash; solving clues along the way. One evening, several stops, the whole crew.</p>
    </td></tr>
    <tr><td style="padding:10px 34px 0;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#9a8a1f;">What happens next</p>
      <p style="margin:0 0 26px;font-size:17px;line-height:1.6;color:#222;">We're launching on the App Store in a few weeks. You'll get an email the moment the app is out &mdash; no spam, only when it's for real.</p>
    </td></tr>
    <tr><td style="padding:26px 34px 34px;">
      <p style="margin:0;font-size:17px;line-height:1.6;color:#222;">See you in the saddle.<br><strong>// William</strong>, founder</p>
    </td></tr>
    <tr><td style="background:#fafafa;border-top:2px solid #191919;padding:18px 34px;">
      <p style="margin:0;font-size:12px;line-height:1.5;color:#8a8a8a;">You're getting this email because you joined Tablehopp's waitlist. Got a question? Email <a href="mailto:hej@tablehopp.app" style="color:#191919;">hej@tablehopp.app</a>. &nbsp;·&nbsp; <a href="${UNSUB_EN}" style="color:#8a8a8a;">Unsubscribe</a> &nbsp;·&nbsp; <a href="${PRIVACY}" style="color:#8a8a8a;">Privacy policy</a></p>
    </td></tr>
  </table>
  <p style="max-width:524px;margin:16px auto 0;font-size:11px;color:#5b7f92;text-align:center;">Tablehopp · the progressive dinner · tablehopp.app</p>
</td></tr></table>
</body></html>`;

const textSv = () => "Hej!\n\nTack för att du hoppade på väntelistan — på riktigt, det betyder mycket så här tidigt.\n\nJag heter William och jag bygger Tablehopp. Idén är enkel: en cykelfest. Ni äter förrätt hos en granne, trampar vidare till varmrätten hos nästa och efterrätten hos en tredje — och löser ledtrådar på vägen. En kväll, flera stopp, hela gänget.\n\nVAD HÄNDER NU\nVi lanserar på App Store inom några veckor. Du får ett mejl så fort appen är ute — inget tjat, bara när det är skarpt.\n\nVi ses på sadeln.\n// William, grundare\n\n—\nDu får det här mejlet för att du gick med i Tablehopps väntelista. Undrar du något? hej@tablehopp.app. Vill du avsluta? Svara med 'avsluta'.";

const textEn = () => "Hi there!\n\nThanks for joining the waitlist — truly, it means a lot this early.\n\nI'm William, and I'm building Tablehopp. The idea is simple: a progressive dinner on bikes. You have the starter at one neighbor's place, pedal on to the main course at the next and dessert at a third — solving clues along the way. One evening, several stops, the whole crew.\n\nWHAT HAPPENS NEXT\nWe're launching on the App Store in a few weeks. You'll get an email the moment the app is out — no spam, only when it's for real.\n\nSee you in the saddle.\n// William, founder\n\n—\nYou're getting this email because you joined Tablehopp's waitlist. Got a question? hej@tablehopp.app. Want out? Reply with 'unsubscribe'.";

// build the welcome email for a language
function content(lang) {
  if (lang === "en") return { subject: SUBJECT_EN, html: htmlEn(), text: textEn(), unsub: UNSUB_EN };
  return { subject: SUBJECT, html: htmlSv(), text: textSv(), unsub: UNSUB };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

  // read body whether Vercel pre-parsed it or not
  let raw = "";
  if (req.body !== undefined && req.body !== null) {
    raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  } else {
    raw = await new Promise((resolve) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => resolve(d)); });
  }
  let data = {};
  try { data = JSON.parse(raw || "{}"); } catch (e) {}
  const email = String((data && data.email) || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) { res.status(400).json({ error: "invalid_email" }); return; }
  // visitor's site language; anything other than "en" is treated as Swedish
  const lang = (data && data.lang) === "en" ? "en" : "sv";

  // 1) save to Supabase (anon insert; RLS is insert-only). Try the richest row first
  //    and fall back to simpler shapes if a column hasn't been added yet, so a
  //    missing column can never block a signup.
  const rows = [
    { email: email, source: "hero", lang: lang },
    { email: email, source: "hero" },
  ];
  function insertRow(row) {
    return fetch(SUPABASE_URL + "/rest/v1/waitlist", {
      method: "POST",
      headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
    });
  }
  let dup = false, done = false;
  try {
    for (let i = 0; i < rows.length; i++) {
      const ins = await insertRow(rows[i]);
      if (ins.status === 201) { done = true; break; }
      if (ins.status === 409) { dup = true; done = true; break; }
      if (ins.status === 400 && i < rows.length - 1) {
        // unknown column (referral/lang not added yet) -> try a simpler row
        let body = ""; try { body = await ins.text(); } catch (e) {}
        if (/column|schema cache|PGRST/i.test(body)) continue;
        res.status(502).json({ error: "db_error" }); return;
      }
      res.status(502).json({ error: "db_error" }); return;
    }
    if (!done) { res.status(502).json({ error: "db_error" }); return; }
  } catch (e) { res.status(502).json({ error: "db_unreachable" }); return; }

  // 2) send the welcome email for NEW signups (skip duplicates so we don't re-spam)
  if (!dup) {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      const c = content(lang);
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: FROM, to: [email], reply_to: REPLY_TO, subject: c.subject,
            html: c.html, text: c.text,
            headers: { "List-Unsubscribe": "<" + c.unsub + ">" },
          }),
        });
      } catch (e) { /* never fail the signup if the email hiccups */ }
    }
  }

  res.status(200).json({ ok: true, dup: dup, lang: lang });
};
