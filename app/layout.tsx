import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '二叉树可视化',
  description: '二叉树可视化 Binary tree visualization',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/logo.svg' sizes='any' />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
