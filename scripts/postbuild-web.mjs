// After `next build` produces web/.next/standalone/, the static chunks
// and public files don't get copied automatically — Next leaves them at
// .next/static and public/, expecting the host system to assemble them.
//
// We DO own the host system here: stage the standalone tree into a
// fully self-contained directory so `node server.js` from inside it
// boots the full app with zero external dependencies. That's what the
// CLI spawns, and what the published tarball ships.

import { cp, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const webDir = join(repoRoot, 'web')
const standaloneDir = join(webDir, '.next', 'standalone')

async function exists(p) {
  try { await stat(p); return true } catch { return false }
}

async function main() {
  if (!(await exists(standaloneDir))) {
    console.error(
      `[postbuild-web] expected ${standaloneDir} — did you run 'next build' with output:'standalone'?`,
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
}

main().catch((err) => {
  console.error('[postbuild-web] failed:', err)
  process.exit(1)
})
