import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PAML Final - Steam Price Projection',
  description: 'Created by Sean Hardesty Lewis',
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
