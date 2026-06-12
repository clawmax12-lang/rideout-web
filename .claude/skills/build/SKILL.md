---
name: build
description: Read specs/<name>.md and build exactly what it specifies on rideout-web — no scope creep. Run the objective gate, commit to the working branch (never main during a loop). Use inside the /build⇄/review loop.
---

# /build — build exactly the spec, prove it, commit safely

1. **Read `specs/<name>.md`.** If multiple specs exist, ask which (or use the one the
   loop names). Build **exactly** what it describes.

2. **No scope creep.** Do not add features, refactor unrelated code, or touch anything in
   the spec's "Out of scope". On this repo specifically:
   - SSR text edits must match the chunk edits exactly (index.html AND assets/scripts/*.mjs,
     and the embeds' own chunks) or hydration flashes. Never delete SSR sections — `display:none`.
   - Never reference `cta-embed/`/`app-embed/` asset paths from the main page (the asset
     checker substring-matches and fails). Keep embed assets self-contained.
   - Mobile and desktop are different Framer variants (`Default` vs `Default - Phone`,
     `IMG ` vs `BG ` cards). Gate per-variant; don't break one fixing the other.
   - Read FRAMER-SECTION-EMBED-PLAYBOOK.md before touching embed internals.

3. **Prove it.** After building, run the objective gate and paste the numbers:
   ```
   node scripts/check-assets.mjs
   node tools/perf-audit.mjs --device mobile  --json /tmp/perf-mobile.json
   node tools/perf-audit.mjs --device desktop --json /tmp/perf-desktop.json
   ```
   (In this container: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` and the dev server on a
   fresh port via `python3 tools/serve.py <port> .`; pass `--url`. Read `pass` from the JSON,
   not the piped exit code.)

4. **List coverage.** For each spec requirement, state: covered / how, with the file+line
   or the measured number. This is what `/review` checks against.

5. **Commit to the WORKING BRANCH, never main during a loop.** Use the night/feature branch.
   Commit message: what changed + the before→after perf delta. Do not open or merge PRs from
   inside the loop unless the spec says to. Pushing to `main` autonomously is forbidden here —
   that's a human decision.

6. If `/review` handed back specific fixes, address those and only those this pass.
