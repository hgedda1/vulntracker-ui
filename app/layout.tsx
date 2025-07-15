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
      <body>
        {children}
        <footer className="text-center text-xs text-gray-500 py-6 px-2 border-t border-gray-200 bg-white/80 mt-12">
          <p>
            This product uses the NVD API but is not endorsed or certified by the NVD. Data provided by the{' '}
            <a href="https://nvd.nist.gov" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
              National Vulnerability Database (NVD)
            </a>{' '}
            operated by the U.S. National Institute of Standards and Technology (NIST).
          </p>
        </footer>
      </body>
    </html>
  )
}
