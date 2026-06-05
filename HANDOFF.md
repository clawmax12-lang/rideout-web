# HANDOFF — how this site works (read before editing)

This repo is the **marketing site for the RideOut iOS app** (Swedish *cykelfest*
landing page). It is a **self-contained static site**: plain HTML + CSS + JS +
assets, **no build step, no backend**. The site files live at the **repo root**
(`index.html` + `assets/`).

> It originated as a **localized + rebranded Framer "Eventin" export**. That brings
> a few quirks — read this before editing or you may break the page.

---

## Run locally

```bash
npm run dev          # http://localhost:8770  (wraps `npx serve`)
# or
python3 -m http.server 8770
```

After editing, **hard-reload** (Cmd/Ctrl+Shift+R). The hashed `.mjs` chunk is
cached aggressively — a normal refresh often serves the stale one. (Some headless
screenshot tools render this Framer page blank; verify in a real browser.)

---

## How it works (the important part)

Framer **re-hydrates** the DOM on load and **overwrites direct DOM edits**. So every
RideOut customization is an **idempotent injected block** that re-applies itself:

- All custom blocks are `<script>` / `<style>` with ids prefixed **`ro-`** or
  **`rideout-`**, near the end of `<head>` and before `</body>`. They re-run on
  load + a 250 ms interval (the hero uses a `MutationObserver`) so they survive
  hydration. **Reverting a feature = delete its block.**
- **Swapping a managed image/video**: edit the path in **BOTH** `index.html` (SSR)
  **and** the hydration chunk `assets/scripts/*.mjs` (the `src:` / `srcFile`
  literals). If you only edit one, hydration reverts it.
- **Always give a new/changed asset a NEW filename** (browsers cache same-named files).
- The chunk is cached hard, so returning visitors can briefly see an old asset; the
  hero swap has a JS guard (`ro-hero-mark`) that pins the correct image regardless.

### Customizations (`ro-*` blocks)
- Nav logo + footer brand mark → the RideOut mark (`assets/img/rideout-logo.svg` / `-white.svg`).
- Hero decoration → dashed RideOut mark (`assets/img/rideout-hero-mark.png`, replaced a star).
- Favicon → simplified small-size variant (`rideout-favicon.svg` + `-white` + PNG 16/32/48) + apple-touch.
- 6-question FAQ accordion in the footer.
- Swedish Ä/Å diacritic clipping fix (`overflow-clip-margin`).
- "Efterfest" video swap (H.264) + viewport-gated playback.
- Dropdown nav fix ("Så funkar det" smooth-scrolls to `#event`).

---

## Asset integrity

Run the checker (also enforced in CI):

```bash
npm run check        # node scripts/check-assets.mjs
```

It scans the live files for `assets/<dir>/...` references and fails if any are
missing. The live site is verified complete (a real-browser network load made
~100 requests with **0 missing / 0 404s**).

> Note: Framer leaves some **legacy root-path strings** (`assets/<hash>.woff2`,
> `assets/<hash>.mp4`) inside the search-index/chunk *manifest* and the archived
> originals. They are **not load URLs** — the real `@font-face`/`<video>` paths use
> `assets/fonts/…` and `assets/media/…`. The checker ignores the manifest noise by
> only validating sub-foldered paths.

---

## `archive/` — reference only (not shipped)

- `index.eventin.html`, `index.original.html` — the **original** English Framer
  exports (pre-localization). Kept for reference; they contain stale root-path
  asset refs and are **excluded from deploys and CI**.
- `build-scripts/` — the one-off `localize.py` / `rebrand*.py` / `make_bike_icon.py`
  used to produce the localized site. **STALE — do not re-run**: they regress the
  hand-tuned live files (the live `index.html` + chunk are the source of truth).

---

## Pre-launch checklist

1. **Contact form** is a neutralized stub → wire it to a real endpoint/backend.
2. **Domain**: update `<link rel="canonical">` + `og:url` + social meta (currently `eventin.framer.website`).
3. Confirm the host serves **`.mjs` as `text/javascript`** (Vercel/Netlify/CF Pages via the included configs).
4. Optional: top **marquee** still drops Ä/Å on a few words (same clip cause as the pillars).
