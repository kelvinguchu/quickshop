import { Playfair_Display, Cormorant, Cinzel, Montserrat } from 'next/font/google'

// Elegant serif font for headings
export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

// Elegant serif font for luxury feel
export const cormorant = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

// Royal display font for special headings
export const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cinzel',
})

// Clean sans-serif font for body text
export const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
})
