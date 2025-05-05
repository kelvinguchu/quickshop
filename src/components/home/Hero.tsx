'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    image: '/hero/hero-thobe.jpg',
    title: 'Elegant Qamis Collection',
    subtitle: 'Handcrafted for the modern gentleman',
    cta: '/collections/qamis',
    ctaText: "Shop Men's Collection",
    position: 'left',
  },
  {
    image: '/hero/hero-abaya.jpg',
    title: 'Royal Abaya Collection',
    subtitle: 'Timeless elegance in every design',
    cta: '/collections/abaya',
    ctaText: "Explore Women's Collection",
    position: 'right',
  },
  {
    image: '/hero/hero-all.jpg',
    title: 'Custom Made For You',
    subtitle: 'Bespoke designs tailored to your preferences',
    cta: '/custom',
    ctaText: 'Get Custom Order',
    position: 'left',
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTimeout(() => setIsTransitioning(false), 1000)
    },
    [isTransitioning],
  )

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)
  }, [currentSlide, goToSlide, slides.length])

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)
  }, [currentSlide, goToSlide, slides.length])

  // Autoplay functionality
  useEffect(() => {
    // Reset the timer when the slide changes
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      nextSlide()
    }, 7000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentSlide, nextSlide])

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] min-h-[450px] sm:min-h-[550px] md:min-h-[650px] overflow-hidden bg-[#0e0e0e]">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/10">
        <motion.div
          className="h-full bg-[#d4af37]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 7, ease: 'linear' }}
          key={currentSlide}
        />
      </div>

      <AnimatePresence mode="wait">
      {/* Slides */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 z-10 
              ${
                slides[currentSlide].position === 'left'
                  ? 'bg-gradient-to-r from-[#0e0e0e]/90 via-[#0e0e0e]/60 to-transparent'
                  : 'bg-gradient-to-l from-[#0e0e0e]/90 via-[#0e0e0e]/60 to-transparent'
              }`}
          ></div>

          {/* Background image */}
          <motion.div
            className="relative h-full w-full"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7 }}
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              priority={currentSlide === 0}
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
              quality={90}
            />
          </motion.div>

          {/* Content */}
          <div
            className={`absolute inset-0 z-30 flex items-center 
            ${slides[currentSlide].position === 'left' ? 'justify-start' : 'justify-end'}`}
          >
            <motion.div
              className={`text-white max-w-xs sm:max-w-sm md:max-w-md space-y-3 sm:space-y-4 md:space-y-6 p-6 sm:p-8 md:p-10 border-l-2 border-[#d4af37]/80
              ${slides[currentSlide].position === 'left' ? 'ml-4 sm:ml-8 md:ml-16 lg:ml-20' : 'mr-4 sm:mr-8 md:mr-16 lg:mr-20'}`}
              initial={{
                opacity: 0,
                x: slides[currentSlide].position === 'left' ? -50 : 50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.h1
                className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-[#f9f6f2] tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                {slides[currentSlide].title}
              </motion.h1>

              <motion.p
                className="font-cormorant text-lg sm:text-xl md:text-2xl text-[#f9f6f2]/90 italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                <Link
                  href={slides[currentSlide].cta}
                  className="group inline-flex items-center font-montserrat text-xs sm:text-sm uppercase tracking-widest bg-transparent border-b border-[#d4af37] text-[#f9f6f2] px-0 py-2 transition-all duration-300 relative overflow-hidden hover:border-[#f9f6f2]"
                >
                  <span className="relative z-10 flex items-center transition-transform duration-300 group-hover:translate-x-1">
                    {slides[currentSlide].ctaText}
                    <FaArrowRight className="ml-2 sm:ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation controls */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center">
      <button
        onClick={prevSlide}
          className="mx-2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
        disabled={isTransitioning}
      >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
      </button>

        <div className="flex space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
              className="relative h-3 w-3"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
              currentSlide === index
                    ? 'bg-[#d4af37] scale-100'
                    : 'bg-white/50 scale-75 hover:scale-90 hover:bg-white/70'
                }`}
              ></span>
            </button>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="mx-2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
          aria-label="Next slide"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
