import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Help Us Lay Mama Joshua to Rest',
  description: 'A fundraiser to support the funeral arrangements for Mama Joshua.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
