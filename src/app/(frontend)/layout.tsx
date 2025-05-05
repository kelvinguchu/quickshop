import React from 'react'
import '../global.css'
import './styles.css'
import { cinzel, cormorant, montserrat } from '../fonts'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/cart/CartContext'

export const metadata = {
  title: 'QuickShop - Premium Qamis & Abaya Clothing',
  description:
    'Premium Qamis & Abaya clothing store featuring Qamis and Abaya collections with custom measurements',
  manifest: '/manifest.json',
  themeColor: '#FFFFFF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QuickShop',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192x192.png' }],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${montserrat.variable}`}>
      <head>
        <meta name="application-name" content="QuickShop" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QuickShop" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="icon" href="/icons/logo.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-startup-image" href="/icons/splash.png" />
      </head>
      <body className="font-body bg-[#f9f6f2]">
        <CartProvider>
          <Navbar />
          <main className="md:pt-[76px]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
