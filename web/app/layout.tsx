import type { Metadata } from 'next'
import { Geist, Manrope, Space_Mono } from 'next/font/google'
import './globals.css'
import './_styles.css'

// The editor reads var(--font-display), var(--font-mono-accent) and
// var(--font-geist) directly from CSS. Keep the variable names
// identical to the original nw-site setup so every copied component
// keeps rendering with the right type.
const manrope = Manrope({ subsets: ['latin'], variable: '--font-display' })
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono-accent',
})
// Geist is the nw-site body sans-serif. Loaded via next/font/google
// so it ships with the page bundle and renders identically in the
// editor preview AND in puppeteer-export PNGs.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Redesign',
  description: 'Claude builds your LinkedIn and Instagram carousels, locally.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${manrope.variable} ${spaceMono.variable} ${geist.variable}`}>
        {children}
      </body>
    </html>
  )
}
