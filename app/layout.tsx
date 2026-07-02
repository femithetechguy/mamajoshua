import type { Metadata } from 'next'
import './globals.css'
import { getSiteConfig } from '@/lib/config'

const config = getSiteConfig()

export const metadata: Metadata = {
  title: config.pageTitle,
  description: config.pageDescription,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
