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
}

export default nextConfig
