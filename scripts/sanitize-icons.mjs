// Post-process the React Icon Exporter output so every icon follows
// the library's flat-outline convention:
//
//   1. Strip <defs>…</defs> blocks — filters + gradients baked into
//      individual icons (most are drop-shadow filters on cursors)
//      don't belong in a unified library.
//   2. Unwrap any <g filter="url(#…)">…</g> that referenced those
//      filters; keep the inner paths.
//   3. Replace `fill={color}` on the root <svg> with `fill="none"`
//      regardless of viewBox, so outline paths don't inherit a fill
//      that traps the region between strokes. Paths that genuinely
//      want to be filled already set `fill={color}` on themselves.
//
// Idempotent — re-running on an already-sanitized file is a no-op.

import { readFileSync, writeFileSync } from 'node:fs'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] ?? 'seed/icons'

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (p.endsWith('.tsx')) out.push(p)
  }
  return out
}

const files = walk(root)
let edited = 0

for (const file of files) {
  const before = readFileSync(file, 'utf-8')
  let after = before

  // 1. Strip every <defs>…</defs> block. The `[\s\S]` dance is a
  //    multiline match that works in JS regex (no `s` flag needed).
  after = after.replace(/<defs>[\s\S]*?<\/defs>/g, '')

  // 2. Unwrap <g filter="url(#…)">…</g>. Greedy-matching </g> in a
  //    single-group Figma export is safe — the exporter never nests
  //    <g> inside a filter wrapper.
  after = after.replace(
    /<g\s+filter="url\(#[^"]+\)">([\s\S]*?)<\/g>/g,
    '$1',
  )

  // 3. Root-level svg fill: replace `fill={color}` with `fill="none"`
  //    only on the <svg> tag itself. Path-level `fill={color}` stays.
  after = after.replace(
    /(<svg[^>]*?)fill=\{color\}/,
    '$1fill="none"',
  )

  if (after !== before) {
    writeFileSync(file, after, 'utf-8')
    edited++
  }
}

console.log(`sanitized ${edited} / ${files.length} icon files`)
