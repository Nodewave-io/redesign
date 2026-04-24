// After `next build` produces web/.next/standalone/, the static chunks
// and public files don't get copied automatically — Next leaves them at
// .next/static and public/, expecting the host system to assemble them.
//
// We DO own the host system here: stage the standalone tree into a
// fully self-contained directory so `node server.js` from inside it
// boots the full app with zero external dependencies. That's what the
// CLI spawns, and what the published tarball ships.

import { cp, rm, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const webDir = join(repoRoot, 'web')
const standaloneDir = join(webDir, '.next', 'standalone')

async function exists(p) {
  try { await stat(p); return true } catch { return false }
}

// Packages that ship platform-locked native binaries (.node / .dylib /
// .so / .dll). Next's standalone output bakes whatever it resolved on
// the build host into standalone/node_modules, which is fine for a
// container but poison for a cross-platform npm package. Strip them
// here so Node's module resolver walks up to the user's install
// node_modules at runtime, where npm has already fetched the prebuilt
// for their actual platform.
const NATIVE_DEPS_TO_STRIP = [
  'better-sqlite3',
  'sharp',
  '@img',
]

async function stripNativeDeps(standaloneNodeModules) {
  for (const name of NATIVE_DEPS_TO_STRIP) {
    const target = join(standaloneNodeModules, name)
    if (await exists(target)) {
      await rm(target, { recursive: true, force: true })
      console.log(`[postbuild-web] stripped ${name} from standalone (resolves from user's install)`)
    }
  }
}

async function main() {
  if (!(await exists(standaloneDir))) {
    console.error(
      `[postbuild-web] expected ${standaloneDir}. Did you run 'next build' with output:'standalone'?`,
    )
    process.exit(1)
  }
  // .next/static → standalone/web/.next/static
  // (Next's output-file-tracing nests under web/ since that's our
  //  outputFileTracingRoot — verify the exact path inside standalone.)
  const standaloneWebRoot = (await exists(join(standaloneDir, 'web')))
    ? join(standaloneDir, 'web')
    : standaloneDir
  await cp(join(webDir, '.next', 'static'), join(standaloneWebRoot, '.next', 'static'), {
    recursive: true,
    force: true,
  })
  if (await exists(join(webDir, 'public'))) {
    await cp(join(webDir, 'public'), join(standaloneWebRoot, 'public'), {
      recursive: true,
      force: true,
    })
  }
  console.log(`[postbuild-web] staged static + public into ${standaloneWebRoot}`)

  await stripNativeDeps(join(standaloneDir, 'node_modules'))
}

main().catch((err) => {
  console.error('[postbuild-web] failed:', err)
  process.exit(1)
})
