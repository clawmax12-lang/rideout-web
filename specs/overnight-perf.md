# Spec: Overnight performance & jank cleanup

> **Hard-won rule:** Headless verification gives false greens on iOS perceptual bugs.
> This loop proves main-thread performance and behavioral correctness; it does NOT prove
> iOS visual correctness. The morning device check is part of Done, not optional.

## Objective

Make the RideOut site (`rideout-web`, branch work only) measurably faster and free of
main-thread jank — the "laggy, buggy, can't-put-your-finger-on-it" feel the founder saw
on a real iPhone, concentrated when scrolling past the app-showcase, manifesto, and
clouds-CTA sections. Reduce blocking time and dropped frames without changing how the
site looks, reads, or behaves.

## Baseline (2026-06-12, `tools/perf-audit.mjs` @ 4x CPU throttle)

| metric | mobile | desktop |
|---|---|---|
| Total Blocking Time | 6894ms | 3351ms |
| Longest task | 1169ms | 829ms |
| Long tasks (>50ms) | 67 | 43 |
| Frame gaps >50ms | 129 | 77 |

Worst sections: mobile "other" (page hydration) 4364ms then manifesto 1565ms; desktop
"other" 1555ms then app-section 1403ms (an 829ms task — the scrub iframe hydrating).

## Requirements

1. Reduce main-thread cost without altering rendered output. Levers, in priority order:
   1a. **Defer our injected work off the hydration critical path** — manifesto canvas
       engine, marker overlay, embed scrubbers, word-highlight should not run work until
       after Framer's hydration settles or the section is near the viewport
       (IntersectionObserver / idle callback / first-scroll), and must stop work when
       offscreen.
   2b. **Cut per-frame cost** — ensure every rAF path is gated on actual scroll/size delta,
       writes only changed style values, and caps full-DOM scans (the playbook's perf
       pattern). Batch canvas strokes; respect the 30fps caps and `prefers-reduced-motion`.
   1c. **Stagger/lazy the iframes** so the app + cta embeds don't hydrate on top of the
       host page's hydration burst.
2. The longest single task must come down (it's the clearest hitch source).
3. No new console errors beyond the known-benign React #418/#405 and the deliberately
   dropped cta mp4 404.
4. Keep the per-section jank attribution honest — don't move cost into "other" to game a
   section number; total TBT must drop.

## Out of scope (must NOT change)

- **Copy / wording** — none. (That's a separate, human-led pass.)
- **Visual design** — colors, fonts, layout, the offset frames, cloud bank, curtains,
  wave engine output, marker animation curves. Output pixels must match before/after.
- **Desktop interaction model** — sticky pins, scrub, variant switching stay intact.
- **The flat mobile modes** for app + cta sections shipped today — keep them.
- No new features, no template restructuring, no dependency additions.

## Edge cases to respect

- SSR text/markup must equal the chunk markup (index.html + assets/scripts/*.mjs + embed
  chunks) — never introduce a hydration mismatch.
- Mobile vs desktop are different Framer variants; gate changes per variant.
- Container may restart mid-run → re-run the git turn-start ritual, reinstall ephemeral
  tooling, fresh server port.
- Parallel sessions push to main → never push main from the loop; rebase the work branch.
- Don't reference embed asset paths from the main page (asset checker substring-matches).

## Definition of Done

### (A) Machine-verifiable — `/review` gates on these
- `node scripts/check-assets.mjs` → ✅ all present.
- `node tools/perf-audit.mjs --device mobile`  → `pass: true` (TBT ≤2500, longest ≤550,
  longTasks ≤42, frameGaps50 ≤55).
- `node tools/perf-audit.mjs --device desktop` → `pass: true` (TBT ≤1500, longest ≤450,
  longTasks ≤28, frameGaps50 ≤32).
- No perf regression between consecutive passes (numbers monotonically improve or hold).
- Zero new console errors vs. the known-benign set.
- A before/after screenshot diff of hero, app-section (each curtain step), manifesto, and
  cta confirms **identical rendered output** (Requirement: no visual change).

### (B) Human device-review only — `PENDING DEVICE CHECK`, never auto-passed
- On a real iPhone, scrolling through app-showcase, manifesto, and clouds-CTA feels
  smooth: no white flash on entry, no teleport/jump at standstill, no stutter or
  catch-up spikes, curtains/clouds slide cleanly.
- The overall "laggy/buggy" feel is gone.

The loop terminates at **DONE-PENDING-DEVICE**: all of (A) green, (B) staged for the
morning. A green loop is not a shipped feature until the device check passes.
