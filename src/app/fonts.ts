import localFont from 'next/font/local'

// Self-hosted (latin, variable weight) so builds don't depend on fetching from
// Google Fonts, which intermittently breaks `next build` on Vercel.

// Elegant serif font for luxury feel
export const cormorant = localFont({
  src: './font-files/cormorant-latin.woff2',
  weight: '300 700',
  display: 'swap',
  variable: '--font-cormorant',
})

// Royal display font for special headings
export const cinzel = localFont({
  src: './font-files/cinzel-latin.woff2',
  weight: '400 900',
  display: 'swap',
  variable: '--font-cinzel',
})

// Clean sans-serif font for body text
export const montserrat = localFont({
  src: './font-files/montserrat-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-montserrat',
})
