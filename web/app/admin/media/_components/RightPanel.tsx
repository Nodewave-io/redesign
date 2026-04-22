'use client'

import { useEffect, useState } from 'react'
import { editor, useEditorState } from '../_lib/store'
import type { SaveState } from '../_lib/store'
import { CANVAS, Layer, TextLayer, ShapeLayer, GradientLayer, CodeLayer } from '../_lib/types'

export function RightPanel({
  exporting,
  onExport,
}: {
  exporting: boolean
  onExport: () => void
}) {
  const { post, selectedLayerId, dirty, saveState, lastSavedAt, saveError } = useEditorState()
  const layer = post.layers.find((l) => l.id === selectedLayerId) ?? null
  const canExport = !!post.id && !dirty && post.slides.length > 0

  return (
    <aside
      className="shrink-0 h-full rounded-3xl flex flex-col"
      style={{
        width: 280,
        background: 'var(--nw-admin-surface-outer)',
        border: '1px solid var(--nw-admin-border-outer)',
        padding: 10,
      }}
    >
      <div
        className="rounded-3xl flex-1 min-h-0 flex flex-col"
        style={{
          background: 'var(--nw-admin-surface-inner)',
          border: '1px solid var(--nw-admin-border-inner)',
        }}
      >
        {/* Scrollable inspector body */}
        <div className="flex-1 min-h-0 overflow-y-auto" style={{ padding: 16 }}>
          <div className="space-y-5">
            <PostSettings />
            <AddLayerActions />
            {layer && <LayerInspector layer={layer} />}
          </div>
        </div>

        {/* Sticky footer with auto-save status + Export */}
        <div
          className="shrink-0 flex flex-col gap-2"
          style={{ padding: 12, borderTop: '1px solid rgba(15,18,17,0.06)' }}
        >
          <SaveStatus
            saveState={saveState}
            dirty={dirty}
            lastSavedAt={lastSavedAt}
            saveError={saveError}
          />
          <button
            onClick={onExport}
            disabled={exporting || !canExport}
            title={!post.id ? 'Save the post first' : dirty ? 'Saving your changes…' : ''}
            className="inline-flex items-center justify-center gap-2 w-full text-sm font-medium rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--nw-admin-primary)', color: '#FFFFFF', height: 44 }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-primary-hover)'
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-primary)'
            }}
          >
            {exporting ? 'Exporting…' : 'Export'}
          </button>
        </div>
      </div>
    </aside>
  )
}

// Shared pill toggle — single sliding indicator. All toggles in the
// admin use this shape + height so nothing looks squished or out of
// place between the dashboard, onboarding modal, and media editor.
export function SlideToggle({
  left,
  right,
}: {
  left: { label: string; active: boolean; onClick: () => void }
  right: { label: string; active: boolean; onClick: () => void }
}) {
  return (
    <div
      className="relative flex items-center rounded-full w-full"
      style={{
        height: 44,
        background: '#FFFFFF',
        border: '1px solid rgba(15,18,17,0.08)',
        padding: 4,
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: 4,
          bottom: 4,
          left: left.active ? 4 : 'calc(50% + 0px)',
          width: 'calc(50% - 4px)',
          background: 'rgba(15,18,17,0.08)',
          border: '1px solid rgba(15,18,17,0.18)',
          transition: 'left 250ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      <button
        type="button"
        onClick={left.onClick}
        className="relative z-10 flex-1 text-sm rounded-full"
        style={{
          color: left.active ? '#0F1211' : 'rgba(15,18,17,0.55)',
          fontWeight: left.active ? 500 : 400,
          height: '100%',
        }}
      >
        {left.label}
      </button>
      <button
        type="button"
        onClick={right.onClick}
        className="relative z-10 flex-1 text-sm rounded-full"
        style={{
          color: right.active ? '#0F1211' : 'rgba(15,18,17,0.55)',
          fontWeight: right.active ? 500 : 400,
          height: '100%',
        }}
      >
        {right.label}
      </button>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: 'rgba(15,18,17,0.5)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

// Shared input shape across the whole editor. Keeps every control
// (title, slides, layer X/Y/W/H, text area, etc.) visually aligned —
// same height, same font size/weight, same colors, same white fill.
const inputClass = 'w-full px-4 text-sm font-normal rounded-full outline-none transition-colors'
const inputStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid rgba(15,18,17,0.12)',
  color: '#0F1211',
  height: 44,
}

const inputFocus = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#0A80FE'
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(15,18,17,0.12)'
  },
}

function PostSettings() {
  const { post } = useEditorState()
  return (
    <div className="space-y-3">
      <Field label="Title">
        <input
          type="text"
          value={post.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          className={inputClass}
          style={inputStyle}
          {...inputFocus}
        />
      </Field>

      <Field label="Theme">
        <SlideToggle
          left={{ label: 'Dark', active: post.theme === 'dark', onClick: () => editor.setTheme('dark') }}
          right={{ label: 'Light', active: post.theme === 'light', onClick: () => editor.setTheme('light') }}
        />
      </Field>

      <Field label="Slides">
        <input
          type="number"
          min={1}
          max={20}
          value={post.page_count}
          onChange={(e) => {
            const n = Math.max(1, Math.min(20, parseInt(e.target.value || '1', 10)))
            editor.setPageCount(n)
          }}
          className={inputClass}
          style={inputStyle}
          {...inputFocus}
        />
      </Field>

    </div>
  )
}

function AddLayerActions() {
  const { post, viewMode, currentSlide } = useEditorState()
  const slideIndex = viewMode === 'carousel' ? currentSlide : 0

  const addText = () => {
    editor.addLayer({
      kind: 'text',
      slideIndex,
      x: 80,
      y: 80,
      w: 840,
      h: 160,
      text: 'Add your headline',
      fontFamily: 'display',
      fontSize: 96,
      fontWeight: 600,
      color: post.theme === 'dark' ? '#F5F5F5' : '#0F1211',
      align: 'left',
      lineHeight: 1.08,
    })
  }

  const addCode = () => {
    // Code layers are free-floating blocks that stack like sections on
    // a web page — Claude (via MCP) sets x/y/w/h/spans. We default a
    // manual insertion to a centered mid-size block; Claude can resize
    // it from there. The canvas deliberately doesn't expose drag
    // handles for code layers — sizing happens via the inspector or MCP.
    const w = 700
    const h = 500
    editor.addLayer({
      kind: 'code',
      slideIndex,
      x: Math.round((CANVAS.W - w) / 2),
      y: Math.round((CANVAS.H - h) / 2),
      w,
      h,
      source: `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '${post.theme === 'dark' ? '#F5F5F5' : '#0F1211'}', fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 600 }}>
  Your JSX here
</div>`,
    })
  }

  return (
    <div className="space-y-2">
      <button
        onClick={addText}
        className="w-full flex items-center justify-center gap-2 text-sm rounded-full transition-colors"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15,18,17,0.12)',
          color: '#0F1211',
          height: 44,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,18,17,0.03)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add text
      </button>
      <button
        onClick={addCode}
        className="w-full flex items-center justify-center gap-2 text-sm rounded-full transition-colors"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15,18,17,0.12)',
          color: '#0F1211',
          height: 44,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,18,17,0.03)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 3-6 9 6 9M16 3l6 9-6 9" />
        </svg>
        Add code
      </button>
    </div>
  )
}

function LayerInspector({ layer }: { layer: Layer }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(15,18,17,0.5)' }}>
          {layer.kind}
        </p>
        <div className="flex items-center gap-1">
          <IconBtn onClick={() => editor.duplicateLayer(layer.id)} title="Duplicate">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          </IconBtn>
          <IconBtn onClick={() => editor.moveLayerZ(layer.id, 'top')} title="Bring to front">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </IconBtn>
          <IconBtn onClick={() => editor.moveLayerZ(layer.id, 'bottom')} title="Send to back">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </IconBtn>
          <IconBtn onClick={() => editor.removeLayer(layer.id)} title="Delete" danger>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </IconBtn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="X">
          <NumberField value={layer.x} onChange={(v) => editor.updateLayer(layer.id, { x: v })} />
        </Field>
        <Field label="Y">
          <NumberField value={layer.y} onChange={(v) => editor.updateLayer(layer.id, { y: v })} />
        </Field>
        <Field label="W">
          <NumberField value={layer.w} onChange={(v) => editor.updateLayer(layer.id, { w: v })} />
        </Field>
        <Field label="H">
          <NumberField value={layer.h} onChange={(v) => editor.updateLayer(layer.id, { h: v })} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Slide">
          <NumberField value={layer.slideIndex} min={0} onChange={(v) => editor.updateLayer(layer.id, { slideIndex: v })} />
        </Field>
        <Field label="Spans">
          <NumberField value={layer.spans ?? 1} min={1} onChange={(v) => editor.updateLayer(layer.id, { spans: v })} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Rotation">
          <NumberField value={layer.rotation ?? 0} onChange={(v) => editor.updateLayer(layer.id, { rotation: v })} />
        </Field>
        <Field label="Opacity %">
          <NumberField value={Math.round((layer.opacity ?? 1) * 100)} min={0} onChange={(v) => editor.updateLayer(layer.id, { opacity: Math.max(0, Math.min(100, v)) / 100 })} />
        </Field>
      </div>

      {layer.kind === 'text' && <TextInspector layer={layer} />}
      {layer.kind === 'shape' && <ShapeInspector layer={layer} />}
      {layer.kind === 'gradient' && <GradientInspector layer={layer} />}
      {layer.kind === 'code' && <CodeInspector layer={layer} />}
    </div>
  )
}

function NumberField({ value, onChange, min }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      onChange={(e) => onChange(parseInt(e.target.value || '0', 10) || 0)}
      className={inputClass}
      style={inputStyle}
      {...inputFocus}
    />
  )
}

function ColorField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={toHex(value)}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full cursor-pointer shrink-0"
        style={{
          width: 44,
          height: 44,
          border: '1px solid rgba(15,18,17,0.12)',
          background: '#FFFFFF',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        style={inputStyle}
        {...inputFocus}
      />
    </div>
  )
}

function toHex(v: string): string {
  if (v.startsWith('#')) return v
  return '#000000'
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
      style={{
        color: danger ? '#DC2626' : 'rgba(15,18,17,0.55)',
        background: 'transparent',
        border: '1px solid rgba(15,18,17,0.08)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,18,17,0.04)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

function TextInspector({ layer }: { layer: TextLayer }) {
  return (
    <div className="space-y-3">
      <Field label="Text">
        <textarea
          value={layer.text}
          onChange={(e) => editor.updateLayer(layer.id, { text: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 text-sm rounded-2xl outline-none resize-none transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#0F1211',
          }}
          {...inputFocus}
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Font">
          <select
            value={layer.fontFamily ?? 'display'}
            onChange={(e) => editor.updateLayer(layer.id, { fontFamily: e.target.value as any })}
            className={inputClass}
            style={inputStyle}
            {...inputFocus}
          >
            <option value="display">Manrope</option>
            <option value="mono">Space Mono</option>
            <option value="sans">Inter</option>
          </select>
        </Field>
        <Field label="Weight">
          <select
            value={layer.fontWeight}
            onChange={(e) => editor.updateLayer(layer.id, { fontWeight: parseInt(e.target.value, 10) as any })}
            className={inputClass}
            style={inputStyle}
            {...inputFocus}
          >
            <option value={400}>400</option>
            <option value={500}>500</option>
            <option value={600}>600</option>
            <option value={700}>700</option>
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Size">
          <NumberField value={layer.fontSize} onChange={(v) => editor.updateLayer(layer.id, { fontSize: v })} />
        </Field>
        <Field label="Align">
          <select
            value={layer.align}
            onChange={(e) => editor.updateLayer(layer.id, { align: e.target.value as any })}
            className={inputClass}
            style={inputStyle}
            {...inputFocus}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
      </div>
      <Field label="Color">
        <ColorField value={layer.color} onChange={(v) => editor.updateLayer(layer.id, { color: v })} />
      </Field>
    </div>
  )
}

function ShapeInspector({ layer }: { layer: ShapeLayer }) {
  return (
    <div className="space-y-3">
      <Field label="Fill">
        <ColorField value={layer.fill} onChange={(v) => editor.updateLayer(layer.id, { fill: v })} />
      </Field>
      {layer.shape === 'rect' && (
        <Field label="Radius">
          <NumberField value={layer.radius ?? 0} onChange={(v) => editor.updateLayer(layer.id, { radius: v })} />
        </Field>
      )}
    </div>
  )
}

function CodeInspector({ layer }: { layer: CodeLayer }) {
  return (
    <div className="space-y-3">
      <Field label="Source (TSX)">
        <textarea
          value={layer.source}
          onChange={(e) => editor.updateLayer(layer.id, { source: e.target.value })}
          rows={14}
          spellCheck={false}
          className="w-full px-4 py-3 rounded-2xl outline-none resize-none transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#0F1211',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 12,
            lineHeight: 1.5,
          }}
          {...inputFocus}
        />
      </Field>
      <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(15,18,17,0.5)' }}>
        Single JSX expression. Scope: React, motion, AnimatePresence, Icons, cn. No hooks, no imports.
      </p>
    </div>
  )
}

function GradientInspector({ layer }: { layer: GradientLayer }) {
  return (
    <div className="space-y-3">
      <Field label="From">
        <ColorField value={layer.from} onChange={(v) => editor.updateLayer(layer.id, { from: v })} />
      </Field>
      <Field label="To">
        <ColorField value={layer.to} onChange={(v) => editor.updateLayer(layer.id, { to: v })} />
      </Field>
      <Field label="Angle">
        <NumberField value={layer.angle} onChange={(v) => editor.updateLayer(layer.id, { angle: v })} />
      </Field>
    </div>
  )
}

// Status pill above the Export button. States:
//   idle + clean  → ""  (empty — avoid "Saved" clinging forever)
//   idle + dirty  → "Unsaved"
//   saving        → "Saving…"
//   saved         → "Saved · just now / 12s ago / 3m ago"
//   error         → "Couldn't save · retrying" + tooltip with the error
// Click-to-retry when in error state so Tiago isn't stuck watching a
// broken auto-save loop.
function SaveStatus({
  saveState,
  dirty,
  lastSavedAt,
  saveError,
}: {
  saveState: SaveState
  dirty: boolean
  lastSavedAt: number | null
  saveError: string | null
}) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (saveState !== 'saved' || !lastSavedAt) return
    const t = setInterval(() => setNow(Date.now()), 15_000)
    return () => clearInterval(t)
  }, [saveState, lastSavedAt])

  let label = ''
  let color = 'rgba(15,18,17,0.5)'
  let dotColor: string | null = null
  if (saveState === 'saving') {
    label = 'Saving…'
    dotColor = 'rgba(15,18,17,0.35)'
  } else if (saveState === 'error') {
    label = "Couldn't save · click to retry"
    color = '#DC2626'
    dotColor = '#DC2626'
  } else if (saveState === 'saved' && lastSavedAt) {
    label = `Saved · ${relativeTime(now - lastSavedAt)}`
    dotColor = '#16A34A'
  } else if (dirty) {
    label = 'Unsaved'
    dotColor = 'rgba(15,18,17,0.35)'
  }

  if (!label) return <div style={{ height: 18 }} aria-hidden />

  const isError = saveState === 'error'
  const handleClick = isError ? () => { void editor.flushNow() } : undefined

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isError}
      title={isError && saveError ? saveError : undefined}
      className="inline-flex items-center gap-1.5 self-center text-[11px] px-1 rounded"
      style={{
        color,
        background: 'transparent',
        height: 18,
        cursor: isError ? 'pointer' : 'default',
      }}
    >
      {dotColor && (
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: dotColor }}
        />
      )}
      {label}
    </button>
  )
}

function relativeTime(ms: number): string {
  if (ms < 10_000) return 'just now'
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`
  if (ms < 3600_000) return `${Math.floor(ms / 60_000)}m ago`
  if (ms < 86_400_000) return `${Math.floor(ms / 3600_000)}h ago`
  return `${Math.floor(ms / 86_400_000)}d ago`
}
