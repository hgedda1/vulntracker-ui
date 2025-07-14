import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'vulnerability-management-ui',
  description: 'A UI for managing vulnerabilities',
  generator: 'none',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
