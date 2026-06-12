#!/usr/bin/env node
/**
 * Objective performance harness for the RideOut site — the spine of the /review loop.
 *
 * Headless verification gives FALSE GREENS on perceptual/iOS bugs (proven the hard
 * way: every jank caught tonight passed automated checks). So this measures only what
 * a machine can measure HONESTLY: main-thread blocking under CPU throttle, plus an
 * estimate of dropped frames during a scripted scroll. It buckets long tasks by the
 * scroll position where they fired, so "the app section stutters" becomes a number.
 *
 * It does NOT — and cannot — verify iOS compositor/paint correctness. Those stay
 * human-device-review items. This catches main-thread regressions, which is most of
 * what makes a page "feel laggy".
 *
 * Usage:
 *   node tools/perf-audit.mjs --url http://localhost:8773/index.html --device mobile --throttle 4
 *   node tools/perf-audit.mjs --device desktop            (defaults: local serve, throttle 4)
 *   node tools/perf-audit.mjs --json /tmp/perf.json       (also write machine-readable result)
 *
 * Exit code 0 = within budget, 1 = budget exceeded (so the loop can gate on it).
 *
 * Requires Playwright in NODE_PATH (this repo uses /tmp/node_modules) and
 * PLAYWRIGHT_BROWSERS_PATH set. See tools/serve.py for the dev server.
 */
import { writeFileSync } from "node:fs";
// Resolve Playwright whether it's a normal project dep or vendored in this
// ephemeral container (/tmp/node_modules). ESM ignores NODE_PATH, hence the fallback.
let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = await import("/tmp/node_modules/playwright/index.mjs")); }

const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const URL = arg("url", "http://localhost:8773/index.html");
const DEVICE = arg("device", "mobile");
const THROTTLE = parseFloat(arg("throttle", "4"));
const JSON_OUT = arg("json", "");

// Budgets — calibrated from the 2026-06-12 baseline (mobile TBT 6894 / desktop 3351 at 4x)
// to "meaningfully smoother and reachable". Much of the floor is Framer's own page
// hydration; we ratchet these DOWN as we claw cost back. A reachable finish line, not a
// vanity target.
const BUDGET = {
  mobile: { tbt: 2500, longest: 550, longTasks: 42, jank50: 55 },
  desktop: { tbt: 1500, longest: 450, longTasks: 28, jank50: 32 },
}[DEVICE];

const VIEW = DEVICE === "mobile"
  ? { width: 390, height: 760, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
  : { width: 1440, height: 900, deviceScaleFactor: 1 };

const browser = await chromium.launch({ args: ["--ignore-certificate-errors"] });
const ctx = await browser.newContext({ ...VIEW, ignoreHTTPSErrors: true });
const page = await ctx.newPage();

// CPU throttle via CDP — emulate a slower device so main-thread cost is visible.
const cdp = await ctx.newCDPSession(page);
if (THROTTLE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });

// Collect long tasks (>50ms) and rAF frame intervals from inside the page.
await page.addInitScript(() => {
  window.__perf = { tasks: [], frames: [], marks: [] };
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        window.__perf.tasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration), y: window.scrollY });
    }).observe({ entryTypes: ["longtask"] });
  } catch (e) {}
  let last = performance.now();
  (function tick(t) {
    window.__perf.frames.push({ gap: Math.round((t - last) * 10) / 10, y: window.scrollY });
    last = t;
    requestAnimationFrame(tick);
  })(last);
});

await page.goto(URL, { waitUntil: "load", timeout: 45000 });
// Let hydration + deferred iframes arm before we judge anything.
await page.waitForTimeout(3000);

// Scripted scroll: small steps at a realistic cadence, all the way down then a bit back.
// Pausing briefly in each section gives the lazy iframes a chance to load where the user
// would actually be when the jank hits.
const H = await page.evaluate(() => document.body.scrollHeight);
const step = Math.round(VIEW.height * 0.18); // ~realistic flick granularity
await page.evaluate(() => (window.__perf.t0 = performance.now()));
for (let y = 0; y <= H; y += step) {
  await page.evaluate((v) => scrollTo(0, v), y);
  await page.waitForTimeout(40);
}
await page.waitForTimeout(600);
// scroll back up through the heavy middle once (re-entry is where teleports showed up)
for (let y = H; y >= 0; y -= step * 2) {
  await page.evaluate((v) => scrollTo(0, v), y);
  await page.waitForTimeout(30);
}
await page.waitForTimeout(400);

// Pull section anchors so we can attribute jank to the section the user named.
const anchors = await page.evaluate(() => {
  const pos = (sel) => { const e = document.querySelector(sel); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
  return {
    app: pos("#ro-app-scroll"),
    manifesto: pos("#ro-manifesto"),
    cta: pos("#ro-cta-scroll"),
    docH: document.body.scrollHeight,
  };
});

const perf = await page.evaluate(() => window.__perf);
await browser.close();

// ---- analysis ----
const tasks = perf.tasks.filter((t) => t.dur >= 50);
const tbt = Math.round(tasks.reduce((s, t) => s + (t.dur - 50), 0));
const longest = tasks.reduce((m, t) => Math.max(m, t.dur), 0);
const frames = perf.frames.filter((f) => f.gap > 0 && f.gap < 2000);
const jank50 = frames.filter((f) => f.gap > 50).length;   // ~3+ frames dropped at 60fps
const jank100 = frames.filter((f) => f.gap > 100).length;  // visible hitch

const sectionName = (y) => {
  const a = anchors, vh = VIEW.height;
  if (a.app != null && y >= a.app - vh && y <= a.app + (a.manifesto != null ? a.manifesto : a.docH)) {
    if (a.manifesto != null && y >= a.manifesto - vh) {
      if (a.cta != null && y >= a.cta - vh) return "cta";
      return "manifesto";
    }
    return "app-section";
  }
  if (a.cta != null && y >= a.cta - vh) return "cta";
  return "other";
};
const bySection = {};
for (const t of tasks) {
  const s = sectionName(t.y);
  bySection[s] = bySection[s] || { count: 0, blocking: 0, longest: 0 };
  bySection[s].count++;
  bySection[s].blocking += t.dur - 50;
  bySection[s].longest = Math.max(bySection[s].longest, t.dur);
}

const fails = [];
if (tbt > BUDGET.tbt) fails.push(`TBT ${tbt}ms > ${BUDGET.tbt}ms`);
if (longest > BUDGET.longest) fails.push(`longest task ${longest}ms > ${BUDGET.longest}ms`);
if (tasks.length > BUDGET.longTasks) fails.push(`long tasks ${tasks.length} > ${BUDGET.longTasks}`);
if (jank50 > BUDGET.jank50) fails.push(`frame gaps >50ms: ${jank50} > ${BUDGET.jank50}`);

const result = {
  url: URL, device: DEVICE, throttle: THROTTLE,
  totalBlockingTime: tbt, longestTask: longest, longTaskCount: tasks.length,
  frameGaps50: jank50, frameGaps100: jank100, framesObserved: frames.length,
  bySection, budget: BUDGET, pass: fails.length === 0, fails,
};

console.log(`\n  PERF AUDIT — ${DEVICE} @ ${THROTTLE}x CPU throttle`);
console.log(`  ${URL}`);
console.log(`  ──────────────────────────────────────────────`);
console.log(`  Total Blocking Time : ${tbt}ms   (budget ${BUDGET.tbt})`);
console.log(`  Longest task        : ${longest}ms   (budget ${BUDGET.longest})`);
console.log(`  Long tasks (>50ms)  : ${tasks.length}   (budget ${BUDGET.longTasks})`);
console.log(`  Frame gaps >50ms    : ${jank50}   (budget ${BUDGET.jank50})   |  >100ms: ${jank100}`);
console.log(`  ── by section (blocking ms / longest) ──`);
for (const [s, v] of Object.entries(bySection).sort((a, b) => b[1].blocking - a[1].blocking))
  console.log(`    ${s.padEnd(13)} ${String(Math.round(v.blocking)).padStart(5)}ms blocking, ${v.count} tasks, longest ${v.longest}ms`);
console.log(`  ──────────────────────────────────────────────`);
console.log(fails.length ? `  ❌ OVER BUDGET: ${fails.join(" · ")}` : `  ✅ within budget`);
console.log(`  NOTE: this measures main-thread cost only. iOS compositor/paint`);
console.log(`        correctness is NOT verified here — that stays a device check.\n`);

if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(result, null, 2));
process.exit(result.pass ? 0 : 1);
