// Vercel serverless function: waitlist signup -> Supabase + welcome email (Resend).
// The Supabase URL + anon key are public (RLS is insert-only). The only secret is
// RESEND_API_KEY, provided as a Vercel Environment Variable (never committed).
const SUPABASE_URL = "https://sjesxyievpxkcmsunjfp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXN4eWlldnB4a2Ntc3VuamZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzgyODQsImV4cCI6MjA5Nzg1NDI4NH0.tEedczjLIWZgXl0RMOjT8c-3z8V6HAH1_9rioD3zPPw";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM = "Tablehopp <hej@tablehopp.app>";
const REPLY_TO = "hej@tablehopp.app";
const SUBJECT = "You're in.";
const UNSUB = "mailto:hej@tablehopp.app?subject=unsubscribe";

const WELCOME_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#bfe2f1;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#bfe2f1;font-size:1px;line-height:1px;">Thanks for hopping on — here's what happens next, and how to get your first dinner party free.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#bfe2f1;padding:42px 16px;font-family:Arial,Helvetica,'Segoe UI',sans-serif;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:524px;background:#ffffff;border:2px solid #191919;border-radius:20px;box-shadow:9px 9px 0 #191919;overflow:hidden;">
    <tr><td align="center" style="padding:32px 34px 4px;">
      <img src="https://tablehopp.app/assets/img/tablehopp-logo-email.png" width="60" height="60" alt="Tablehopp" style="display:block;border:0;outline:none;">
    </td></tr>
    <tr><td style="padding:24px 34px 8px;">
      <h1 style="margin:0 0 26px;font-size:42px;line-height:.98;font-weight:900;letter-spacing:-.02em;color:#191919;text-transform:uppercase;">You're<br>in.</h1>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Hey!</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">Thanks for hopping on the waitlist — seriously, it means a lot this early.</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">I'm <strong>William</strong>, and I'm building Tablehopp. The idea's simple: a dinner party on bikes. You have the starter at one neighbour's place, ride on to the main course at the next, dessert at a third — and solve clues between stops. One night, a handful of stops, the whole crew.</p>
    </td></tr>
    <tr><td style="padding:10px 34px 0;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#9a8a1f;">What happens now</p>
      <p style="margin:0 0 26px;font-size:17px;line-height:1.6;color:#222;">We're opening city by city. You'll get an email the second yours goes live — no nagging, only when it's real.</p>
    </td></tr>
    <tr><td style="padding:0 34px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf6fc;border:2px solid #191919;border-radius:16px;box-shadow:5px 5px 0 #191919;">
        <tr><td style="padding:22px 22px 24px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#191919;">Bring your crew</p>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.55;color:#222;">The more people you bring, the higher you climb our <strong>leaderboard</strong>. Whoever tops it gets their <strong>first dinner party completely free</strong>. Start now — share the link:</p>
          <a href="https://tablehopp.app" style="display:inline-block;background:#efdf5c;color:#191919;border:2px solid #191919;border-radius:12px;box-shadow:4px 4px 0 #191919;padding:13px 22px;font-size:16px;font-weight:800;text-decoration:none;">Share tablehopp.app&nbsp;&nbsp;↗</a>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:26px 34px 34px;">
      <p style="margin:0;font-size:17px;line-height:1.6;color:#222;">See you in the saddle.<br><strong>// William</strong>, founder</p>
    </td></tr>
    <tr><td style="background:#fafafa;border-top:2px solid #191919;padding:18px 34px;">
      <p style="margin:0;font-size:12px;line-height:1.5;color:#8a8a8a;">You're getting this because you joined the Tablehopp waitlist. Questions? Email <a href="mailto:hej@tablehopp.app" style="color:#191919;">hej@tablehopp.app</a>. &nbsp;·&nbsp; <a href="${UNSUB}" style="color:#8a8a8a;">Unsubscribe</a></p>
    </td></tr>
  </table>
  <p style="max-width:524px;margin:16px auto 0;font-size:11px;color:#5b7f92;text-align:center;">Tablehopp · the dinner party on bikes · tablehopp.app</p>
</td></tr></table>
</body></html>`;

const WELCOME_TEXT = "Hey!\n\nThanks for hopping on the waitlist — seriously, it means a lot this early.\n\nI'm William, and I'm building Tablehopp. The idea's simple: a dinner party on bikes. You have the starter at one neighbour's place, ride on to the main course at the next, dessert at a third — and solve clues between stops. One night, a handful of stops, the whole crew.\n\nWHAT HAPPENS NOW\nWe're opening city by city. You'll get an email the second yours goes live — no nagging, only when it's real.\n\nBRING YOUR CREW\nThe more people you bring, the higher you climb our leaderboard. Whoever tops it gets their first dinner party completely free. Start now — share the link: https://tablehopp.app\n\nSee you in the saddle.\n// William, founder\n\n—\nYou're getting this because you joined the Tablehopp waitlist. Questions? hej@tablehopp.app. To unsubscribe, reply with 'unsubscribe'.";

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

  // 1) save to Supabase (anon insert; RLS is insert-only)
  let dup = false;
  try {
    const ins = await fetch(SUPABASE_URL + "/rest/v1/waitlist", {
      method: "POST",
      headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ email: email, source: "hero" }),
    });
    if (ins.status === 409) dup = true;
    else if (ins.status !== 201) { res.status(502).json({ error: "db_error" }); return; }
  } catch (e) { res.status(502).json({ error: "db_unreachable" }); return; }

  // 2) send the welcome email for NEW signups (skip duplicates so we don't re-spam)
  if (!dup) {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: FROM, to: [email], reply_to: REPLY_TO, subject: SUBJECT,
            html: WELCOME_HTML, text: WELCOME_TEXT,
            headers: { "List-Unsubscribe": "<" + UNSUB + ">" },
          }),
        });
      } catch (e) { /* never fail the signup if the email hiccups */ }
    }
  }

  res.status(200).json({ ok: true, dup: dup });
};
