# Echo full export — component archive

This branch (`archive/echo-full-export`) is the **untouched, full Framer "Echo" template export**
for `app-embed/` (the app-showcase). It is kept here on purpose so components can be reused later
**without re-importing the Framer zip**.

> ⚠️ This branch is **never merged to `main` and never deployed**. `main` carries only the single
> section we actually use (`section.framer-1lr98a4`). Pull from here only when you want to grab
> something extra.

## What's in the full export (`app-embed/index.html`)

Top-level blocks inside `<div id="main">`, with their Framer selectors:

| Block | Selector | Notes |
|---|---|---|
| Navbar (desktop) | `.framer-WAQwd` (`[data-framer-name="Nav"]`) | the navbar you wanted to keep available |
| Navbar (mobile) | `.framer-1ehzwwr` | |
| Hero | `header.framer-1by8ea9` | |
| Features 1 | `section.framer-79o1d2` | Excel-feature carousel |
| **Features 2** | **`section.framer-1lr98a4`** | **the one we use live (curtain worlds)** |
| Testimonials | `section.framer-ej5lsn` | |
| About | `section.framer-1ylltw2` | |
| Pricing | `section.framer-1xs6k7o` | |
| FAQ | `section.framer-1xeq7zx` | accordion |
| Footer | `footer.framer-ebZvI` | |

All original assets are under `app-embed/assets/` on this branch (scripts, images, fonts) — including
everything the navbar and other sections need.

## How to grab something later

```bash
# View the full export
git show archive/echo-full-export:app-embed/index.html | less

# Or check the whole embed out into a scratch dir
git checkout archive/echo-full-export -- app-embed/
```

Then lift the markup for the selector you want (e.g. `.framer-WAQwd` for the navbar) plus the CSS
rules and assets it references. The CSS is the monolithic `<style>` block in `<head>`; fonts/images
are under `app-embed/assets/`.

## Also note
- `restore-point/2026-06-16-pre-embed-strip` is the matching **live-site revert anchor** (same
  snapshot, named for reverting production if needed).
- The clouds-CTA (`cta-embed/`) is still a full Habitline export on `main` — untouched.
