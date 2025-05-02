'use client'

import { useState, useEffect } from 'react'
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
    title: 'Premium Quality',
    subtitle: 'Luxurious fabrics and perfect fit',
    cta: '/collections',
    ctaText: 'View All Collections',
    position: 'left',
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((current) => (current === slides.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((current) => (current === 0 ? slides.length - 1 : current - 1))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide()
    }, 6000)

    return () => clearTimeout(timer)
  }, [currentSlide])

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-[#f5f2ec]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 
            ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div className="absolute inset-0 bg-[#1a1a1a]/20 z-10"></div>
          <div className="relative h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

          <div
            className={`absolute inset-0 z-20 flex items-center 
            ${slide.position === 'left' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`text-white max-w-md space-y-6 p-8 
              ${slide.position === 'left' ? 'ml-8 md:ml-16' : 'mr-8 md:mr-16'}`}
            >
              <h1 className="font-cinzel text-4xl md:text-6xl font-bold leading-tight text-[#f9f6f2]">
                {slide.title}
              </h1>
              <p className="font-cormorant text-xl md:text-2xl text-[#f9f6f2]">{slide.subtitle}</p>
              <Link
                href={slide.cta}
                className="inline-flex items-center font-montserrat text-sm uppercase tracking-wider bg-transparent hover:bg-[#f9f6f2]/30 text-[#f9f6f2] border border-[#f9f6f2] px-7 py-3 transition-all"
              >
                {slide.ctaText}
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-[#382f21]/30 text-white hover:bg-[#382f21]/60 transition-all"
        aria-label="Previous slide"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-[#382f21]/30 text-white hover:bg-[#382f21]/60 transition-all"
        aria-label="Next slide"
      >
        <FaArrowRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
