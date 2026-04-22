'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Posts', href: '/admin/dashboard' },
  // `exact`: highlight only when the user is on the overview itself,
  // not when they've drilled into /edit/[id] or /assets. Clicking Media
  // from there should feel like "go back up", so we don't show it as
  // already selected.
  { label: 'Media', href: '/admin/media', exact: true },
  { label: 'Onboarding', href: '/admin/onboarding' },
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
      <div
        className="rounded-3xl"
        style={{
          background: 'var(--nw-admin-surface-outer)',
          border: '1px solid var(--nw-admin-border-outer)',
          padding: '10px',
        }}
      >
        <div
          className="rounded-3xl"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid var(--nw-admin-border-inner)',
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
                    backgroundColor: isActive ? 'var(--nw-admin-pressed)' : 'transparent',
                    color: isActive ? 'var(--nw-admin-fg)' : 'var(--nw-admin-muted)',
                    border: isActive
                      ? '1px solid var(--nw-admin-border-strong)'
                      : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--nw-admin-hover)'
                      e.currentTarget.style.color = 'var(--nw-admin-fg)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--nw-admin-muted)'
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
