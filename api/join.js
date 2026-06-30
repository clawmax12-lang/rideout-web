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
const LEADERBOARD = SITE + "/leaderboard";

// Welcome emails are functions of `share` (the recipient's personal referral link),
// so every signup gets their own link plus a button to the live leaderboard.
const htmlSv = (share) => `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#bfe2f1;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#bfe2f1;font-size:1px;line-height:1px;">Tack f&ouml;r att du hoppade p&aring; &mdash; h&auml;r &auml;r vad som h&auml;nder nu, och hur du k&ouml;r din f&ouml;rsta cykelfest gratis.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#bfe2f1;padding:42px 16px;font-family:Arial,Helvetica,'Segoe UI',sans-serif;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:524px;background:#ffffff;border:2px solid #191919;border-radius:20px;box-shadow:9px 9px 0 #191919;overflow:hidden;">
    <tr><td align="center" style="padding:32px 34px 4px;">
      <img src="https://tablehopp.app/assets/img/tablehopp-logo-email.png" width="60" height="60" alt="Tablehopp" style="display:block;border:0;outline:none;">
    </td></tr>
    <tr><td style="padding:24px 34px 8px;">
      <h1 style="margin:0 0 26px;font-size:42px;line-height:.98;font-weight:900;letter-spacing:-.02em;color:#191919;text-transform:uppercase;">Du &auml;r<br>inne!</h1>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Hej!</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Tack f&ouml;r att du hoppade p&aring; v&auml;ntelistan &mdash; p&aring; riktigt, det betyder mycket s&aring; h&auml;r tidigt.</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Jag heter <strong>William</strong> och jag bygger Tablehopp. Id&eacute;n &auml;r enkel: en cykelfest. Ni &auml;ter f&ouml;rr&auml;tt hos en granne, trampar vidare till varmr&auml;tten hos n&auml;sta och efterr&auml;tten hos en tredje &mdash; och l&ouml;ser ledtr&aring;dar p&aring; v&auml;gen. En kv&auml;ll, flera stopp, hela g&auml;nget.</p>
    </td></tr>
    <tr><td style="padding:10px 34px 0;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#9a8a1f;">Vad h&auml;nder nu</p>
      <p style="margin:0 0 26px;font-size:17px;line-height:1.6;color:#222;">Vi &ouml;ppnar stad f&ouml;r stad. Du f&aring;r ett mejl s&aring; fort din &auml;r ig&aring;ng &mdash; inget tjat, bara n&auml;r det &auml;r skarpt.</p>
    </td></tr>
    <tr><td style="padding:0 34px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf6fc;border:2px solid #191919;border-radius:16px;box-shadow:5px 5px 0 #191919;">
        <tr><td style="padding:22px 22px 24px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#191919;">Dra med g&auml;nget</p>
          <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#222;">Ju fler v&auml;nner du v&auml;rvar, desto h&ouml;gre klättrar du p&aring; topplistan &mdash; och den som toppar k&ouml;r sin <strong>f&ouml;rsta cykelfest helt gratis</strong>. Det h&auml;r &auml;r din personliga l&auml;nk, dela den:</p>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.5;word-break:break-all;background:#ffffff;border:2px solid #191919;border-radius:10px;padding:12px 14px;color:#191919;font-weight:700;">${share}</p>
          <a href="${LEADERBOARD}" style="display:inline-block;background:#efdf5c;color:#191919;border:2px solid #191919;border-radius:12px;box-shadow:4px 4px 0 #191919;padding:13px 22px;font-size:16px;font-weight:800;text-decoration:none;">Se topplistan&nbsp;&nbsp;→</a>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:26px 34px 34px;">
      <p style="margin:0;font-size:17px;line-height:1.6;color:#222;">Vi ses p&aring; sadeln.<br><strong>// William</strong>, grundare</p>
    </td></tr>
    <tr><td style="background:#fafafa;border-top:2px solid #191919;padding:18px 34px;">
      <p style="margin:0;font-size:12px;line-height:1.5;color:#8a8a8a;">Du f&aring;r det h&auml;r mejlet f&ouml;r att du gick med i Tablehopps v&auml;ntelista. Undrar du n&aring;got? Maila <a href="mailto:hej@tablehopp.app" style="color:#191919;">hej@tablehopp.app</a>. &nbsp;·&nbsp; <a href="${UNSUB}" style="color:#8a8a8a;">Avregistrera</a></p>
    </td></tr>
  </table>
  <p style="max-width:524px;margin:16px auto 0;font-size:11px;color:#5b7f92;text-align:center;">Tablehopp · cykelfesten · tablehopp.app</p>
</td></tr></table>
</body></html>`;

const htmlEn = (share) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#bfe2f1;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#bfe2f1;font-size:1px;line-height:1px;">Thanks for hopping on &mdash; here's what happens next, and how to run your first progressive dinner for free.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#bfe2f1;padding:42px 16px;font-family:Arial,Helvetica,'Segoe UI',sans-serif;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:524px;background:#ffffff;border:2px solid #191919;border-radius:20px;box-shadow:9px 9px 0 #191919;overflow:hidden;">
    <tr><td align="center" style="padding:32px 34px 4px;">
      <img src="https://tablehopp.app/assets/img/tablehopp-logo-email.png" width="60" height="60" alt="Tablehopp" style="display:block;border:0;outline:none;">
    </td></tr>
    <tr><td style="padding:24px 34px 8px;">
      <h1 style="margin:0 0 26px;font-size:42px;line-height:.98;font-weight:900;letter-spacing:-.02em;color:#191919;text-transform:uppercase;">You're<br>in!</h1>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Hi there!</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Thanks for joining the waitlist &mdash; truly, it means a lot this early.</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">I'm <strong>William</strong>, and I'm building Tablehopp. The idea is simple: a progressive dinner on bikes. You have the starter at one neighbor's place, pedal on to the main course at the next and dessert at a third &mdash; solving clues along the way. One evening, several stops, the whole crew.</p>
    </td></tr>
    <tr><td style="padding:10px 34px 0;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#9a8a1f;">What happens next</p>
      <p style="margin:0 0 26px;font-size:17px;line-height:1.6;color:#222;">We're opening city by city. You'll get an email the moment yours goes live &mdash; no spam, only when it's for real.</p>
    </td></tr>
    <tr><td style="padding:0 34px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf6fc;border:2px solid #191919;border-radius:16px;box-shadow:5px 5px 0 #191919;">
        <tr><td style="padding:22px 22px 24px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#191919;">Bring the crew</p>
          <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#222;">The more friends you refer, the higher you climb the leaderboard &mdash; and whoever tops it runs their <strong>first progressive dinner completely free</strong>. This is your personal link, share it:</p>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.5;word-break:break-all;background:#ffffff;border:2px solid #191919;border-radius:10px;padding:12px 14px;color:#191919;font-weight:700;">${share}</p>
          <a href="${LEADERBOARD}" style="display:inline-block;background:#efdf5c;color:#191919;border:2px solid #191919;border-radius:12px;box-shadow:4px 4px 0 #191919;padding:13px 22px;font-size:16px;font-weight:800;text-decoration:none;">See the leaderboard&nbsp;&nbsp;→</a>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:26px 34px 34px;">
      <p style="margin:0;font-size:17px;line-height:1.6;color:#222;">See you in the saddle.<br><strong>// William</strong>, founder</p>
    </td></tr>
    <tr><td style="background:#fafafa;border-top:2px solid #191919;padding:18px 34px;">
      <p style="margin:0;font-size:12px;line-height:1.5;color:#8a8a8a;">You're getting this email because you joined Tablehopp's waitlist. Got a question? Email <a href="mailto:hej@tablehopp.app" style="color:#191919;">hej@tablehopp.app</a>. &nbsp;·&nbsp; <a href="${UNSUB_EN}" style="color:#8a8a8a;">Unsubscribe</a></p>
    </td></tr>
  </table>
  <p style="max-width:524px;margin:16px auto 0;font-size:11px;color:#5b7f92;text-align:center;">Tablehopp · the progressive dinner · tablehopp.app</p>
</td></tr></table>
</body></html>`;

const textSv = (share) => "Hej!\n\nTack för att du hoppade på väntelistan — på riktigt, det betyder mycket så här tidigt.\n\nJag heter William och jag bygger Tablehopp. Idén är enkel: en cykelfest. Ni äter förrätt hos en granne, trampar vidare till varmrätten hos nästa och efterrätten hos en tredje — och löser ledtrådar på vägen. En kväll, flera stopp, hela gänget.\n\nVAD HÄNDER NU\nVi öppnar stad för stad. Du får ett mejl så fort din är igång — inget tjat, bara när det är skarpt.\n\nDRA MED GÄNGET\nJu fler vänner du värvar, desto högre klättrar du på topplistan. Den som toppar kör sin första cykelfest helt gratis.\nDin personliga länk: " + share + "\nSe topplistan: " + LEADERBOARD + "\n\nVi ses på sadeln.\n// William, grundare\n\n—\nDu får det här mejlet för att du gick med i Tablehopps väntelista. Undrar du något? hej@tablehopp.app. Vill du avsluta? Svara med 'avsluta'.";

const textEn = (share) => "Hi there!\n\nThanks for joining the waitlist — truly, it means a lot this early.\n\nI'm William, and I'm building Tablehopp. The idea is simple: a progressive dinner on bikes. You have the starter at one neighbor's place, pedal on to the main course at the next and dessert at a third — solving clues along the way. One evening, several stops, the whole crew.\n\nWHAT HAPPENS NEXT\nWe're opening city by city. You'll get an email the moment yours goes live — no spam, only when it's for real.\n\nBRING THE CREW\nThe more friends you refer, the higher you climb the leaderboard. Whoever tops it runs their first progressive dinner completely free.\nYour personal link: " + share + "\nSee the leaderboard: " + LEADERBOARD + "\n\nSee you in the saddle.\n// William, founder\n\n—\nYou're getting this email because you joined Tablehopp's waitlist. Got a question? hej@tablehopp.app. Want out? Reply with 'unsubscribe'.";

// build the welcome email for a language + personal share link
function content(lang, share) {
  if (lang === "en") return { subject: SUBJECT_EN, html: htmlEn(share), text: textEn(share), unsub: UNSUB_EN };
  return { subject: SUBJECT, html: htmlSv(share), text: textSv(share), unsub: UNSUB };
}

function genCode() {
  return (Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 8)).slice(0, 12);
}
function shareUrl(code) { return code ? (SITE + "/?ref=" + encodeURIComponent(code)) : SITE; }

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
  // first name (shown on the public leaderboard); trimmed + length-capped
  const name = String((data && data.name) || "").replace(/\s+/g, " ").trim().slice(0, 40);
  // referral: this signup's own code, and the code that referred them (if any)
  const refCode = genCode();
  const referredBy = (data && typeof data.ref === "string" && data.ref.trim()) ? data.ref.trim().slice(0, 40) : null;

  // 1) save to Supabase (anon insert; RLS is insert-only). Try the richest row first
  //    and fall back to simpler shapes if a column hasn't been added yet, so a
  //    missing column can never block a signup. `stored` tracks whether ref_code
  //    actually landed (so we only hand out a personal link that will attribute).
  const rows = [
    { email: email, source: "hero", lang: lang, name: name, ref_code: refCode, referred_by: referredBy },
    { email: email, source: "hero", lang: lang, name: name },
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
  let dup = false, done = false, stored = false;
  try {
    for (let i = 0; i < rows.length; i++) {
      const ins = await insertRow(rows[i]);
      if (ins.status === 201) { done = true; stored = (i === 0); break; }
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
      const c = content(lang, shareUrl(stored ? refCode : null));
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

  res.status(200).json({ ok: true, dup: dup, lang: lang, ref: stored ? refCode : null });
};
