import type { Metadata } from 'next'
import './globals.css'
import { Github, Linkedin, Globe } from 'lucide-react'

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
          <p className="mb-2">
            This product uses the NVD API but is not endorsed or certified by the NVD. Data provided by the{' '}
            <a
              href="https://nvd.nist.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              National Vulnerability Database (NVD)
            </a>{' '}
            operated by the U.S. National Institute of Standards and Technology (NIST).
          </p>

          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="https://www.linkedin.com/in/hemanth-gedda-6b8419252/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/hgedda1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://hgedda1.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
              aria-label="Portfolio"
            >
              <Globe className="h-5 w-5" />
            </a>
          </div>

          <p className="mt-2 text-gray-600">
            Built by <span className="font-semibold text-gray-800">Hemanth Gedda</span>
          </p>
        </footer>
      </body>
    </html>
  )
}
