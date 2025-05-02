'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

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

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide()
    }, 6000)

    return () => clearTimeout(timer)
  }, [currentSlide, nextSlide])

  return (
    <section className="relative h-[85vh] min-h-[650px] overflow-hidden bg-[#0e0e0e]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1500 
            ${currentSlide === index ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}
        >
          {/* Gradient overlay for better text readability */}
          <div
            className={`absolute inset-0 z-10 
              ${
                slide.position === 'left'
                  ? 'bg-gradient-to-r from-[#0e0e0e]/70 via-[#0e0e0e]/40 to-transparent'
                  : 'bg-gradient-to-l from-[#0e0e0e]/70 via-[#0e0e0e]/40 to-transparent'
              }`}
          ></div>

          <div className="relative h-full w-full transition-transform duration-[2000ms] ease-out">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover object-center transition-transform duration-[8000ms]"
              sizes="100vw"
              quality={90}
            />
          </div>

          <div
            className={`absolute inset-0 z-30 flex items-center 
            ${slide.position === 'left' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`text-white max-w-md space-y-6 p-8 backdrop-blur-sm bg-[#0e0e0e]/20 border border-white/10 rounded
              ${slide.position === 'left' ? 'ml-10 md:ml-20' : 'mr-10 md:mr-20'}
              transform transition-all duration-1000 ease-out
              ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#f9f6f2] tracking-wide">
                {slide.title}
              </h1>
              <p className="font-cormorant text-xl md:text-2xl text-[#f9f6f2]/90 italic">
                {slide.subtitle}
              </p>
              <Link
                href={slide.cta}
                className="group inline-flex items-center font-montserrat text-sm uppercase tracking-widest bg-transparent border border-[#f9f6f2] text-[#f9f6f2] px-8 py-3.5 transition-all duration-300 relative overflow-hidden hover:border-[#d4af37]/80"
              >
                <span className="relative z-10 flex items-center transition-transform group-hover:translate-x-1">
                  {slide.ctaText}
                  <FaArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#d4af37] to-[#f9f6f2]/80 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - more elegant styling */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-[#0e0e0e]/30 text-white backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-[#d4af37]/80"
        aria-label="Previous slide"
        disabled={isTransitioning}
      >
        <FaArrowLeft className="w-4 h-4 transition-transform group-hover:scale-110" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-[#0e0e0e]/30 text-white backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-[#d4af37]/80"
        aria-label="Next slide"
        disabled={isTransitioning}
      >
        <FaArrowRight className="w-4 h-4 transition-transform group-hover:scale-110" />
      </button>

      {/* Dots - refined styling */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`h-2.5 rounded-full transition-all duration-300 border ${
              currentSlide === index
                ? 'bg-[#d4af37] border-[#d4af37] w-8'
                : 'bg-white/30 border-white/30 w-2.5 hover:bg-white/50 hover:border-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
