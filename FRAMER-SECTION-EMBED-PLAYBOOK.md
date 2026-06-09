# Framer-section embed playbook ("D-sättet")

> How we put a **pixel-identical** Framer template section into our own site, **fully
> self-owned** (nothing connected to Framer), without touching the rest of the site —
> and improve it slightly. This is the **approved, repeatable method**. Use it for every
> remaining section. **Don't re-ask the user how to do it — do it this way.**
>
> Proven on: **Habitline clouds-CTA** → our closing cliffhanger (the "phone rising out of
> the clouds"). Shipped on branch `claude/epic-dirac-5TzaV`, draft PR #6. Production = `main`.

---

## 0. TL;DR — the method in one paragraph

Framer sections are **runtime-driven** (React + framer-motion + a declarative `data-nce-*`
scroll/mouse animation layer). You **cannot** reproduce them faithfully by grafting static
DOM or hand-rolling the animation — that's a frozen mock-up and the user will (rightly)
reject it. Instead: **fully localize the template** (download every asset, 0 external
requests), serve **only that one section** inside a **same-origin `<iframe>`**, hide the
template's chrome (nav/footer/badge) with CSS + white masks, and **drive the iframe's
internal scroll from the parent page's scroll** ("scroll-scrubbing") so the real animation
plays as the user scrolls. Because it's the *actual* section running its *actual* runtime,
it is pixel-identical by construction. Then layer small improvements (swap the screen image,
cover a cutoff) by editing the localized assets only.

---

## 1. Section status

| Section | Source | Type | Status |
| --- | --- | --- | --- |
| Habitline **clouds-CTA** (phone from clouds + QR + store buttons) | `templates-source/habitline-export.zip` | scroll-scrubbed | ✅ shipped (`cta-embed/`) |
| AppNext **Features 01 / "Built for studios"** (sticky; scrolling opens the three `+` rows, phone screen changes) | `templates-source/appnext-export.zip` | scroll-scrubbed | ⏳ next |
| AppNext **testimonials** ("Loved by modern studios", auto-swiping carousel) | `templates-source/appnext-export.zip` | autoplay (time-based) | ⏳ next |

One section per round. Preview only (this branch / draft PR), never straight to `main`.
Keep **all** localized assets — they're valuable for the other sections.

---

## 2. The two embed modes

- **Mode A — scroll-scrubbed** (CTA, sticky-accordion): the section animates as you scroll
  *through* it. The parent maps page-scroll → `iframe.contentWindow.scrollTo(...)`. This is
  the bulk of this playbook.
- **Mode B — autoplay / static** (testimonials carousel): the section animates on its own
  timer; no scrub needed. Same localize + mask + iframe, but the parent just sizes the
  iframe to the section height (via `postMessage`) and lets it play. (Skip the scroll
  handler; set `pointer-events:auto` if it needs swiping, or leave it autoplaying.)

Decide the mode by inspecting the section: if its reveal is tied to scroll position →
Mode A; if it loops/auto-advances on a timer → Mode B.

---

## 3. The step-by-step workflow

Absolute paths; the Bash `cwd` can reset and `cd` in a compound command can trigger a
prompt — prefer absolute paths and the Read/Grep tools over shell.

1. **Unzip the export & find the section.**
   ```
   unzip -q templates-source/<name>-export.zip -d /tmp/<name>-src
   ```
   Grep `index.html` for `data-framer-name="..."` to locate the `<section class="framer-XXXX">`.
   Note its **first class** (e.g. `framer-ujanuw`) — that's your section selector.

2. **Localize the whole template** (self-owned, 0 external requests):
   - Edit `tools/localize-template.py`: set `ROOT=/tmp/<name>-local`, `SITE_BASE` to the
     export's `framerusercontent.com/sites/<id>/`, `PHOSPHOR_SEEDS=[]`. (SSL is already set
     to unverified context for the fetch.)
   - `cp /tmp/<name>-src/index.html /tmp/<name>-local/index.html && python3 tools/localize-template.py`
   - Result: `/tmp/<name>-local` with `assets/{img,fonts,scripts,media,data}`, every
     framerusercontent/gstatic URL rewritten to local, endpoints neutralized. Verify the
     summary prints **0 download failures**.

3. **Verify it renders & animates locally — BEFORE editing anything.**
   - Serve with a **MIME-correct** server (Python's `http.server` serves `.mjs` as the wrong
     type and the runtime won't boot): `python3 tools/serve.py 8772 /tmp/<name>-local`
     (run in background).
   - Drive it with Playwright (`/tmp/node_modules`, chromium at `/opt/pw-browsers`, launch
     `--ignore-certificate-errors`, context `ignoreHTTPSErrors:true`). Scroll **gradually**
     (small steps) into the section and confirm the animation plays. A "CMS / Invalid base
     URL" console error is **harmless** (CMS for hidden sections) — ignore it.

4. **Turn the localized copy into the embed page** by injecting two blocks before `</head>`
   (idempotent; see §4 for the exact, shipped code):
   - CSS that hides the chrome: **`nav{visibility:hidden}`** (NOT `display:none` — see
     gotcha #2), and `footer,#overlay,#__framer-badge-container,<promo>{display:none}`.
     **Never** put `overflow-x:hidden` on `html,body` (gotcha #1). Plus a `.ro-mask` class.
   - JS that (a) creates top+bottom white **masks** that cover everything above the section
     top and below the section bottom each frame (so only the section shows), (b) hides any
     leftover fixed promo/badge by text, and (c) `postMessage`s `{roCta:1, ctaTop, ctaH, ih}`
     to the parent on load/resize/interval.

5. **Build the parent embed** in our `index.html` (see §4 for shipped code): a sticky-pinned
   `<iframe loading="lazy" pointer-events:none>` inserted **post-hydration** after an anchor
   section (idempotent `setInterval` until inserted — survives Framer's re-hydration; avoids
   React #418/#425). The parent listens for the geometry message, sizes a tall scroller
   (`height = runway + ih`, `runway = ctaH - ih`), and on scroll sets
   `iframe.contentWindow.scrollTo(0, ctaTop + p*runway)` where `p` is progress through the
   scroller. Same-origin → cross-frame `scrollTo` is allowed.

6. **Copy the embed into the repo** as `<name>-embed/` and **drop only the videos**
   (`assets/media/*.mp4`, big and only used by hidden sections). **Keep every image
   variant** (gotcha #5). Add `<name>-embed` to `SKIP_DIRS` in `scripts/check-assets.mjs`
   (it's a self-contained vendored sub-site).

7. **Verify headless across breakpoints + DPR** (the real gate — see §6 checklist).

8. **Improvements** (optional, after the base is pixel-exact): edit only the localized
   assets (e.g. swap the phone screen, feather/cover a cutoff). Keep the section otherwise
   identical.

9. **Commit, push** (`git push -u origin claude/epic-dirac-5TzaV`, retry on network error),
   **draft PR**, let Vercel build the preview.

10. **Report** with the preview URL + local screenshots. The live preview is behind Vercel
    auth (401) so you can't headless it — verify locally and let the user view the preview.

---

## 4. The reusable code (exactly what shipped for the CTA)

### 4a. Embed page — injected into `<name>-embed/index.html` before `</head>`

```html
<style id="ro-embed-css">
html,body{margin:0!important;background:#ffffff!important}            /* NO overflow-x:hidden — breaks sticky */
nav{visibility:hidden!important}                                      /* keep flow (nav is position:relative, 124px) */
footer,#overlay,#__framer-badge-container,.framer-karqbq,.framer-xxhg1r-container{display:none!important}
.ro-mask{position:fixed;left:0;width:100%;background:#ffffff;z-index:2147483600;pointer-events:none}
#ro-mask-top{top:0}
</style>
<script id="ro-embed-js">
(function(){
 var topM,botM;
 function cta(){return document.querySelector('section.framer-ujanuw');}   /* <-- section selector */
 function ensure(){
   if(!topM){topM=document.createElement('div');topM.id='ro-mask-top';topM.className='ro-mask';document.body.appendChild(topM);}
   if(!botM){botM=document.createElement('div');botM.id='ro-mask-bot';botM.className='ro-mask';document.body.appendChild(botM);}
 }
 function hidePromo(){
   document.querySelectorAll('body *').forEach(function(e){
     var c=getComputedStyle(e); if(c.position!=='fixed'&&c.position!=='sticky')return;
     var t=(e.innerText||'').trim();
     if(/Made in Framer|Create a free website|Get it for FREE/i.test(t) && e.offsetParent!==null){ e.style.setProperty('display','none','important'); }
   });
 }
 function frame(){
   ensure(); var e=cta(); if(!e){requestAnimationFrame(frame);return;}
   var r=e.getBoundingClientRect(), ih=innerHeight;
   topM.style.height=Math.max(0,Math.ceil(r.top))+'px';                 /* cover everything above the section */
   var below=Math.max(0,Math.ceil(ih-r.bottom));
   botM.style.top=(ih-below)+'px'; botM.style.height=below+'px';        /* cover everything below the section */
   requestAnimationFrame(frame);
 }
 function report(){var e=cta();if(!e)return;hidePromo();try{parent.postMessage({roCta:1,ctaTop:Math.round(e.offsetTop),ctaH:Math.round(e.getBoundingClientRect().height),ih:innerHeight},'*');}catch(_){}}
 function boot(){ensure();requestAnimationFrame(frame);hidePromo();}
 if(document.readyState!=='loading')boot();else addEventListener('DOMContentLoaded',boot);
 addEventListener('load',report); addEventListener('resize',report);
 [120,400,900,1600,2600].forEach(function(t){setTimeout(report,t)});
 setInterval(report,800);
})();
</script>
```

### 4b. Parent — `<style id="ro-cta-css">` before `</head>` and `<script id="ro-cta-js">` before `</body>` of our `index.html`

```html
<style id="ro-cta-css">
#ro-cta-embed{position:relative;width:100%;background:#fff}
#ro-cta-scroll{position:relative;width:100%;min-height:100svh}
#ro-cta-pin{position:sticky;top:0;height:100svh;width:100%;overflow:hidden;background:#fff}
#ro-cta-frame{display:block;width:100%;height:100svh;border:0;background:#fff;pointer-events:none}
</style>
```
```html
<script id="ro-cta-js">(function(){
 var WRAP="ro-cta-embed";
 function wire(scroll,frame){
   var ctaTop=0,runway=1,ready=false;
   window.addEventListener("message",function(ev){var d=ev.data;if(!d||!d.roCta)return;
     ctaTop=d.ctaTop;var ih=d.ih,ctaH=d.ctaH;runway=Math.max(1,ctaH-ih);
     scroll.style.height=(runway+ih)+"px";ready=true;onScroll();});
   function onScroll(){if(!ready)return;var r=scroll.getBoundingClientRect();
     var p=(-r.top)/runway;if(p<0)p=0;if(p>1)p=1;
     try{frame.contentWindow.scrollTo(0,Math.round(ctaTop+p*runway));}catch(e){}}
   var t=false;function loop(){if(!t){t=true;requestAnimationFrame(function(){onScroll();t=false;});}}
   window.addEventListener("scroll",loop,{passive:true});
   window.addEventListener("resize",loop,{passive:true});
   frame.src="cta-embed/index.html";
 }
 function build(){if(document.getElementById(WRAP))return true;
   var a=document.querySelector('section[data-framer-name="Quote Section"]')||document.querySelector('section[data-framer-name="Pricing Section"]');
   if(!a||!a.parentNode)return false;
   var sec=document.createElement("section");sec.id=WRAP;
   var scroll=document.createElement("div");scroll.id="ro-cta-scroll";
   var pin=document.createElement("div");pin.id="ro-cta-pin";
   var frame=document.createElement("iframe");frame.id="ro-cta-frame";
   frame.title="RideOut";frame.setAttribute("scrolling","no");frame.loading="lazy";
   pin.appendChild(frame);scroll.appendChild(pin);sec.appendChild(scroll);
   a.parentNode.insertBefore(sec,a.nextSibling);wire(scroll,frame);return true;}
 function start(){var n=0,iv=setInterval(function(){if(build()||++n>60)clearInterval(iv);},250);}
 if(document.readyState==="complete")setTimeout(start,400);else window.addEventListener("load",function(){setTimeout(start,400);});
})();</script>
```

For each new section: rename the ids (`ro-<sec>-*`), the section selector (`.framer-XXXX`),
the iframe `src` (`<name>-embed/index.html`), and the anchor section to insert after.

### 4c. MIME-correct static server — `tools/serve.py`

```
python3 tools/serve.py <port> <dir>
```
Serves `.mjs/.js` as `text/javascript` so the Framer runtime boots locally (Vercel already
does this in production; Python's default `http.server` does NOT).

---

## 5. Hard-won gotchas — NEVER repeat these

1. **`overflow-x:hidden` on `html`/`body` breaks `position:sticky`.** The section's sticky
   content stops pinning and the whole composition lands ~hundreds of px off. Symptom:
   embed looks "scrolled up" vs the live site. → Don't set it on the iframe root.
2. **The template nav is `position:relative` (in flow, ~124px tall).** Hiding it with
   `display:none` shifts every absolute scroll position by 124px, so the same scroll offset
   renders differently than live. → Hide the nav with **`visibility:hidden`** (keeps its
   flow space). Verify by comparing a known element's viewport `top` to live at the same
   `scrollY` — they must match exactly.
3. **Don't isolate by `display:none`-ing the other sections.** It breaks the entrance
   animation's "arming" (the reveal snaps straight to its final state at load). → Keep ALL
   sections in the DOM (real offsets), hide only nav/footer/overlay/badge, and show "only
   the section" via the **white masks** + the scroll-scrub.
4. **The entrance only arms when the section is genuinely far below the fold at load**
   (its natural offset, e.g. ~11810px) and plays on **gradual** scroll-in. **Jumping**
   directly to it produces weird mid-states. → The scrub feeds many small `scrollTo`s =
   gradual = correct.
5. **Never prune images by "what loaded at one viewport/DPR".** Each image has multiple
   `srcset` variants (e.g. `*.png 669w` + `*.png 1046w`); wide screens / retina request the
   larger ones. Pruning the "unused" ones broke the phone at ~2000px (404 → broken-image
   icon). → **Keep every image variant the localizer produced.** Only delete the big
   `assets/media/*.mp4` videos (hidden sections, never shown).
6. **You can't always "cap the scroll early" to hide a problem at the end** — later parts of
   the composition (e.g. the QR block) only reveal late in the scroll. → If something needs
   fixing at the *final* framed state, **bake the fix into the asset** so it tracks the
   element at every scroll position (we baked a cloud onto the phone image to cover the
   forearm cutoff; it follows the phone the whole way).
7. **`pkill -f "http.server"` matches its own shell** → exit 144 kills your command. Don't.
   Use unique ports and `run_in_background`.
8. **Don't name a temp script after a stdlib module** (e.g. `/tmp/struct.py`) — Python adds
   the script's dir to `sys.path[0]` and it shadows the stdlib, breaking imports (Pillow
   failed to import `struct`). Clean up such files.
9. **The Vercel preview is behind deployment protection (401)** — you cannot headless it.
   Verify locally with `tools/serve.py` (production-equivalent MIME, same-origin) and let
   the user open the preview. The session's Vercel MCP token is 403'd from the team too.
10. **A pasted image is not a file on disk.** The user's "Downloads" path is on *their*
    machine, not the container. The image lives as base64 in the session transcript
    (`~/.claude/projects/<proj>/<session>.jsonl`) — extract the most recent `image` block's
    `source.data` and `base64 -d` it. (Framer-style uploads land in `~/.claude/uploads/...`.)
11. **`check-assets.mjs` scans every sub-dir** for `assets/<dir>/...` refs and fails on
    missing ones; the vendored embed references `assets/...` relative to *itself*. → Add the
    embed dir to `SKIP_DIRS`.
12. **Run `node scripts/check-assets.mjs` from the repo root** (`ROOT=process.cwd()`); from a
    sub-dir it reports `Checked 0` and looks falsely green.

---

## 6. Verification checklist (the gate before committing)

Run headless against `tools/serve.py` for **both** the embed page and our `index.html`:

- [ ] **No asset 4xx** during a full scrub at **1920@1x, 1920@2x, 1280@2x, 390@3x**
      (only the intentionally-dropped `*.mp4` may 404).
- [ ] **Pixel-match vs live**: at the same `scrollY`, a known element (heading `<h2>`, phone)
      sits at the **same viewport `top`** as `https://<template>.framer.website`.
- [ ] **Reveal plays** on gradual scroll (clouds → phone rises → QR), desktop **and** mobile
      (the real runtime renders the correct breakpoint variant — this is what fixed the old
      "everything stacked to 35000px" bug).
- [ ] **Final framed state** looks intentional (no exposed cutoffs/edges).
- [ ] **Rest of our site is untouched**: all our sections present, our footer after the
      embed, our nav intact.
- [ ] `node scripts/check-assets.mjs` (from root) → ✅.

---

## 7. How the Framer animations actually work (reference)

- **Optimized appear** (above-the-fold load animations, e.g. the hero): a self-contained
  inline `<script>var animator=(()=>{…})()</script>` (~11KB) exposing
  `{animateAppearEffects, startOptimizedAppearAnimation, getActiveVariantHash, spring}`,
  fed by `<script type="framer/appear" id="__framer__appearAnimationsContent">` +
  `__framer__breakpoints`, applied to elements carrying `data-framer-appear-id`. **Not** what
  the CTA uses.
- **The CTA-type reveal** is the declarative **`data-nce-*`** layer driven by React/
  framer-motion at runtime:
  - `data-nce-scroll` + `data-nce-initial-transform` → scroll-triggered entrance (spring,
    soft: `stiffness:20`-ish).
  - `data-nce-scroll-link` + `…-from`/`…-to` → continuous scroll-linked parallax.
  - `data-nce-mouse-follow` + `…-x/y-from`/`…-to` → mouse parallax on the clouds.
  There is **no** standalone runtime to lift for these — only the real React app reproduces
  them. That's exactly why we run the real section in an iframe.

---

## 8. Definition of done / the user's standing preferences

- **"Jag ska inte se en enda pixel skillnad."** Pixel-identical to the source. Real code,
  **never a mock-up/approximation.**
- **"Du ska inte bara ta bort allt annat."** Keep all localized assets; never break the rest
  of our site.
- **"Ingen navbar … Vår hemsida är ju vår hemsida."** No template chrome — our nav/sections/
  footer stay ours; the embed shows only the one section.
- **Verify before showing.** ("Verify your work before you give me these disasters.") Always
  headless-screenshot and check, especially mobile, before reporting.
- **One section per round, preview only** (this branch / draft PR), not `main`, until the
  user approves.
- **Improvements are welcome** as long as the base section stays pixel-identical (we swapped
  the phone screen and covered the wrist cutoff — the section itself is unchanged).
- **Don't ask how to do it next time** — use this method ("D-sättet").

---

## 9. Improvements log (examples of "identical base + small upgrade")

- **Swapped the phone mockup** to the user's "General info" hand+phone. The source was a
  transparent cut-out; cropped to content and padded to the slot's aspect (**0.654**), phone
  aligned to top so the screen stays above the cloud band. Applied to **both** srcset
  variants (`Yxyz…291e1a.png` 669w + `Yxyz…0230d4.png` 1046w). Screen will be replaced with
  the real RideOut app UI once the app is ready.
- **Covered the forearm cutoff** at the final scroll state by **baking the scene's own fluffy
  cloud (`vK…`) + an alpha feather onto the phone image** at the wrist — so the hand emerges
  from a cloud at every scroll position. (Capping the scrub didn't work: the QR only reveals
  in the late scroll.)

---

## 10. Tooling reference

- `tools/localize-template.py` — localizes a hotlinked Framer export (downloads everything,
  recurses `.mjs` imports, rewrites to local, neutralizes endpoints). Set `ROOT`/`SITE_BASE`.
- `tools/serve.py` — MIME-correct static server for local verification.
- Playwright: `/tmp/node_modules` (install with `npm i playwright` there if gone), chromium at
  `/opt/pw-browsers` (`PLAYWRIGHT_BROWSERS_PATH` is set). Launch `--ignore-certificate-errors`,
  context `{ignoreHTTPSErrors:true}`. Image editing: `pip install Pillow`.
- `templates-source/*.zip` — the source exports. `cta-embed/` — the shipped CTA embed.
- Preview URL: `https://rideout-site-git-claude-epic-di-06bdd3-clawmax12-langs-projects.vercel.app`
  (behind Vercel auth — user-viewable, not headless-able).

---

## 11. Session-2 addenda (more hard-won lessons)

**Container recycling (important).** The cloud container recycles between turns. When
it does: `/tmp` is wiped (working copies, Playwright scripts, extracted images all
gone) and the repo working tree resets to a **stale** commit. Recover with:
```
git fetch origin <branch> main
git reset --hard origin/<branch>      # working tree was clean = safe
```
Then re-create `/tmp` working copies from committed sources (re-run the localizer on the
committed zip; re-`tools/serve.py`). **Commit + push frequently** so nothing is ever only
in `/tmp`. The uploads dir (`~/.claude/uploads/...`) persists across recycles; `/tmp` does not.

**`main` diverges under you.** Other sessions/people push to `main` (e.g. an efterfest
video swap; a `check-assets.mjs` tweak). Before pushing to main: `git fetch origin main`;
if `git merge-base --is-ancestor origin/main HEAD` is false, `git merge origin/main` first
(different files → clean merge), then push. Never force-push main.

**Font swaps (subheading/buttons/headings).** Find the target font via the *computed*
`font-family` of the site's buttons/body (Playwright). Self-host the woff2:
- a *new* font (e.g. **Boldonse**): grab the Google Fonts CSS with a Chrome UA to get the
  gstatic woff2 URLs (latin + latin-ext), download into `<embed>/assets/fonts/`.
- a font we *already* use (e.g. **Geist**): copy our own `assets/fonts/*.woff2` into the embed.
Add `@font-face` (with the real unicode-ranges) and override the Framer style preset, e.g.
`section.<sec> .framer-styles-preset-XXXX{font-family:'Geist'!important}`. Find the preset
class from the element's `className` (`framer-styles-preset-…`). **Display faces need air:**
Boldonse all-caps overlapped/squashed at `line-height:1.08; letter-spacing:-0.01em` — use
`line-height:~1.45; letter-spacing:+0.02em`. Use `clamp()` for size so it fits desktop +
mobile. Only weight 400 exists for Boldonse → set `font-weight:400` to avoid synthetic bold.

**Recolour the background to match our site.** Sample the target colour (e.g. hero
`getComputedStyle(hero).backgroundColor` → our sky-blue `#98cdea`). Recolour html/body +
the Framer root wrappers behind the section (`.framer-MBuSv`, `.framer-P7IPm` for habitline)
+ the edge masks + the parent scrubber containers — otherwise white shows through.

**Scroll-tie an element's opacity.** A cloud/element that looks wrong *at rest* on the new
bg (e.g. a wide flat cloud band that was invisible on white) → fade it in with scroll:
in the embed rAF loop compute `p = clamp(-sectionRect.top/(ctaH-ih),0,1)` and set the
element's `opacity` so it builds up as the reveal progresses.

**The localizer's `new URL` bug.** The localizer rewrites absolute asset URLs to *relative*
paths; code doing `new URL('./x.framercms', '<relative>')` then throws "Invalid base URL".
On habitline this only broke the CMS (caught, harmless). On **echo** it bubbled up as
"Made UI non-interactive due to an error" — breaking accordion/carousel/appear. When
implementing an *interactive* component self-owned, fix it: find the chunk doing
`new URL(rel, badBase)` and give it an absolute base (e.g. `document.baseURI`) or neutralize
the collection loader. (For static/visual borrowing, SSR still renders fine.)

**Pasted images aren't files.** A user-pasted image lives as base64 in the transcript
(`~/.claude/projects/<proj>/<session>.jsonl`, the last `image` content block); decode it.
The user's "Downloads"/local path is NOT reachable from the container.

## 12. Borrowing *details* (not whole sections) — organization

When the goal is to borrow components/animations (not iframe a whole section):
- **Source** zip → `templates-source/<name>-pageexport.zip` (committed; the localized copy
  is always re-derivable from it, so it need not be committed).
- **Catalog** → `docs/inspiration/<name>/README.md` (committed): what the site is, the
  borrowable components/animations, localization status, and any gotchas.
- **Localize** for exploration → `/tmp/<name>-local` (re-derive after recycles).
- **Implement** only the chosen components, **self-owned**, into our site — committing just
  those assets. Keep the repo clean; don't commit a whole localized template we only sample.
