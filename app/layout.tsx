import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getSiteConfig } from '@/lib/config'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export async function generateMetadata(): Promise<Metadata> {
  const config = getSiteConfig()
  return {
    title: config.pageTitle,
    description: config.pageDescription,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-full bg-zinc-100 text-gray-900 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
