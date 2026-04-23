// The editor's verbatim Supabase code path stores its slide tree in a
// single `slides` field shaped `{slides: Slide[], layers: Layer[]}`.
// The repo expects `slides` and `layers` as separate columns. Unwrap
// the wrapper here so both code paths can share repo.ts.

export function unwrapPostBody(
  body: Record<string, unknown>,
): Record<string, unknown> {
  const slides = body.slides
  if (
    slides &&
    typeof slides === 'object' &&
    !Array.isArray(slides) &&
    'slides' in (slides as Record<string, unknown>)
  ) {
    const wrapper = slides as { slides?: unknown; layers?: unknown }
    return {
      ...body,
      slides: wrapper.slides ?? [],
      layers: wrapper.layers ?? body.layers ?? [],
    }
  }
  return body
}
