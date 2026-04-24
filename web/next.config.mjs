import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native module that can't be bundled — mark as
  // server-external so Next treats it like a regular require() at runtime.
  serverExternalPackages: ['better-sqlite3'],
  // Pin the workspace root to web/ so Next stops picking the parent
  // redesign/package-lock.json and printing the inferred-root warning.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  // Standalone output bundles a self-contained Node server at
  // web/.next/standalone/server.js with traced node_modules. That's
  // what we ship in the tarball; the CLI spawns it directly so users
  // don't need `next` installed globally or in their cwd.
  output: 'standalone',
  // Disable the built-in /_next/image optimizer. The editor renders
  // slides via plain <img> tags served from ~/.redesign/assets and the
  // optimizer pipeline (sharp) ships platform-locked native binaries
  // that break cross-platform installs. No runtime image optimization
  // is needed for a local single-user tool.
  images: { unoptimized: true },
}

export default nextConfig
