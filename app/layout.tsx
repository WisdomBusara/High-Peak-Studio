import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/app/globals.css'

const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400'],
})

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Highpeak Consultants Ltd',
    template: '%s | Highpeak Consultants Ltd',
  },
  description: 'Contemporary architecture and consultancy practice based in Nairobi, Kenya',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://highpeak.co.ke',
    siteName: 'Highpeak Consultants Ltd',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#F5F3EE" />
      </head>
      <body className="bg-background text-text antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
