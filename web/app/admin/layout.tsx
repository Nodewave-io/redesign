import { Metadata } from 'next'
import './_styles.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Nodewave Admin',
    default: 'Admin - Nodewave',
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
