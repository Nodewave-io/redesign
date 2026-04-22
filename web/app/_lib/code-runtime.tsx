'use client'

// Runtime for evaluating user / Claude provided TSX snippets.
//
// The authoring model: a code layer's `source` is a single JSX
// expression (not a component, not a function). Examples:
//
//   <div style={{ color: 'white', fontSize: 80 }}>Hello</div>
//
//   <motion.div animate={{ opacity: 1 }} ... />
//
// We transpile with @babel/standalone, then evaluate inside a
// Function with a curated scope: React primitives plus a small set
// of libraries we preload. No imports inside the snippet — the
// whitelist below is everything that's reachable.
//
// This runs in the live editor AND on the puppeteer render route,
// so the browser preview is byte-identical to the PNG export.

import * as React from 'react'
import * as FramerMotion from 'framer-motion'
import * as Lucide from 'lucide-react'
import clsx from 'clsx'

type Babel = typeof import('@babel/standalone')
let babelCache: Babel | null = null
async function getBabel(): Promise<Babel> {
  if (babelCache) return babelCache
  babelCache = await import('@babel/standalone')
  return babelCache
}

/** Everything the snippet has access to as a global.
 *  We expose React's named hooks directly (useState, useEffect, …) so
 *  21st-dev / magicui-style components that `import { useState } from
 *  "react"` work after our import-stripping pass. We deliberately
 *  drop React's own `default` key — it's a reserved JS keyword and
 *  would crash `new Function(...)`.
 */
const { default: _reactDefault, ...reactNamed } = React as Record<string, unknown> & {
  default?: unknown
}

const SCOPE: Record<string, unknown> = {
  React,
  ...reactNamed,
  motion: FramerMotion.motion,
  AnimatePresence: FramerMotion.AnimatePresence,
  Icons: Lucide,
  cn: clsx,
  clsx,
}

type CompiledNode = { ok: true; node: React.ReactNode } | { ok: false; error: string }

const DEBUG = typeof window !== 'undefined'

// A source snippet can take one of two shapes:
//
//  A. **JSX expression** — the whole thing evaluates to a node:
//     `<div style={{...}}>hello</div>`
//     Good for static compositions.
//
//  B. **Component module** — one or more statements, usually a
//     function + an `export default`. Full React with hooks, state,
//     framer-motion, lucide icons, etc:
//     ```
//     function Card() {
//       const [n, setN] = useState(0)
//       return <div>{n}</div>
//     }
//     export default Card
//     ```
//     Anything from 21st.dev / magicui fits here. We wrap the module
//     body in an IIFE, capture the default export (or the last
//     declared function / const), then React-render it so hooks fire.
//
// Detection rule: if (after trimming imports / `"use client"`) the
// source starts with `<`, we treat it as (A). Otherwise (B).

function stripPrelude(source: string): string {
  return source
    .replace(/^\s*"use client";?\s*/m, '')
    .replace(/^\s*'use client';?\s*/m, '')
    .replace(/^\s*import[^;]+;?\s*/gm, '')
    .trim()
}

/** Transpile + evaluate either a JSX expression or a component module. */
export async function compileSource(source: string): Promise<CompiledNode> {
  const original = (source ?? '').trim()
  if (!original) return { ok: true, node: null }
  try {
    const babel = await getBabel()
    const stripped = stripPrelude(original)
    const isExpression = stripped.startsWith('<')

    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('[nw-code] compile')
      // eslint-disable-next-line no-console
      console.log('MODE:', isExpression ? 'expression' : 'component')
      // eslint-disable-next-line no-console
      console.log('SOURCE:\n', original)
    }

    // Always transpile with script mode + classic runtime — we eval
    // via `new Function`, which doesn't support ESM.
    const transform = (code: string) =>
      babel.transform(code, {
        sourceType: 'script',
        filename: 'snippet.tsx',
        presets: [
          ['typescript', { isTSX: true, allExtensions: true }],
          ['react', { runtime: 'classic' }],
        ],
      }).code ?? ''

    let fnBody: string
    if (isExpression) {
      // Wrap in parens so a top-level JSX element is parsed as an
      // expression rather than a labeled statement.
      const out = transform(`(${stripped})`)
      const body = out
        .replace(/^\s*"use strict";\s*/m, '')
        .replace(/^\s*import[^;]+;?\s*/gm, '')
        .replace(/export\s+default\s+/g, '')
        .replace(/;\s*$/, '')
        .trim()
      fnBody = `return (${body});`
    } else {
      // Component module path. Turn `export default X` into
      // `__nw_default = X` so we can pull it back out of the IIFE.
      // We also capture the last declared Component-like identifier
      // as a fallback if the author forgot `export default`.
      const rewired = stripped
        .replace(/export\s+default\s+/g, '__nw_default = ')
      const transformed = transform(rewired)
      const cleaned = transformed
        .replace(/^\s*"use strict";\s*/m, '')
        .replace(/^\s*import[^;]+;?\s*/gm, '')
        .trim()
      fnBody = `
        let __nw_default;
        ${cleaned}
        // Fallback: if the source didn't export default, look for an
        // identifier starting with an uppercase letter — that's the
        // React-convention component name.
        if (!__nw_default) {
          const ids = ${JSON.stringify(collectTopLevelNames(stripped))};
          for (const n of ids) { try { const v = eval(n); if (typeof v === 'function') { __nw_default = v; break; } } catch (_) {} }
        }
        if (!__nw_default) throw new Error('No component defined. End your source with export default YourComponent.');
        return React.createElement(__nw_default);
      `
    }

    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log('FN BODY (first 400 chars):\n', fnBody.slice(0, 400))
    }

    const scopeKeys = Object.keys(SCOPE)
    const scopeVals = Object.values(SCOPE)
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const fn = new Function(...scopeKeys, fnBody)
    const node = fn(...scopeVals)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log('RENDERED NODE:', node)
      // eslint-disable-next-line no-console
      console.groupEnd()
    }
    return { ok: true, node }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error('[nw-code] COMPILE FAILED:', message, err)
      // eslint-disable-next-line no-console
      console.groupEnd()
    }
    return { ok: false, error: message }
  }
}

/** Parse out top-level `function Foo` / `const Foo` / `let Foo` etc.
 *  so we can fall back to rendering the last Component-named value if
 *  the author didn't explicitly `export default`. Naive regex-based —
 *  good enough for 90% of 21st-dev-style snippets. */
function collectTopLevelNames(source: string): string[] {
  const names = new Set<string>()
  const re = /\b(?:function|const|let|var|class)\s+([A-Z][A-Za-z0-9_]*)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(source)) !== null) names.add(match[1])
  return Array.from(names).reverse()
}

/**
 * React component that transpiles + renders a snippet.
 * If the snippet errors, shows a small error banner inside its own
 * bounding box so the rest of the canvas keeps working.
 */
export function CodeRunner({
  source,
  onReady,
}: {
  source: string
  onReady?: () => void
}) {
  const [state, setState] = React.useState<CompiledNode>({ ok: true, node: null })
  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const result = await compileSource(source)
      if (!cancelled) {
        setState(result)
        onReady?.()
      }
    })()
    return () => {
      cancelled = true
    }
  }, [source, onReady])

  if (!state.ok) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          background: 'rgba(220,38,38,0.08)',
          border: '1px dashed #DC2626',
          color: '#991B1B',
          fontSize: 12,
          fontFamily: 'ui-monospace, Menlo, monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflow: 'hidden',
        }}
      >
        {state.error}
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {state.node}
    </div>
  )
}
