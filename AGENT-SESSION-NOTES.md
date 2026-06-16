# RideOut-web — Session state & hard-won agent lessons

_Last updated: 2026-06-16. Read this FIRST before touching this repo again._

## 0. TL;DR for next time
- This is a **static Framer export** marketing site. Production deploys from **`main`** to Vercel (`rideout-site.vercel.app`). Preview = per-branch Vercel URL (auth-protected).
- The fancy sections are **grafted Framer template embeds in iframes**, driven by **injected vanilla-JS** in `index.html`. They are fragile. Verify with the real browser, not assumptions.
- **Always preserve before destructive work** (restore-point branch + archive branch). We have several already (see §4).
- The founder values **"snyggt men laggigt" over "fult men smooth"**, hates regressions, edge-case-tests hard, and (rightly) calls out anything that glitches. Own mistakes plainly; don't claim "done/verified" without proof.

## 1. Current production state (after PR #12, commit 13130c0)
Page flow (desktop): Hero → manifesto → app-showcase (curtain worlds) → … → Why Choose Us → **clouds-CTA** → **marquee** → Footer.
Shipped in this run:
- App-showcase "curtain worlds": desktop colour-stepping purple→blue→green, mobile word-reveal (driven from parent scroll via `window.frameElement`), clearer Avy colour transition, `prefers-reduced-motion`.
- App-showcase **flash killed**: the embed is the full Echo template; the other Echo sections (hero/nav/footer/Features1/Testimonials/About/Pricing/FAQ) are now `display:none` (`<style id="ro-app-embed-hide">`) so nothing flashes when scrolling in. Framer runtime kept (layout needs it).
- Clouds-CTA: empty-block fixed; **scroll-reveal restored on ≥1024px** (flat below, so the empty block can't return); **resize-robust** (live mode re-eval + constant DOM; iframe never moved/reloaded).
- Contact Section (black box + cyclist image) **removed** (`section[data-framer-name="Contact Section"]{display:none}`). This also removed on-page contact details — they only live in the footer now.
- Marquee (CYKELFEST◆KANINEN◆UPPSALA◆INSTAGRAM, Framer "Quote Section" `framer-1g5t3hj`) **moved under** the clouds-CTA (by flipping the CTA insertion to `insertBefore(sec, a)`).

## 2. Architecture (how this site actually works)
- `index.html` is a Framer export. Our logic is **injected minified `<script>`/`<style>` blocks on the long last line** + a CSS block (line ~274). Extract with `python` + regex `<script id="ro-XYZ">(.*?)</script>`.
  - Scripts: `ro-cta-js` (clouds-CTA), `ro-app-js` (app-showcase), `ro-marker-js`, `ro-manifesto-js`, `ro-logo`, `ro-imgperf`. CSS: `ro-cta-css`, `ro-app-css`, `ro-marker-css`, `ro-manifesto-css`, `ro-contact-fix`.
- **Two iframe embeds**, each a FULL template export, we use ONE section from each, masked/positioned by the parent:
  - `app-embed/index.html` = Echo template. Our section = `section.framer-1lr98a4`.
  - `cta-embed/index.html` = Habitline template. Our section = `section.framer-ujanuw`.
- Parent↔embed handshake via `postMessage`: embed posts `{roApp|roCta, secTop/ctaTop, secH/ctaH, ih}`; parent sets the scroll-spacer height and scrubs the iframe with `frame.contentWindow.scrollTo()` on desktop (pinned), flat on mobile.
- **The embeds NEED the Framer runtime for layout.** Don't remove it.

## 3. Verification tooling (use EVERY time)
- Dev server (MIME-correct): `python3 tools/serve.py <port> <dir>`. **Never `python -m http.server`** — it serves `.mjs` as `application/octet-stream`, Framer never boots, and you get false results. Restart reliably with explicit `nohup … &` then `curl -sI` to confirm (the `pgrep || (… &)` one-liner kept dying).
- Playwright: chromium at `/opt/pw-browsers/chromium-1223/chrome-linux64/chrome`; `import('playwright')` else `/tmp/node_modules/playwright/index.mjs`; `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`; `chromium.launch({args:['--ignore-certificate-errors']})`, context `{ignoreHTTPSErrors:true}`. Wait ~9s for injected sections to build; **nudge-scroll** to trigger lazy iframes.
- Perf: `node tools/perf-audit.mjs --device mobile|desktop`. Assets: `node scripts/check-assets.mjs` (note: it SKIPS `app-embed/`+`cta-embed/`).
- **Reality: the Framer iframe embeds render UNRELIABLY headless** (lazy load + hydration). You can verify *structure* (heights, pin state, computed styles, DOM order) headless, but **final visuals must be checked on the real preview by the founder**. Vercel preview URLs are **auth-protected → 401 to curl/headless**; you can't fetch the deployed preview content. Verify on identical local files + have the founder eyeball.

## 4. Safety net (NEVER lose work)
- `archive/echo-full-export` — full untouched Echo export + `ECHO-ARCHIVE.md` cataloguing reusable components (navbar `framer-WAQwd`, etc.).
- Restore-point branches: `restore-point/2026-06-14-cta-fixed`, `…-2026-06-15-reveal-avy`, `…-2026-06-16-pre-embed-strip`, `…-2026-06-16-cta-cleanup`.
- **Tags can't be pushed (remote 403). Use branches via `mcp__github__create_branch`.**
- To revert production: point `main` at a restore-point.

## 5. LESSONS — mistakes to NEVER repeat
1. **Verify production-faithfully or not at all.** `tools/serve.py` (correct MIME). `python -m http.server` = false greens.
2. **Never claim "done"/"verified"/"it's in PR X" without checking git/PR state first.** I flip-flopped ("it's done" → "I never pushed it" → "actually it IS pushed") because context had dropped a commit. ALWAYS `git log/branch` + `list_pull_requests` before asserting state.
3. **Don't confuse the Vercel preview chrome with the site.** I mistook the preview toolbar's dark frame for a site "space vignette" and chased a non-bug. Look at the actual rendered site.
4. **These Framer embeds need their runtime.** Removing it collapses layout (CTA phone-cards 656×564 → 1440×6). Keeping the runtime but deleting sibling DOM → **the runtime re-injects the deleted sections**. So to "remove other sections": `display:none` (keep runtime), don't delete DOM.
5. **Never move an `<iframe>` in the DOM — it reloads.** For pin↔flat mode switches use **constant DOM + CSS class/media-query**, and live JS re-eval.
6. **Build-time width decisions glitch on resize.** `var mob = innerWidth < X` set once → desync when crossing the breakpoint (super-long section / empty block). Re-evaluate live + recompute on `resize`.
7. **Threshold mismatch causes the empty block.** The parent's pin threshold MUST match the width where the embed scene is actually tall; otherwise the pin forces a viewport over a short scene = empty sky.
8. **Clarify scope precisely before acting.** "Remove the map" actually meant "remove the whole Contact Section (+ cyclist image)." When the user points at something, confirm the exact extent.
9. **"Still there" usually = browser cache.** Tell the founder to hard-refresh (Cmd/Ctrl+Shift+R) and confirm they're on the *preview* link, not production.
10. **`AskUserQuestion`: the `question` field belongs INSIDE each object of the `questions` array.** I omitted it ~5 times and wasted calls. Don't.
11. **Preserve before destructive changes** (restore-point + archive branch) — every time.
12. **Investigate hard; ask rarely but precisely.** The founder is frustrated by BOTH wrong guesses and repeated questions. Default: dig with Explore/Plan agents, present evidence, then ask ONE crisp evidence-backed question only at a genuine fork.
13. **Match emotional state; be honest.** A whole day's work got reverted as a "catastrophe." Lead with honesty, own errors, don't hedge when something works, do say so plainly when it doesn't.
14. **Surgical edits: byte-faithful.** For big HTML, locate exact offsets with `html.parser` and splice the original string; `sha256`-guard the regions that must stay identical. Don't full-DOM-re-serialize (it reformats SSR markup the scripts/CSS depend on).
15. **The founder reverts to "just before I said I'd show investors", not further** — when asked to revert, pin the exact point (we used the session transcript timestamps to find it).

## 6. Workflow that worked
Investigate (Explore agents, parallel) → design (Plan agent) → implement surgically → verify structurally headless → push to branch → founder verifies the preview visually → save restore-point → merge to `main`. Keep PRs as drafts until the founder approves.
