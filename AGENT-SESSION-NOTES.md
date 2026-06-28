# Tablehopp-web — Session state & hard-won agent lessons

_Last updated: 2026-06-28. Read this FIRST before touching this repo again._

## 0. TL;DR for next time
- Static **Framer export** marketing site for **Tablehopp** (the "cykelfest" — a progressive dinner on bikes). Production deploys from **`main`** → Vercel project **`rideout-site`**, live at **https://tablehopp.app** (apex domain on Vercel; `rideout-site.vercel.app` also serves it).
- The site is now a **pre-launch waitlist**: hero email signup → **Supabase** (store) + **Resend** welcome email, wired through a **Vercel serverless function `/api/join`**.
- Customization = **injected `ro-*` `<script>`/`<style>` blocks** in `index.html` **AND edits to the Framer JS bundle** (the bundle re-renders content on hydration and reverts static-HTML edits — see Lesson 16).
- Infra names still say "rideout" (repo `rideout-web`, Vercel `rideout-site`, Supabase ref `sjesxyievpxkcmsunjfp`). Cosmetic; not renamed.
- **The sandbox cannot load external sites** (proxy blocks the headless browser; `curl` works). Verify backend via curl, and have the founder eyeball the live site. Vercel previews are auth-protected (401 to curl/headless).
- Founder values premium polish, tests edge cases hard, wants plain honesty. Don't claim "done/verified" without proof.

## 1. CURRENT production state (2026-06-28) — supersedes the older §A below
Live on **tablehopp.app**:
- **Hero waitlist** (replaced the inert "Skapa er cykelfest" CTA). Injected `ro-wl` block (CSS+JS). Boldonse subheading "GÅ MED I VÄNTELISTAN", email field with the signature hard-offset frame, submit button, social-proof row (3 real avatars + count).
- **Premium success animation**: yellow button wipes across the whole field (clip-path, expo-out) → check stamps in (spring) + one-time gloss → settles **yellow→green** → ~1.5 s later **collapses back** to a small green button (check rides to its centre) with a **"Kolla inkorgen"** note (mail glyph) where the email was. Count rolls up with easeOutExpo. Full `prefers-reduced-motion` path.
- **Real backend** (Phase 2): submit POSTs **`/api/join`** → inserts to Supabase `public.waitlist` (insert-only RLS) → sends **Resend** welcome email → returns `{ok,dup}`. Count via `get_waitlist_count` RPC (anon). `MOCK=false`.
- **Welcome email** (`api/join.js`): **Swedish** (matches the Swedish site/audience), raw founder voice — heading **"Du är inne!"** (NOT the literal "Du är in"), from William, "Vad händer nu", referral-leaderboard teaser, new blue logo (hosted PNG), List-Unsubscribe. Subject **"Du är inne!"**, from `Tablehopp <hej@tablehopp.app>`. Sends synchronously on signup (~1.8 s) → Resend `delivered` in seconds. (It was briefly English; switched to Swedish per founder.)
- **Social proof**: `COUNT_BASE = 23` baseline + real count. Below `COUNT_MIN_SHOW` (10) shows "Bli bland de första på väntelistan"; at/above shows the animated "Gå med X+ andra på väntelistan". Baseline painted at build (resilient if the count RPC fails). 3 real founder avatars: `assets/img/av1.webp|av2.webp|av3.webp`.
- **Rebrand RideOut → Tablehopp** everywhere visible: `<title>`, meta/OG/Twitter, hero badge SVG ("TABLEHOPP 2026 · ARRANGERA DIN CYKELFEST"), FAQ, footer wordmark (regenerated raster "TABLEHOPP 26"), "© 2026 Tablehopp". Also changed in the **JS bundles + searchIndex JSON** (required — see Lesson 16).
- **Domain + SEO**: tablehopp.app live (Vercel, valid config). canonical + og:url → `https://tablehopp.app/` (were wrongly the Framer template URL `eventin.framer.website`), og:image/twitter:image made absolute, `sitemap.xml` added, `robots.txt` points to it. Contact email `hej@tablehopp.app` (template leftover `Info@eventin.com` also fixed).
- **English / i18n: REMOVED (parked).** Weglot was integrated then fully removed — see Lesson 17.

## 2. Config / credentials (⚠️ NO secrets in this repo)
- **Supabase** project ref `sjesxyievpxkcmsunjfp` — account **clawmax12@gmail.com** (NOT the MCP-connected `williamsvanq` org; the MCP token only sees williamsvanq, so Supabase changes were done by the founder / via curl with keys). Table `public.waitlist` (email unique/lowercased, `source`, `created_at`), **insert-only RLS** for `anon`, `get_waitlist_count()` SECURITY DEFINER RPC.
  - **anon key**: PUBLIC — hardcoded in `index.html` + `api/join.js` (safe under insert-only RLS).
  - **service_role key**: SECRET — Supabase dashboard only, **never committed**.
- **Resend** (transactional email): domain `tablehopp.app` **verified** (DNS auto-configured via Vercel). `RESEND_API_KEY` = SECRET, set as a **Vercel Environment Variable** (Production+Preview+Dev) — **never in repo**. Env-var changes need a **redeploy** to take effect.
- **Vercel** project `rideout-site`, team `clawmax12-langs-projects`. (Vercel MCP token is 403 for this team — can't read build logs / set env vars via MCP; founder does dashboard actions.)
- **Weglot**: removed. Public key is gone from the code.
- Set up a real mailbox for `hej@tablehopp.app` (replies + unsubscribe).

## 3. Architecture additions this session
- **`/api/join.js`** — Vercel Node serverless function (CommonJS `module.exports`, global `fetch`, **no npm deps**). Reads body whether Vercel pre-parsed it or via raw stream. Inserts via anon; emails via Resend (only secret = `RESEND_API_KEY` env). `/api` works **zero-config** on this static project (no SRI/integrity on the bundle, no `builds` override in `vercel.json`). Verified the function logic locally by `require()`-ing it into a tiny http server (sandbox can't hit the deployed function — preview is 401, prod tested via curl).
- **`ro-wl`** injected block = the entire waitlist (markup built in JS, animation CSS, count, avatars). Config consts at the top of its IIFE: `MOCK`, `SUPABASE_URL`, `SUPABASE_ANON`, `AVATARS`, `COUNT_BASE`, `COUNT_MIN_SHOW`.
- **New assets**: `assets/img/av1-3.webp` (avatars, cropped+optimized from founder photos), `assets/img/tablehopp-logo.svg` (NEW blue logo: blue fill + black outline + navy hard-offset; built by restyling the existing mark path — for the site logo swap LATER), `assets/img/tablehopp-logo-email.png` (email logo), regenerated `rideout-wm-*.png` + `qNYdNE2*.png` (footer wordmark now "TABLEHOPP 26").

## 4. LESSONS — new this session (continue the list from §B)
16. **Framer renders page content from its JS BUNDLE and re-hydrates, overwriting DOM edits.** Editing static HTML text alone gets reverted to the bundle's value on hydration/scroll (we saw "RideOut" come back). The rebrand required `sed`-ing the **bundles** (`assets/scripts/script_main*.mjs`, `shared-lib*.mjs`, `8GPhkq*.mjs`) + `assets/data/searchIndex-*.json` too. Replace only exact-case brand strings (`RideOut`/`RIDEOUT`/`RIDE OUT`); leave lowercase (asset paths, ids, emails). Verify with a **full-hydration render + scroll through every section**, then scan `document.body.innerText`.
17. **Weglot — and any client-side translator — cannot reliably translate this Framer export.** Hydration reverts heavy content (hero title flashes English then snaps back to Swedish); SVG text (the spinning badge) can't be translated at all. Tried: head snippet (Weglot's own Framer guide says use "Other" tech), a re-apply-on-hydration nudge, and a fresh Weglot project with "Framer" tech — all partial / reverting. For real bilingual later: **(a) Framer-native localization → re-export → re-inject our `ro-*` blocks**, or **(b) a bespoke `/en/` page we fully control** (no Framer = no revert). English is parked; Weglot removed.
18. **The sandbox headless browser cannot reach external sites** (the agent proxy doesn't route Chromium; `curl` works via the proxy, the browser gets "site can't be reached" / 302 to auth). So you **cannot** verify the deployed site, Weglot, or live `fetch` in-sandbox. Verify: backend behavior via `curl` (insert/dup/RLS/count), CORS via a `curl -X OPTIONS` preflight, function logic by running it locally, and the live visuals via the founder. Vercel previews are auth-protected (401/302).
19. **Footer wordmark + logo are RASTER PNGs**, and there are **two copies** (`rideout-wm-*.png` from the localize tool AND the original Framer-hashed `qNYdNE2*.png`; the bundle re-inserts the `qNYdNE2` set on hydration, so editing only `rideout-wm` isn't enough). We regenerated **all 8** as an outlined Boldonse "TABLEHOPP 26" (rendered via Playwright using the live page font + `omitBackground`, then PIL-downscaled). The nav/footer mark `rideout-logo.svg` is **abstract** (name only in `aria-label`/`<title>`). New brand logo = `tablehopp-logo.svg` (site swap still pending).
20. **Direct `git push` to `main` is blocked by the auto-mode classifier** even after a bare "push" — it needs unambiguous per-action authorization ("ja, pusha direkt till main"). **Prefer the GitHub MCP PR→squash-merge flow** (it disconnected/reconnected mid-session; when down, the founder can merge via the GitHub compare URL).
21. **Reused dev branch ↔ squashed `main` diverge.** Each squash-merge means `main` is no longer an ancestor of `claude/epic-dirac-5TzaV`. Before every new PR: `git fetch origin main` then `git merge origin/main -X ours -m "…"` into the branch → the PR diff shows ONLY the new change. (`git reset --hard` and direct `git checkout -B main` + push are classifier-blocked.)
22. **Supabase REST: encode `+` as `%2B` in DELETE filters** (`email=eq.a%2Bb@x.com`). Unencoded `+` is read as a space → no match → returns 204 but deletes nothing. Bit us cleaning `clawmax12+welcome@gmail.com` test rows.
23. **Welcome-email gotchas**: SVG logos don't render in email → use a hosted **PNG** with an absolute URL (only live after deploy, so test sends after merge). `box-shadow`/`border-radius` render in Apple/iOS Mail, degrade gracefully elsewhere (keep a solid border). Test to the Resend account owner or a `+`-address; clean DB test rows via service_role afterwards.
24. **Don't ship a promise the backend can't keep.** "Kolla inkorgen" was gated until the welcome email actually sent (Resend domain verified + `RESEND_API_KEY` set in Vercel + redeployed). Interim copy was "Du är med! 🎉".
25. **Real social-proof count starts at 0 → "0+" looks dead.** Use a `COUNT_BASE` baseline + a `COUNT_MIN_SHOW` threshold, and paint the baseline at build time (so it shows even if the count RPC fails).
26. **Verify by rendering, frame-exact when needed.** For the animations we drove the WAAPI timeline (`getAnimations().pause()/currentTime`) to capture exact frames; for the email/logo we rendered HTML/SVG → PNG via Playwright. The sandbox CAN render local files + the local dev server; it CANNOT render the deployed site.

## 5. Parked / TODO (when the founder wants)
- **English / i18n** — Framer-native re-export (then re-inject our `ro-*` blocks) OR a bespoke `/en/` page. Weglot is ruled out.
- **Site logo swap** — put the new `tablehopp-logo.svg` (blue/outline/offset) into the nav + footer; also the raster favicons + `rideout-hero-mark.png`. Founder said "SENARE".
- **Referral leaderboard** — teased in the welcome email; real tracking (unique links, leaderboard, free first party) is a separate build.
- **Placeholder phone** "070-000 00 00" in the footer — replace or remove.
- **Infra rename** (optional/cosmetic): repo `rideout-web`, Vercel `rideout-site`, asset filenames `rideout-*`, element ids `rideout-ring/-layout/-tweaks`, `ro-` class prefix.
- Mailbox for `hej@tablehopp.app`.

---

# EARLIER SESSION (2026-06-16) — Framer embed / section work (still relevant for those sections)

## A. Production state at that time (pre-waitlist; now superseded by §1)
Page flow (desktop): Hero → manifesto → app-showcase (curtain worlds) → … → Why Choose Us → **clouds-CTA** → **marquee** → Footer.
- App-showcase "curtain worlds": desktop colour-stepping purple→blue→green, mobile word-reveal (driven from parent scroll via `window.frameElement`), `prefers-reduced-motion`.
- App-showcase **flash killed**: the embed is the full Echo template; other Echo sections are `display:none` (`<style id="ro-app-embed-hide">`) so nothing flashes. Framer runtime kept (layout needs it).
- Clouds-CTA: scroll-reveal on ≥1024px, resize-robust (live re-eval; iframe never moved/reloaded).
- Contact Section (black box + cyclist) removed; contact details now only in the footer.
- Marquee moved under the clouds-CTA.

## B. Architecture of the Framer embeds
- `index.html` is a Framer export. Logic = injected minified `<script>`/`<style>` blocks on the long last line + a CSS block (~line 274). Extract with `python` + regex `<script id="ro-XYZ">(.*?)</script>`.
  - Scripts: `ro-cta-js`, `ro-app-js`, `ro-marker-js`, `ro-manifesto-js`, `ro-logo`, `ro-imgperf`. CSS: `ro-cta-css`, `ro-app-css`, `ro-marker-css`, `ro-manifesto-css`, `ro-contact-fix`.
- **Two iframe embeds**, each a FULL template export; we use ONE section from each, masked/positioned by the parent:
  - `app-embed/index.html` = Echo template; section `section.framer-1lr98a4`.
  - `cta-embed/index.html` = Habitline template; section `section.framer-ujanuw`.
- Parent↔embed handshake via `postMessage` (`{roApp|roCta, secTop/ctaTop, secH/ctaH, ih}`); parent sets scroll-spacer height + scrubs the iframe with `frame.contentWindow.scrollTo()` on desktop (pinned), flat on mobile.
- **The embeds NEED the Framer runtime for layout.** Don't remove it.

## C. Verification tooling
- Dev server (MIME-correct): `npx serve@14 . -l <port>` or `python3 tools/serve.py`. **Never `python -m http.server`** (serves `.mjs` as octet-stream → Framer never boots → false results).
- Playwright: chromium at `/opt/pw-browsers/chromium-1223/chrome-linux64/chrome`, `--no-sandbox`; for EXTERNAL sites it won't connect (see Lesson 18) — LOCAL files + local server work. Wait ~9s for injected sections; nudge-scroll for lazy iframes.
- Perf: `node tools/perf-audit.mjs --device mobile|desktop`. Assets: `node scripts/check-assets.mjs` (SKIPS `app-embed/`+`cta-embed/`).

## D. Safety net
- `archive/echo-full-export` + `ECHO-ARCHIVE.md`. Restore-point branches `restore-point/2026-06-1x-*`.
- Tags can't be pushed (remote 403) — use branches. Revert production by pointing `main` at a restore-point.

## E. LESSONS 1–15 (earlier session)
1. Verify production-faithfully or not at all (correct MIME).
2. Never claim "done"/"verified"/"in PR X" without checking git/PR state first.
3. Don't confuse the Vercel preview chrome with the site.
4. Framer embeds need their runtime; to "remove" sections use `display:none` (deleting DOM → the runtime re-injects them).
5. Never move an `<iframe>` in the DOM — it reloads. Use constant DOM + CSS class/media-query.
6. Build-time width decisions glitch on resize — re-evaluate live + on `resize`.
7. Threshold mismatch causes the empty block (pin threshold must match where the embed scene is tall).
8. Clarify scope precisely before acting ("remove the map" = remove the whole Contact Section).
9. "Still there" usually = browser cache → hard-refresh + confirm preview vs production.
10. **`AskUserQuestion`: the `question` field goes INSIDE each object in the `questions` array** (omitting it fails the call — happened again this session).
11. Preserve before destructive changes (restore-point + archive branch).
12. Investigate hard; ask rarely but precisely.
13. Match emotional state; be honest; own errors; state plainly when something works/doesn't.
14. Surgical edits: byte-faithful (locate offsets, splice; don't full-DOM-re-serialize).
15. The founder reverts to a specific known-good point — pin it exactly.

## F. Workflow that works
Investigate → design → implement surgically (injected `ro-*` blocks / targeted bundle edits) → verify structurally + by rendering local files → push to branch → PR (draft) → founder verifies the live/preview visually → squash-merge to `main`. Keep secrets in env/dashboard, never in the repo.
