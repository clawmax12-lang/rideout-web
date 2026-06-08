#!/usr/bin/env node
/**
 * Asset-integrity check for the RideOut marketing site.
 *
 * Scans the shipped text files (HTML / JS / CSS / JSON / SVG) for asset
 * references of the form `assets/<dir>/...<ext>` and fails if any referenced
 * file is missing on disk. Requiring a sub-directory after `assets/` skips
 * Framer's legacy root-path manifest strings (`assets/<hash>.woff2`, etc.),
 * which are not real load URLs.
 *
 * `archive/`, `.git/`, and `node_modules/` are excluded.
 *
 * Usage: node scripts/check-assets.mjs
 * Exit:  0 = all present, 1 = missing references found.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const TEXT = new Set([".html", ".htm", ".mjs", ".js", ".css", ".json", ".svg", ".webmanifest", ".xml"]);
// `cta-embed/` is a self-contained vendored Framer sub-site (its own assets/ tree,
// loaded only inside an iframe); its internal asset graph is not part of the main site.
const SKIP_DIRS = new Set([".git", "archive", "node_modules", ".github", "cta-embed"]);
// Longer/overlapping extensions first; the trailing boundary lookahead also
// prevents `.json` from matching as `.js`, `.jpeg` as `.jpg`, etc.
const EXT = "webmanifest|woff2|woff|jpeg|jpg|json|mjs|svg|png|gif|webp|avif|ico|mp4|webm|mov|m4v|ttf|otf|eot|css|txt|xml|js";
// require a sub-directory after `assets/` to skip legacy root-path manifest noise
const RE = new RegExp(`/?assets/[A-Za-z0-9_\\-]+/[A-Za-z0-9_\\-./]+?\\.(?:${EXT})(?![A-Za-z0-9])`, "gi");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (TEXT.has(extname(name).toLowerCase())) acc.push(p);
  }
  return acc;
}

const refs = new Set();
for (const file of walk(ROOT)) {
  const data = readFileSync(file, "utf8");
  for (const m of data.matchAll(RE)) {
    refs.add(m[0].replace(/^\//, "").split("?")[0].split("#")[0]);
  }
}

const missing = [...refs].filter((r) => !existsSync(join(ROOT, r))).sort();

console.log(`Checked ${refs.size} distinct asset reference(s).`);
if (missing.length) {
  console.error(`\n❌ ${missing.length} referenced asset(s) missing on disk:`);
  for (const m of missing) console.error("   - " + m);
  process.exit(1);
}
console.log("✅ All referenced assets are present.");
