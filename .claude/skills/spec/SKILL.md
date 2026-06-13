---
name: spec
description: Interview the user about a feature/fix, then write a build-against-able spec to specs/<name>.md. Use when starting any non-trivial change on rideout-web, especially performance/jank/bug work that will run through the /build⇄/review loop.
---

# /spec — turn an idea into a checkable spec

When invoked, INTERVIEW the user before writing anything. Ask **one focused question
at a time** until you understand: the goal, the must-have requirements, the constraints,
and what "done" looks like. Do not start building. Do not write the spec until you can
state the definition of done concretely.

If the user already gave enough detail (e.g. "optimize mobile jank in the app section"),
ask only the gaps — don't re-interview what's already clear.

Then write `specs/<name>.md` with these sections:

1. **Objective** — one paragraph, the user's intent in their words.
2. **Requirements** — numbered, each one atomic and unambiguous.
3. **Out of scope** — what must NOT change. On this repo, always list explicitly whether
   desktop, copy, and other sections are off-limits (they usually are unless named).
4. **Edge cases** — iOS Safari quirks, hydration timing, container restarts, parallel-session
   git races, mobile vs desktop Framer variants. (See FRAMER-SECTION-EMBED-PLAYBOOK.md.)
5. **Definition of Done** — split into TWO lists, this split is mandatory:
   - **(A) Machine-verifiable** — each item must name the exact check that proves it:
     `tools/perf-audit.mjs` budget numbers, `scripts/check-assets.mjs`, a specific
     Playwright assertion (element present, position, computed style, no console error).
     `/review` gates on these.
   - **(B) Human device-review only** — anything about how it *looks/feels on a real iPhone*
     (smoothness, no flash, no teleport, paint correctness). These can NEVER be marked
     "done" by headless tooling — `/review` marks them `PENDING DEVICE CHECK`. State this
     in the spec so nobody mistakes a green loop for a verified ship.

## The hard-won rule (write it into every spec's header)

> Headless verification gives false greens on iOS perceptual bugs. The loop proves
> main-thread performance and behavioral correctness; it does NOT prove iOS visual
> correctness. The morning device check is part of Done, not optional.
