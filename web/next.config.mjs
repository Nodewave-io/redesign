/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native module that can't be bundled — mark as
  // server-external so Next treats it like a regular require() at runtime.
  serverExternalPackages: ['better-sqlite3'],
}

export default nextConfig
