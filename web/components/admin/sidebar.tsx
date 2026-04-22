'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Sidebar for the standalone Redesign app. Two destinations:
//   Posts   →  /        (overview grid of saved posts)
//   Assets  →  /assets  (reusable image + component library)
// `exact` on Posts: highlight only when on `/` itself, not when drilled
// into /edit/[id]. From there, clicking Posts should feel like "go
// back up", not "you're already here".
const NAV_ITEMS = [
  { label: 'Posts', href: '/', exact: true },
  { label: 'Assets', href: '/assets' },
]

export function AdminSidebar({ extra }: { extra?: React.ReactNode } = {}) {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex fixed z-40 flex-col"
      style={{
        top: '16px',
        left: '16px',
        width: '220px',
        bottom: '16px',
        gap: '12px',
      }}
    >
      {/* Dark tray — sits against the cream page like the landing's
          dark nav. Outer is near-black, inner is the slightly-lighter
          card face. All text + icon tokens come from the `surface-*`
          family so nothing references cream-page tokens by mistake. */}
      <div
        className="rounded-3xl"
        style={{
          background: 'var(--nw-admin-surface-outer)',
          border: '1px solid var(--nw-admin-surface-border)',
          padding: '10px',
        }}
      >
        <div
          className="rounded-3xl"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid var(--nw-admin-surface-border)',
            padding: '8px',
          }}
        >
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex w-full items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isActive ? 'var(--nw-admin-surface-pressed)' : 'transparent',
                    color: isActive ? 'var(--nw-admin-surface-fg)' : 'var(--nw-admin-surface-muted)',
                    border: isActive
                      ? '1px solid var(--nw-admin-surface-border-strong)'
                      : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--nw-admin-surface-hover)'
                      e.currentTarget.style.color = 'var(--nw-admin-surface-fg)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--nw-admin-surface-muted)'
                    }
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Optional per-page extension — e.g. the Media page mounts its
          asset/post picker here so it lives stacked under the nav. */}
      {extra && <div className="flex-1 min-h-0 flex">{extra}</div>}
    </aside>
  )
}
