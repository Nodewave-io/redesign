// Bulk-import a folder of TSX components into the asset library.
//
// Designed for icon sets exported from Figma via the React Icon Exporter
// plugin: flat (or Figma-frame-nested) tree of `<Name>.tsx` files, each
// a forwardRef+memo wrapped SVG that takes `size` + `color` props.
// Every file becomes one `media_assets` row of kind='component'.
//
// Run via:
//   redesign seed                  (uses ./seed/icons/)
//   redesign seed /path/to/tsx
//   redesign seed --replace        (wipe existing kind=component first)
//
// Idempotent: if a row with the same name already exists the icon is
// skipped unless --replace is passed.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import {
  createAsset,
  deleteAsset,
  listAssets,
} from './db/repo.js'
import type { MediaAsset } from './db/types.js'

export type SeedOptions = {
  /** Directory to scan. Non-TSX files are ignored. */
  root: string
  /** If true, delete every existing component asset before importing. */
  replace?: boolean
  /** Called with each imported asset — lets the CLI print a progress
   *  line without the seed module owning stdout. */
  onProgress?: (kind: 'added' | 'skipped' | 'replaced', name: string, index: number, total: number) => void
}

export type SeedResult = {
  added: number
  skipped: number
  replaced: number
  total: number
}

export function seedIcons(opts: SeedOptions): SeedResult {
  const files = findTsxFiles(opts.root)
  if (files.length === 0) {
    throw new Error(`no .tsx files found under ${opts.root}`)
  }

  if (opts.replace) {
    // Clear existing components so re-running after tweaking the
    // source produces a clean library instead of growing forever.
    for (const a of listAssets('component')) deleteAsset(a.id)
  }

  // Build a name→row index of what's already in the DB so we can
  // idempotent-skip without N queries per icon.
  const existing = new Map<string, MediaAsset>()
  for (const a of listAssets('component')) existing.set(a.name, a)

  let added = 0
  let skipped = 0
  let replaced = 0
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const source = readFileSync(file, 'utf-8')
    const name = componentNameFromFile(file)
    const { categories, tags } = classify(name)
    const usage_notes = USAGE_NOTES

    if (existing.has(name) && !opts.replace) {
      skipped++
      opts.onProgress?.('skipped', name, i + 1, files.length)
      continue
    }

    createAsset({
      kind: 'component',
      name,
      description: 'Icon — accepts `size` and `color` props.',
      usage_notes,
      categories,
      tags,
      file_url: null,
      storage_path: null,
      mime_type: null,
      width: 24,
      height: 24,
      source_code: source,
    })
    if (existing.has(name)) {
      replaced++
      opts.onProgress?.('replaced', name, i + 1, files.length)
    } else {
      added++
      opts.onProgress?.('added', name, i + 1, files.length)
    }
  }

  return { added, skipped, replaced, total: files.length }
}

// ─── Helpers ───────────────────────────────────────────────────────

const USAGE_NOTES =
  'SVG icon component (24×24). Props: `size` (default 24), `color` ' +
  '(default currentColor — inherits the surrounding text color). ' +
  'Drop on any slide; tint with the `color` prop per slide theme.'

// Classify by name prefix so the Assets page has some structure
// beyond a single 800-item grid. Anything that doesn't hit a known
// prefix falls into the generic "icons" bucket — still searchable by
// name and the derived tags.
function classify(name: string): { categories: string[]; tags: string[] } {
  const words = splitPascal(name)
  const prefix = words[0].toLowerCase()
  // Common Figma-icon-set prefixes we want to surface as categories.
  // Order matters — first match wins so e.g. `ArrowLeftSquare` lands
  // in `arrows` not `squares`.
  const prefixToCategory: Record<string, string> = {
    arrow: 'arrows',
    arrows: 'arrows',
    chart: 'charts',
    chevron: 'arrows',
    cursor: 'cursors',
    cursors: 'cursors',
    document: 'documents',
    file: 'documents',
    folder: 'documents',
    calendar: 'time',
    clock: 'time',
    timer: 'time',
    alert: 'status',
    check: 'status',
    close: 'status',
    warning: 'status',
    info: 'status',
    bell: 'alerts',
    mail: 'communication',
    message: 'communication',
    chat: 'communication',
    phone: 'communication',
    user: 'users',
    users: 'users',
    profile: 'users',
    settings: 'controls',
    toggle: 'controls',
    sliders: 'controls',
    play: 'media',
    pause: 'media',
    stop: 'media',
    music: 'media',
    video: 'media',
    camera: 'media',
    image: 'media',
    photo: 'media',
    heart: 'social',
    star: 'social',
    share: 'social',
    like: 'social',
    home: 'navigation',
    menu: 'navigation',
    search: 'navigation',
    filter: 'navigation',
    map: 'navigation',
    location: 'navigation',
    pin: 'navigation',
    shop: 'commerce',
    cart: 'commerce',
    bag: 'commerce',
    credit: 'commerce',
    wallet: 'commerce',
    dollar: 'commerce',
  }
  const category = prefixToCategory[prefix] ?? 'icons'
  const categories = [category, 'icons']
  // Deduplicate while keeping order.
  const seen = new Set<string>()
  const uniq = categories.filter((c) => (seen.has(c) ? false : (seen.add(c), true)))
  // Lowercase name words as tags so substring search works against
  // user prompts like "find a downward arrow" → matches 'arrow','down'.
  const tags = words.map((w) => w.toLowerCase())
  return { categories: uniq, tags }
}

function splitPascal(name: string): string[] {
  // "ArrowCurveLeftDown" → ["Arrow","Curve","Left","Down"]. Handles
  // runs of capitals (e.g. "IDCard" → ["ID","Card"]) by the standard
  // look-ahead pattern.
  return name.match(/[A-Z][a-z]*|[A-Z]+(?=[A-Z])|[0-9]+/g) ?? [name]
}

function componentNameFromFile(file: string): string {
  return basename(file, extname(file))
}

function findTsxFiles(root: string): string[] {
  const out: string[] = []
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry)
      const s = statSync(p)
      if (s.isDirectory()) walk(p)
      else if (s.isFile() && p.endsWith('.tsx') && !p.endsWith('index.tsx')) out.push(p)
    }
  }
  walk(root)
  // Deterministic order — alphabetical by full path — so progress
  // output is predictable across runs.
  return out.sort()
}
