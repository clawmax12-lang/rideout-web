# HANDOFF — embedding exact Framer template sections (self-owned)

> Continuation doc (context was compacted mid-task). Goal: graft **exact, animated**
> sections from two Framer templates into our site, **self-owned** (no Framer
> connection), then rebrand to RideOut — **without changing the rest of our site**.
> Work happens on branch `claude/epic-dirac-5TzaV` (preview / draft PR #6). Production = `main`, do not touch.

## The 3 target sections the user picked
1. **Habitline "CTA"** — phone rising out of clouds + QR + app-store buttons. *(in progress)*
   Becomes our cliffhanger closer: copy → **"Allt detta — genom vår app."**
2. **AppNext "Features 01 / Built for studios"** — sticky section where scrolling opens the three `+` accordion rows + the phone screen changes. *(later)*
3. **AppNext testimonials** ("Loved by modern studios") — auto-swiping review carousel. *(later)*

User rules: **only one section per round** (this round = CTA only, NO template nav/header/footer — our site stays our site). Keep ALL localized assets (valuable for the other sections). Rebrand comes AFTER the exact graft.

## Templates / sources (committed)
- `templates-source/appnext-export.zip`, `templates-source/habitline-export.zip` (the user's hotlink exports).
- Live: `appnext.framer.website`, `habitline-wbs.framer.website`.
- `tools/localize-template.py` — the localizer (adapted from `archive/build-scripts/localize.py`).

## What works / what's decided
- **Headless render works** (Playwright at `/tmp/node_modules`, launch with `--ignore-certificate-errors` + context `ignoreHTTPSErrors:true`; scroll to trigger lazy assets). The repo's "renders blank" note does NOT apply with this setup.
- **Full localization works** → run `tools/localize-template.py` after: set `ROOT`, `SITE_BASE` (habitline = `https://framerusercontent.com/sites/7gp38v0CLUWI8Wdmp7kstT/`), empty `PHOSPHOR_SEEDS`, add an unverified `ssl` context to `fetch`. Produced `/tmp/habitline-local` (312 assets, **0 external requests at runtime** = truly self-owned, real Framer runtime → exact animations + responsive). Regenerate anytime in ~2 min.
- **CTA assets already localized into repo:** `assets/img/ro-cta-*` (10 files).
- **Current `index.html` WIP:** the CTA is grafted as `#ro-cta` (template in `<head>`, injected after `section[data-framer-name="Quote Section"]` post-hydration by `<script id="ro-cta-js">`), with a NATIVE spring reveal. **User verdict: NOT pixel-exact ("Nej")** → replace via Path B.

## Why grafting static DOM isn't enough (root cause)
Framer sections are **runtime-driven**: the appear animation needs `window.animator`
(`animateAppearEffects` / `startOptimizedAppearAnimation` / `getActiveVariantHash`),
and **responsive variant display is also runtime-driven** (`.ssr-variant{display:contents}`
+ the runtime hides non-active breakpoint variants via `getActiveVariantHash`). Two
Framer runtimes can't share one page, so a static graft is frozen + non-responsive
(mobile stacked all variants → ~35000px tall).

## Exact appear data (captured from the export)
`<script type="framer/appear" id="__framer__appearAnimationsContent">` → every appear
element: `opacity 0.001→1`, `y: 20→0`, **spring, duration 0.6, bounce 0**, staggered
`delay` 0.1 / 0.2 / 0.3 … 0.8. Handler is `<script data-framer-appear-animation="no-preference">`.
Elements carry `data-framer-appear-id` in **SSR** HTML (stripped after hydration — so capture from SSR or pre-appear, not the post-hydration snapshot).

## CHOSEN PATH = **B** (lighter-but-real)
Load Framer's **real `animator` runtime** (just the chunk, not the 45MB whole app/iframe)
+ feed the **exact appear data**, to drive the grafted **SSR** CTA section natively.
Real Framer engine, no mockup, no iframe.

### B — implementation plan + OPEN challenges
1. Find which localized `.mjs` chunk defines/exports `animator` (grep `/tmp/habitline-local/assets/scripts` for `animateAppearEffects`). Load the minimal subset so `window.animator` exists.
2. Use the **SSR** CTA section (has `data-framer-appear-id`) — extract from `templates-source/habitline-export.zip` index.html (balanced `<section ... CTA>` subtree), NOT the rendered snapshot.
3. Include `__framer__appearAnimationsContent` + `__framer__breakpoints` data (rename ids to avoid colliding with OUR site's own appear data) + the handler (adapted to our renamed ids).
4. **OPEN / hardest:** responsive variant display is runtime-driven. `animator` alone won't hide non-active `.ssr-variant`s → mobile may still stack. Options to solve: replicate variant-hiding per breakpoint from `__framer__breakpoints` + `getActiveVariantHash`, OR capture the section per-breakpoint (desktop + mobile renders, switch with our own media query) while keeping appear-ids (capture pre-appear).
5. CSS: full template CSS scoped under `#ro-cta`, keep all class-based rules incl `.hidden-*` (drop only pure globals html/body/*/:root→#ro-cta), give the `#ro-cta` wrapper the section's **16 ancestor classes** so original `.ancestor .el` selectors match. Neutralize non-section framer URLs → transparent data-uri (we already do this).
6. Verify with headless at desktop AND mobile; compare to live `habitline-wbs.framer.website` CTA — must be pixel + animation identical.
7. If B can't be made pixel-perfect on mobile → fallback is **A** (iframe the pruned localized template ~8MB, harmless local 404s for hidden parts).

## Tooling/CI notes
- `node scripts/check-assets.mjs` must pass; CI also greps `id="ro-` in index.html.
- Local server: `npx serve@14 . -l 8770` (start with Bash `run_in_background:true`; foreground `&` dies on shell reset).
- Preview URL: `https://rideout-site-git-claude-epic-di-06bdd3-clawmax12-langs-projects.vercel.app`.
- `/save-session` is NOT an available skill in this environment — this file is the save.
