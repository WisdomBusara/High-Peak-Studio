import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import '@/app/globals.css'

const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Highpeak Consultants Ltd',
  description: 'Contemporary architecture and consultancy practice',
  viewport: 'width=device-width, initial-scale=1',
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
        {children}
      </body>
    </html>
  )
}
