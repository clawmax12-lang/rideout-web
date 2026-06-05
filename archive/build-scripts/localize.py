#!/usr/bin/env python3
"""
Localize a hotlinked Framer export into a fully self-contained, offline site.
- Downloads every asset from framerusercontent.com + fonts.gstatic.com (recursing into .mjs/.json)
- Downloads the on-demand Phosphor social icons + their real modules
- Rewrites references with correct resolution:
    * module->module imports  -> module-relative (./x.mjs)  (resolve against importer URL)
    * DOM/data assets         -> root-relative (assets/...)  (resolve against document base)
- Neutralizes every runtime external endpoint (phosphor base, editor init, form submit, Google Maps)
- Strips preconnect/dns-prefetch (they open real external connections)
"""
import os, re, hashlib, html as htmllib, concurrent.futures, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(ROOT, "assets")
DIRS = {k: os.path.join(ASSETS, v) for k, v in {
    "img": "img", "fonts": "fonts", "media": "media",
    "scripts": "scripts", "data": "data", "misc": "misc",
}.items()}
PHOSPHOR_DIR = os.path.join(DIRS["scripts"], "m", "phosphor-icons")
for d in list(DIRS.values()) + [PHOSPHOR_DIR]:
    os.makedirs(d, exist_ok=True)

# Phosphor social icons discovered via live network audit (lazy-loaded by the footer)
PHOSPHOR_SEEDS = [f"https://framer.com/m/phosphor-icons/{n}.js@0.0.57"
                  for n in ("FacebookLogo", "XLogo", "LinkedinLogo", "InstagramLogo")]

URL_RE = re.compile(r'https://(?:framerusercontent\.com|fonts\.gstatic\.com)/[^\s"\'`)(<>\\,]+')
# Framer code-split chunks import each other by RELATIVE specifier (./name.mjs); reconstruct
# their absolute URL from the site base so every lazily-imported chunk gets downloaded too.
SITE_BASE = "https://framerusercontent.com/sites/65ZpmPZkXAAywNAToqQcrN/"
SIBLING_RE = re.compile(r'["\'`]\.\/([A-Za-z0-9_.@-]+\.mjs)["\'`]')

EXT_DIR = {
    ".png": "img", ".jpg": "img", ".jpeg": "img", ".gif": "img",
    ".svg": "img", ".webp": "img", ".avif": "img", ".ico": "img",
    ".woff2": "fonts", ".woff": "fonts", ".ttf": "fonts", ".otf": "fonts", ".eot": "fonts",
    ".mp4": "media", ".webm": "media", ".mov": "media", ".m4v": "media",
    ".mjs": "scripts", ".js": "scripts", ".json": "data",
}
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "Referer": "https://eventin.framer.website/"}

def split_url(u):
    p, _, q = u.partition("?")
    return p, q

def is_phosphor_shim(u):  return "/m/phosphor-icons/" in u
def is_phosphor_module(u): return "framerusercontent.com/modules/" in u
def is_module_url(u):
    return is_phosphor_shim(u) or is_phosphor_module(u) or split_url(u)[0].endswith(".mjs")

def local_path_for(u):
    path, query = split_url(u)
    base = path.rsplit("/", 1)[-1]
    if is_phosphor_shim(u):                       # keep EXACT name (main.mjs imports it verbatim)
        return os.path.join(PHOSPHOR_DIR, base)   # e.g. FacebookLogo.js@0.0.57
    stem, dot, ext = base.rpartition(".")
    ext = ("." + ext).lower() if dot else ""
    if is_phosphor_module(u):                     # real icon module -> live beside the shims
        h = hashlib.md5(path.encode()).hexdigest()[:6]
        return os.path.join(PHOSPHOR_DIR, f"{stem}.{h}.js")
    cat = EXT_DIR.get(ext, "misc")
    if ext == ".mjs":
        return os.path.join(DIRS["scripts"], base)        # siblings import each other by basename
    if query:
        qh = hashlib.md5(query.encode()).hexdigest()[:6]
        return os.path.join(DIRS[cat], f"{stem or base}.{qh}{ext}")
    return os.path.join(DIRS[cat], base)

url_map, seen, failures = {}, set(), []

def fetch(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60) as r:
            return r.read()
    except Exception as e:                                  # noqa
        failures.append((u, str(e)))
        return None

def discover(text):
    out = set()
    for m in URL_RE.findall(text):
        u = htmllib.unescape(m.rstrip(".,'\"`)\\"))
        if split_url(u)[0].rsplit("/", 1)[-1]:             # must be a file, not a bare origin
            out.add(u)
    return out

def process(html):
    queue = list(discover(html)) + PHOSPHOR_SEEDS
    seen.update(queue)
    while queue:
        batch, queue = queue, []
        with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
            for u, data in ex.map(lambda u: (u, fetch(u)), batch):
                if data is None:
                    continue
                lp = local_path_for(u)
                os.makedirs(os.path.dirname(lp), exist_ok=True)
                with open(lp, "wb") as f:
                    f.write(data)
                url_map[u] = lp
                if lp.lower().rsplit(".", 1)[-1] in ("mjs", "js", "json", "css") or is_phosphor_shim(u):
                    txt = data.decode("utf-8", "ignore")
                    nexts = discover(txt)
                    if lp.lower().endswith(".mjs"):       # follow relative sibling chunk imports
                        nexts |= {SITE_BASE + name for name in SIBLING_RE.findall(txt)}
                    for nu in nexts:
                        if nu not in seen:
                            seen.add(nu); queue.append(nu)

def ref_for(u, from_dir, is_module_file):
    L = url_map[u]
    if is_module_file and is_module_url(u):               # ES import -> resolve vs importer URL
        r = os.path.relpath(L, from_dir).replace(os.sep, "/")
        return r if r.startswith(".") else "./" + r
    return os.path.relpath(L, ROOT).replace(os.sep, "/")  # DOM/data -> resolve vs document base

def rewrite(content, from_dir, is_module_file):
    for u in sorted(url_map, key=len, reverse=True):
        ref = ref_for(u, from_dir, is_module_file)
        enc = u.replace("&", "&amp;")
        if u in content:
            content = content.replace(u, ref)
        if enc != u and enc in content:
            content = content.replace(enc, ref)
    return content

MAP_PLACEHOLDER = """<!doctype html><html><head><meta charset=utf-8><style>
html,body{margin:0;height:100%;display:grid;place-items:center;font-family:system-ui,sans-serif;
background:#e9eef2;color:#5b6770}div{text-align:center}b{font-size:15px}span{font-size:12px;opacity:.7}
</style></head><body><div>&#128205;<br><b>Map</b><br><span>Add your own embed (was Google Maps)</span></div></body></html>"""

def neutralize(text):
    text = text.replace("https://framer.com/m/phosphor-icons/", "./m/phosphor-icons/")
    text = text.replace("https://framer.com/edit/init.mjs", "./edit-init-disabled.mjs")
    text = text.replace("https://maps.google.com/maps", "assets/misc/map-placeholder.html")
    text = re.sub(r'https://api\.framer\.com/forms/v1/forms/[^\s"\'`]+/submit',
                  "#form-needs-your-own-backend", text)
    text = re.sub(r'https://[a-z0-9.]*formspree\.io/[A-Za-z0-9/_-]+',
                  "#form-needs-your-own-backend", text)
    return text

def main():
    html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    process(html)

    with open(os.path.join(DIRS["misc"], "map-placeholder.html"), "w") as f:
        f.write(MAP_PLACEHOLDER)

    # Local stand-in for framer.com/edit/init.mjs. main.mjs does:
    #   let {createEditorBar:e} = await import('./edit-init-disabled.mjs'); return {default:e()}
    # The Framer editor toolbar is irrelevant on a published/self-hosted site, so createEditorBar
    # returns a component that renders nothing (matches published behavior, no crash, no network).
    with open(os.path.join(DIRS["scripts"], "edit-init-disabled.mjs"), "w") as f:
        f.write("export const createEditorBar = () => () => null;\n"
                "export const init = () => {};\nexport default {};\n")

    # rewrite every downloaded text asset
    for u, lp in list(url_map.items()):
        ext = lp.lower().rsplit(".", 1)[-1]
        is_mod = ext in ("mjs", "js") or is_phosphor_shim(u)
        if ext in ("mjs", "js", "json") or is_phosphor_shim(u):
            d = os.path.dirname(lp)
            c = open(lp, encoding="utf-8", errors="ignore").read()
            nc = neutralize(rewrite(c, d, is_mod))
            if nc != c:
                open(lp, "w", encoding="utf-8").write(nc)

    # rewrite index.html
    html = rewrite(html, ROOT, False)
    html = re.sub(r'<link[^>]*rel="(?:preconnect|dns-prefetch)"[^>]*>', "", html)
    html = neutralize(html)
    # Remove the Framer template promo ("More Templates"/"GRAB IT NOW") + "Made in Framer" badge.
    # They are SSR'd AND re-hydrated by JS, so a first-paint CSS rule is the robust way to delete them.
    style = ('<style id="ncx-removed-widgets">/* Removed by request: Framer template promo + badge */'
             '.framer-karqbq,#__framer-badge-container{display:none!important}</style>')
    html = html.replace("</head>", style + "</head>", 1)
    open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(html)

    from collections import Counter
    cats = Counter(os.path.relpath(os.path.dirname(p), ASSETS) for p in url_map.values())
    print("=== DOWNLOADED ===")
    for c, n in sorted(cats.items()):
        print(f"  {n:4d}  assets/{c}/")
    print(f"  TOTAL: {len(url_map)} assets")
    print(f"\n=== {len(failures)} download failures ===")
    for u, e in failures[:30]:
        print(f"  {e}  {u}")

if __name__ == "__main__":
    main()
