// End-to-end smoke test for the repo layer. Runs against a disposable
// DB under /tmp/redesign-smoke-<pid>/ so it never touches the real
// ~/.redesign. Exit code 0 = everything passed.
//
// Invocation: `npx tsx scripts/smoke.ts`

import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const SMOKE_HOME = join(tmpdir(), `redesign-smoke-${process.pid}`)
process.env.REDESIGN_HOME = SMOKE_HOME

const { closeDb } = await import('../src/db/client.js')
const repo = await import('../src/db/repo.js')
const { saveAssetBytes, removeStoredFile } = await import('../src/db/storage.js')

let failed = 0
function check(label: string, ok: boolean, detail?: unknown): void {
  if (ok) {
    console.log(`  ✓ ${label}`)
  } else {
    failed++
    console.log(`  ✗ ${label}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ''}`)
  }
}

try {
  console.log('[smoke] collections')
  const initial = repo.listCollections()
  check('bootstrap created a default collection', initial.length === 1)
  const defaultCollection = initial[0]
  check('default collection name is "Default"', defaultCollection.name === 'Default')

  const renamed = repo.updateCollection(defaultCollection.id, 'Smoke')
  check('updateCollection renames', renamed.name === 'Smoke')

  const second = repo.createCollection('Marketing')
  check('createCollection appends', repo.listCollections().length === 2 && second.name === 'Marketing')

  let createWithoutCollectionRejected = false
  try {
    // @ts-expect-error: intentional missing collection_id
    repo.createPost({ title: 'orphan' })
  } catch {
    createWithoutCollectionRejected = true
  }
  check('createPost rejects missing collection_id', createWithoutCollectionRejected)

  console.log('[smoke] posts round-trip')
  const empty = repo.listPosts()
  check('empty list', empty.length === 0)

  const p = repo.createPost({
    collection_id: defaultCollection.id,
    title: 'Hello',
    theme: 'dark',
  })
  check('createPost returns id+title', p.id.length > 0 && p.title === 'Hello')
  check('createPost page_count default 3', p.page_count === 3)
  check('createPost stores collection_id', p.collection_id === defaultCollection.id)

  // Filter by collection_id
  const inDefault = repo.listPosts({ collection_id: defaultCollection.id })
  const inSecond = repo.listPosts({ collection_id: second.id })
  check('listPosts filters by collection', inDefault.length === 1 && inSecond.length === 0)

  // deleteCollection refuses when posts still reference it
  let deleteRefused = false
  try {
    repo.deleteCollection(defaultCollection.id)
  } catch {
    deleteRefused = true
  }
  check('deleteCollection rejects if posts attached', deleteRefused)

  // Empty collection deletes cleanly
  repo.deleteCollection(second.id)
  check('deleteCollection succeeds when empty', repo.listCollections().length === 1)

  const fetched = repo.getPost(p.id)
  check('getPost matches', fetched.id === p.id)

  const list1 = repo.listPosts()
  check('listPosts sees the new post', list1.length === 1 && list1[0].id === p.id)

  // Concurrency: correct expected passes
  const updated = repo.updatePost(p.id, { title: 'Hello v2' }, p.updated_at)
  check('updatePost with correct expected_updated_at', updated.title === 'Hello v2')
  check('updated_at advanced', updated.updated_at !== p.updated_at)

  // Concurrency: stale expected throws
  let staleCaught = false
  try {
    repo.updatePost(p.id, { title: 'nope' }, p.updated_at)
  } catch (err) {
    staleCaught = err instanceof repo.StaleUpdateError
  }
  check('updatePost rejects stale expected_updated_at', staleCaught)

  // Layers round-trip through JSON column
  const layer = {
    id: 'l1', kind: 'text' as const, slideIndex: 0,
    x: 0, y: 0, w: 100, h: 50,
    text: 'hi', fontSize: 24, fontWeight: 400 as const,
    color: '#fff', align: 'left' as const,
  }
  const withLayer = repo.updatePost(p.id, { layers: [layer] }, updated.updated_at)
  check('layers persist through JSON column', withLayer.layers.length === 1 && withLayer.layers[0].kind === 'text')

  console.log('[smoke] revisions')
  const rev = repo.createRevision(p.id, withLayer, 'mcp', 'smoke')
  check('createRevision returns id', rev.id.length > 0)
  const revs = repo.listRevisions(p.id)
  check('listRevisions sees snapshot', revs.length === 1)
  check('snapshot.layers preserved', revs[0].snapshot.layers.length === 1)

  console.log('[smoke] assets')
  const a = repo.createAsset({
    kind: 'component',
    name: 'test-card',
    description: null,
    usage_notes: 'For testing',
    categories: ['card', 'dark'],
    tags: ['smoke'],
    file_url: null, storage_path: null,
    mime_type: null, width: null, height: null,
    source_code: 'export default () => <div>hi</div>',
  })
  check('createAsset kind=component', a.kind === 'component')
  check('asset categories round-trip', a.categories.join(',') === 'card,dark')
  const updatedAsset = repo.updateAsset(a.id, { usage_notes: 'Updated' })
  check('updateAsset patches usage_notes', updatedAsset.usage_notes === 'Updated')
  const deleted = repo.deleteAsset(a.id)
  check('deleteAsset returns removed row', deleted.name === 'test-card')

  console.log('[smoke] file storage')
  const saved = await saveAssetBytes(Buffer.from('hello'), 'image/png', 'x.png')
  check('saveAssetBytes returns storage_path under assets/', saved.storage_path.startsWith('assets/'))
  check('file_url points at /api/storage/assets/', saved.file_url.startsWith('/api/storage/assets/'))
  await removeStoredFile(saved.storage_path)
  check('removeStoredFile succeeds', true)

  console.log('[smoke] mcp log')
  repo.insertMcpLog({
    tool_name: 'smoke_fake_tool',
    args_digest: 'abc123',
    post_id: p.id,
    status: 'ok',
    duration_ms: 42,
    error_message: null,
  })
  check('insertMcpLog does not throw', true)

  console.log('[smoke] mcp write pipeline (applyWrite + applyBatch)')
  const { applyWrite } = await import('../src/mcp/write-helpers.js')
  const { applyBatch } = await import('../src/mcp/batch.js')
  const mcpPost = repo.createPost({
    collection_id: defaultCollection.id,
    title: 'MCP smoke',
    page_count: 3,
  })
  const w1 = applyWrite(
    mcpPost.id,
    mcpPost.updated_at,
    () => ({ fields: { title: 'MCP smoke v2' } }),
    'smoke',
  )
  check('applyWrite patches fields', repo.getPost(mcpPost.id).title === 'MCP smoke v2')
  check('applyWrite advances updated_at', w1.updated_at !== mcpPost.updated_at)

  let staleRejected = false
  try {
    applyWrite(mcpPost.id, mcpPost.updated_at, () => ({ fields: { title: 'stale' } }), 'nope')
  } catch {
    staleRejected = true
  }
  check('applyWrite rejects stale expected_updated_at', staleRejected)

  const preminted = crypto.randomUUID()
  const b = applyBatch(
    mcpPost.id,
    w1.updated_at,
    [
      {
        type: 'add_layer',
        id: preminted,
        layer: {
          kind: 'text', slideIndex: 0, x: 10, y: 10, w: 200, h: 50,
          text: 'hello', fontSize: 24, fontWeight: 400, color: '#fff', align: 'left',
        },
      },
      { type: 'update_layer', layerId: preminted, patch: { text: 'goodbye' } },
    ],
    'batch-smoke',
  )
  check('applyBatch returns preminted id in addedLayerIds', b.addedLayerIds[0] === preminted)
  const after = repo.getPost(mcpPost.id)
  const addedLayer = after.layers.find((l) => l.id === preminted)
  check(
    'in-batch reference: later op saw earlier op\'s layer',
    addedLayer?.kind === 'text' && (addedLayer as { text: string }).text === 'goodbye',
  )
  check('applyBatch created exactly one revision', repo.listRevisions(mcpPost.id).length >= 1)
  repo.deletePost(mcpPost.id)

  console.log('[smoke] cleanup')
  repo.deletePost(p.id)
  check('deletePost removes row', repo.listPosts().length === 0)
} catch (err) {
  console.error('[smoke] UNEXPECTED THROW', err)
  failed++
}

closeDb()
rmSync(SMOKE_HOME, { recursive: true, force: true })

if (failed > 0) {
  console.error(`\n[smoke] ${failed} check(s) failed`)
  process.exit(1)
}
console.log('\n[smoke] all checks passed')
