import type { Metadata } from 'next'
import { Manrope, Space_Mono } from 'next/font/google'
import './globals.css'

// The editor reads var(--font-display) and var(--font-mono-accent)
// directly from CSS. Keep the variable names identical to the
// original nw-site setup so every copied component keeps rendering
// with the right type.
const manrope = Manrope({ subsets: ['latin'], variable: '--font-display' })
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono-accent',
})

export const metadata: Metadata = {
  title: 'Redesign',
  description: 'Claude builds your LinkedIn and Instagram carousels, locally.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${manrope.variable} ${spaceMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
