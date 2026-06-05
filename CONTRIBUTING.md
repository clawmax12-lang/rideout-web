# Contributing

Internal RideOut repo. Quick rules so edits don't break the Framer export.

## Setup

```bash
npm run dev      # http://localhost:8770
npm run check    # asset-integrity check (must pass; CI enforces it)
```

Hard-reload (Cmd/Ctrl+Shift+R) after edits — the hashed `.mjs` chunk caches hard.

## Editing rules (important)

This is a **Framer static export** that re-hydrates the DOM. **Read
[HANDOFF.md](HANDOFF.md) first.** In short:

1. All RideOut changes live in **idempotent `ro-*` injected blocks** in
   `index.html`. Edit/extend those — don't hand-edit hydrated DOM and expect it
   to persist. Reverting a feature = delete its block.
2. **Swapping a managed image/video** = change the path in **both** `index.html`
   and the hydration chunk `assets/scripts/*.mjs`, and use a **new filename**.
3. Don't touch `archive/` — it's the original exports + stale build scripts
   (do not re-run them; they regress the live files).

## Workflow

- Branch from `main`, open a PR. CI runs the asset check + HTML sanity.
- Keep commits focused; describe user-visible changes.
- Before launch, see the checklist in [README.md](README.md#pre-launch-checklist)
  (contact-form backend, real domain in canonical/og, etc.).
