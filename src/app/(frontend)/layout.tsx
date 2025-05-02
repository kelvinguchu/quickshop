import React from 'react'
import '../global.css'
import './styles.css'
import { cinzel, cormorant, montserrat } from '../fonts'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/lib/cart/CartContext'

export const metadata = {
  title: 'QuickShop - Islamic Clothing',
  description:
    'Premium Islamic clothing store featuring Qamis and Abaya collections with custom measurements',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${montserrat.variable}`}>
      <body className="font-body bg-[#f9f6f2]">
        <CartProvider>
          <Navbar />
          <main className="pt-[60px] md:pt-[76px]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
