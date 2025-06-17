import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // Tailwind's base styles

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OSM Chat Assistant',
  description: 'Chat with an AI assistant about OpenStreetMap',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
