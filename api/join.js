// Vercel serverless function: waitlist signup -> Supabase + welcome email (Resend).
// The Supabase URL + anon key are public (RLS is insert-only). The only secret is
// RESEND_API_KEY, provided as a Vercel Environment Variable (never committed).
const SUPABASE_URL = "https://sjesxyievpxkcmsunjfp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXN4eWlldnB4a2Ntc3VuamZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzgyODQsImV4cCI6MjA5Nzg1NDI4NH0.tEedczjLIWZgXl0RMOjT8c-3z8V6HAH1_9rioD3zPPw";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM = "Tablehopp <hej@tablehopp.app>";
const REPLY_TO = "hej@tablehopp.app";
const SUBJECT = "Du är med på väntelistan 🚴";

const WELCOME_HTML = `<!doctype html><html lang="sv"><body style="margin:0;padding:0;background:#eaf3f7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf3f7;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.06);">
  <tr><td style="height:6px;background:#efdf5c;font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr><td style="padding:28px 32px 0;"><div style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#191919;">Tablehopp</div></td></tr>
  <tr><td style="padding:10px 32px 0;">
    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#191919;font-weight:800;">Du &auml;r med p&aring; v&auml;ntelistan &#128692;</h1>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#333;">Hej!</p>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#333;">Tack f&ouml;r att du gick med i <strong>Tablehopp</strong> &ndash; kul att ha dig med fr&aring;n start! &#127881;</p>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#333;">Tablehopp &auml;r cykelfesten: en progressiv middag p&aring; cykel. Ni &auml;ter f&ouml;rr&auml;tt hos en granne, varmr&auml;tt hos n&auml;sta och efterr&auml;tt hos en tredje &ndash; och l&ouml;ser ledtr&aring;dar mellan r&auml;tterna.</p>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#333;">Vi h&ouml;r av oss s&aring; fort vi &ouml;ppnar portarna. H&aring;ll utkik i inkorgen.</p>
    <p style="margin:0 0 26px;font-size:16px;line-height:1.55;color:#333;">Tills dess &ndash; trampa p&aring;! &#128692;</p>
  </td></tr>
  <tr><td style="padding:0 32px 30px;"><div style="border-top:1px solid #eee;padding-top:16px;"><p style="margin:0;font-size:13px;line-height:1.5;color:#8a8a8a;">Du f&aring;r det h&auml;r mejlet f&ouml;r att du gick med i Tablehopps v&auml;ntelista. Fr&aring;gor? Svara p&aring; mejlet eller maila <a href="mailto:hej@tablehopp.app" style="color:#191919;">hej@tablehopp.app</a>.</p></div></td></tr>
</table>
</td></tr></table>
</body></html>`;

const WELCOME_TEXT = "Hej!\n\nTack för att du gick med i Tablehopp – kul att ha dig med från start!\n\nTablehopp är cykelfesten: en progressiv middag på cykel. Ni äter förrätt hos en granne, varmrätt hos nästa och efterrätt hos en tredje – och löser ledtrådar mellan rätterna.\n\nVi hör av oss så fort vi öppnar portarna. Håll utkik i inkorgen.\n\nTills dess – trampa på! 🚴\n\n— Tablehopp · hej@tablehopp.app";

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
          body: JSON.stringify({ from: FROM, to: [email], reply_to: REPLY_TO, subject: SUBJECT, html: WELCOME_HTML, text: WELCOME_TEXT }),
        });
      } catch (e) { /* never fail the signup if the email hiccups */ }
    }
  }

  res.status(200).json({ ok: true, dup: dup });
};
