'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'

const SLIDE_DURATION = 6000
const IMAGE_FADE = 1.2
const EASE = [0.22, 1, 0.36, 1] as const

const copyVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.35, staggerChildren: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const itemVariants = (reduceMotion: boolean | null): Variants => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
})

const slides = [
  {
    image: '/hero/hero-thobe.jpg',
    focus: '72% 40%',
    eyebrow: "Men's Collection",
    title: 'Qamis, refined',
    subtitle: 'Tailored for comfort, cut for every occasion.',
    cta: '/collections/qamis',
    ctaText: 'Shop Qamis',
    align: 'left',
  },
  {
    image: '/hero/hero-abaya.jpg',
    focus: '30% 50%',
    eyebrow: "Women's Collection",
    title: 'Abayas with grace',
    subtitle: 'Flowing silhouettes in timeless colours.',
    cta: '/collections/abaya',
    ctaText: 'Shop Abayas',
    align: 'right',
  },
  {
    image: '/hero/hero-all.jpg',
    focus: '55% 35%',
    eyebrow: 'Made to Measure',
    title: 'Made for you',
    subtitle: 'Share your measurements, we tailor the rest.',
    cta: '/custom',
    ctaText: 'Start a Custom Order',
    align: 'left',
  },
] as const

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  const next = useCallback(() => setCurrent((i) => (i + 1) % slides.length), [])

  useEffect(() => {
    if (paused || reduceMotion) return
    const timer = setTimeout(next, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [current, paused, reduceMotion, next])

  const slide = slides[current]
  const alignRight = slide.align === 'right'

  return (
    <section
      className="relative h-[68svh] min-h-[420px] max-h-[600px] md:h-[calc(100svh-84px)] md:min-h-[380px] md:max-h-none overflow-hidden bg-[#1a1611]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Images: slow cross-fade with a gentle settle-in zoom */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: IMAGE_FADE, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            initial={{ scale: reduceMotion ? 1 : 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_DURATION / 1000 + IMAGE_FADE, ease: 'easeOut' }}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={current === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.focus }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Overlays stay outside the fading layer so contrast never dips mid-transition */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/10 md:hidden" />
      <div
        className={`absolute inset-0 hidden bg-gradient-to-r from-black/75 via-black/40 to-transparent transition-opacity duration-1000 md:block ${
          alignRight ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        className={`absolute inset-0 hidden bg-gradient-to-l from-black/75 via-black/40 to-transparent transition-opacity duration-1000 md:block ${
          alignRight ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Copy: each slide gets its own positioned layer, so the outgoing text
          fades in place while the incoming text staggers in */}
      <AnimatePresence>
        <motion.div
          key={current}
          className={`absolute inset-0 z-10 flex items-end px-5 pb-16 md:items-center md:px-12 md:pb-0 lg:px-20 ${
            alignRight ? 'md:justify-end' : 'md:justify-start'
          }`}
          variants={copyVariants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <div className="max-w-md text-[#f9f6f2] [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]">
            {/* `!` overrides the unlayered h1/p/a rules in styles.css */}
            <motion.p
              variants={itemVariants(reduceMotion)}
              className="m-0! font-montserrat text-xs font-semibold uppercase tracking-[0.25em] text-[#e6c65c] md:text-[13px]"
            >
              {slide.eyebrow}
            </motion.p>
            <motion.h1
              variants={itemVariants(reduceMotion)}
              className="mt-3! mb-0! font-cinzel text-3xl! leading-tight! font-semibold! md:text-5xl!"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              variants={itemVariants(reduceMotion)}
              className="mt-3! mb-0! font-cormorant text-lg italic text-[#f9f6f2] md:text-2xl"
            >
              {slide.subtitle}
            </motion.p>
            <motion.div variants={itemVariants(reduceMotion)}>
              <Link
                href={slide.cta}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#f9f6f2] px-6 py-3 font-montserrat text-sm font-medium uppercase tracking-widest text-[#382f21]! [text-shadow:none] transition-colors hover:bg-[#d4af37] hover:text-white!"
              >
                {slide.ctaText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-5 right-5 z-10 md:bottom-8 md:left-12 md:right-auto lg:left-20">
        <div className="flex gap-1.5 md:w-32">
          {slides.map((s, index) => (
            <button
              key={s.image}
              onClick={() => setCurrent(index)}
              className="relative h-6 flex-1"
              aria-label={`Go to slide ${index + 1}: ${s.title}`}
              aria-current={index === current}
            >
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/30">
                {index === current && (
                  <motion.span
                    key={`${current}-${paused}`}
                    className="absolute inset-y-0 left-0 bg-[#d4af37]"
                    initial={{ width: paused || reduceMotion ? '100%' : '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: paused || reduceMotion ? 0 : SLIDE_DURATION / 1000,
                      ease: 'linear',
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
