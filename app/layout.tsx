import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'A beautiful chat application with Apple-like design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}




