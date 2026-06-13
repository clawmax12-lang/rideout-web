---
name: review
description: Grade the build against specs/<name>.md requirement-by-requirement, run the objective gate (perf budgets + asset check + spec Playwright checks), and hand specific fixes back to /build. Only passes when every machine-verifiable requirement is met. Use inside the /build⇄/review loop.
---

# /review — grade honestly, gate objectively, never rubber-stamp

When invoked, compare the current build to `specs/<name>.md` **requirement by requirement**.
For each, state PASS / FAIL and name the exact spec item. Then run the objective gate and let
the numbers — not your impression — decide.

## The objective gate (must run, must pass to declare the loop done)

1. `node scripts/check-assets.mjs` → must be ✅ (no missing/regressed asset refs).
2. `node tools/perf-audit.mjs --device mobile  --json /tmp/rev-mobile.json` → read `pass`.
3. `node tools/perf-audit.mjs --device desktop --json /tmp/rev-desktop.json` → read `pass`.
   - If over budget, the `bySection` breakdown names where the cost is — feed that exact
     section to `/build` as the fix target.
4. Any spec-specific behavioral checks (Playwright: element exists, computed style, position,
   variant switching, **zero new console errors** vs. the known-benign React #418/#405).
5. Compare perf JSON to the previous pass — a regression (numbers got worse) is a FAIL even
   if still under budget; flag it.

## The non-negotiable honesty rules

- **Headless ≠ device.** Every Definition-of-Done item in the spec's list (B) is marked
  `PENDING DEVICE CHECK` and listed for the morning. NEVER mark an iOS-visual/perceptual item
  "done" from Chromium/WebKit-headless evidence. We have proof this lies (the white flash,
  the ±262px teleport, the broken sticky all passed headless).
- **A green loop is not a shipped feature.** The loop's terminal state is: "all machine-
  verifiable requirements pass + perf within budget + asset check clean + list (B) staged for
  device review." Say exactly that — don't imply iOS is verified.
- If anything FAILS: write the **specific** fix needed (file, what to change, why, which spec
  item it satisfies) and hand it to `/build`. Don't fix it yourself in `/review`.

## Output every pass

- Requirement table (PASS/FAIL + spec item).
- Gate results: asset check, mobile/desktop perf JSON (TBT, longest, jank, worst section),
  delta vs previous pass.
- The fix list for `/build` (or "all machine-verifiable requirements met").
- The `PENDING DEVICE CHECK` list for the morning.
- A one-line loop verdict: `CONTINUE` (fixes outstanding) or `DONE-PENDING-DEVICE`.
