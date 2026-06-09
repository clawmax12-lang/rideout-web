# Inspiration: Echo (SaaS template)

Source: **echoagentai.framer.website** — "Echo | SaaS Website Template".
Framer site base: `framerusercontent.com/sites/3IzvPqZsgkNpCbvfvtpJhg/`.
We borrow **detail-level components / animations** from this one (not whole sections).

## Ownership / how to regenerate
- Source zip (committed): `templates-source/echo-pageexport.zip` (hotlink-mode export).
- Self-owned localized copy is **re-derivable** (don't commit the whole template):
  ```
  sed -e 's#ROOT = "/tmp/habitline-local"#ROOT = "/tmp/echo-local"#' \
      -e 's#sites/7gp38v0CLUWI8Wdmp7kstT/#sites/3IzvPqZsgkNpCbvfvtpJhg/#' \
      tools/localize-template.py > /tmp/localize-echo.py
  mkdir -p /tmp/echo-local && unzip -p templates-source/echo-pageexport.zip index.html > /tmp/echo-local/index.html
  python3 /tmp/localize-echo.py            # 152 assets, 0 external
  python3 tools/serve.py 8782 /tmp/echo-local
  ```
- Known issues in the localized copy (fix when implementing an interactive component):
  - `new URL` "Invalid base URL" → "Made UI non-interactive" (localizer rewrites the
    collection-loader base to a relative path; see playbook §11). Static SSR still renders.
  - 1 image (`6CsdkB2Pzg7gLCbn821nfJdd8.png`) failed to download (stray-quote URL) — trivial.

## Borrowable components / animations
1. **Hero command-card** — blue dotted-pattern panel with a floating "search/command" card:
   typing animation (`Rewrite this |`), file chips (Google Docs / Confluence), circular
   send button.
2. **Card carousel** — horizontally sliding cards with dot pagination + left/right arrows.
3. **Animated pattern cards** — large rounded cards filled with the brand clover-cross /
   dot pattern (purple, green, yellow, blue) — the motif also fills the logo + footer blobs.
4. **Feature sections** — text + big pattern card, scroll-reveal (appear) on enter.
5. **Testimonials** — dark quote cards with colored *patterned avatar headers* + name/role.
6. **Text-highlight animation** — "Our team is ready to assist you anytime." words light up
   on scroll (word-by-word highlight sweep).
7. **Pricing cards** — Pro / Enterprise with subtle textured backgrounds.
8. **FAQ accordion** — expand/collapse Q&A + "Load More".
9. **Footer** — oversized condensed heading ("GET ORGANIZED. MOVE REVENUE.") + email
   signup + colored clover pattern blobs.

## Candidate for our "program schedule" replacement
TBD with user — likely the **feature/pattern cards** or the **carousel** reworked into a
RideOut "kvällens program / schema" timeline. Decide which component(s) to implement next.
