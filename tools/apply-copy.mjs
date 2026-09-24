#!/usr/bin/env node
/**
 * Applies tools/copy-map.json onto the PRISTINE files from origin/main (never onto whatever
 * is currently on disk), so repeated iteration never compounds edits and "old" always means
 * the original text. Refuses to write anything if any occurrence count doesn't match what's
 * recorded in the map, so a partially-applied or over-applied change fails loudly instead of
 * shipping silently wrong.
 *
 * Usage: node tools/apply-copy.mjs [--base <git-ref>]   (default base: origin/main)
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const BASE = baseIdx >= 0 ? args[baseIdx + 1] : 'origin/main';

const map = JSON.parse(readFileSync(new URL('./copy-map.json', import.meta.url)));

function pristine(path) {
  return execFileSync('git', ['show', `${BASE}:${path}`], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 50 });
}

function countOccurrences(haystack, needle) {
  if (needle === '') return 0;
  let n = 0, i = 0;
  while ((i = haystack.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
  return n;
}

function replaceAll(haystack, oldStr, newStr) {
  return haystack.split(oldStr).join(newStr);
}

// Gather every file touched, load pristine content once each.
const files = new Set();
for (const e of map.simple) Object.keys(e.files).forEach((f) => files.add(f));
for (const e of map.anchored) Object.keys(e.files).forEach((f) => files.add(f));

const content = {};
for (const f of files) content[f] = pristine(f);

// Verify every expected count BEFORE writing anything.
const problems = [];
for (const e of map.simple) {
  for (const [f, expected] of Object.entries(e.files)) {
    const got = countOccurrences(content[f], e.old);
    if (got !== expected) problems.push(`[${e.id}] ${f}: expected ${expected} occurrence(s) of old text, found ${got}`);
  }
}
for (const e of map.anchored) {
  for (const [f, spec] of Object.entries(e.files)) {
    const got = countOccurrences(content[f], spec.old);
    if (got !== spec.count) problems.push(`[${e.id}] ${f}: expected ${spec.count} occurrence(s) of anchor, found ${got}`);
  }
}
if (problems.length) {
  console.error('REFUSING TO APPLY — occurrence counts do not match copy-map.json:\n');
  problems.forEach((p) => console.error('  ' + p));
  console.error('\nEither the pristine base has drifted from what the map was written against,');
  console.error('or a string in the map is no longer accurate. Fix the map, do not force-apply.');
  process.exit(1);
}

// All checks passed — apply.
for (const e of map.simple) {
  for (const f of Object.keys(e.files)) content[f] = replaceAll(content[f], e.old, e.new);
}
for (const e of map.anchored) {
  for (const spec of Object.values(e.files)) {
    // Re-read from content[f] via closure below (files map already updated above per-entry order
    // doesn't matter since anchors are disjoint from simple entries and from each other).
  }
}
for (const e of map.anchored) {
  for (const [f, spec] of Object.entries(e.files)) {
    content[f] = replaceAll(content[f], spec.old, spec.new);
  }
}

for (const f of files) writeFileSync(f, content[f], 'utf8');

console.log(`Applied ${map.simple.length} simple + ${map.anchored.length} anchored change(s) across ${files.size} file(s), from ${BASE}:`);
for (const f of files) console.log('  ' + f);
