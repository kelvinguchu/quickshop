import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: {
    url: string
  }
}

interface CollectionsGridProps {
  categories: Category[]
}

export default function CollectionsGrid({ categories }: CollectionsGridProps) {
  return (
    <div className="min-h-screen bg-[#f9f6f2]">
      {categories.length > 0 ? (
        <div className="relative">
          {/* Elegant Header */}
          <div className="text-center py-16 px-4 bg-white border-b border-[#e6ded0]">
            <h1 className="font-serif text-4xl md:text-5xl text-[#382f21] mb-3">Our Collections</h1>
            <p className="text-[#8a7d65] max-w-2xl mx-auto text-lg">
              Discover our curated selection of premium Islamic attire, crafted with attention to
              detail and respect for tradition
            </p>
          </div>

          {/* Main Collections */}
          <div className="flex flex-col md:flex-row min-h-[80vh] border-b border-[#e6ded0]">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative flex-1 overflow-hidden transition-all duration-700 hover:flex-[1.2] flex items-center justify-center group bg-[#f0e9e0]"
              >
                {/* Ambient Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('/patterns/arabesque.png')] bg-repeat z-0"></div>

                {/* Image Container with Premium Styling */}
                <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image.url}
                      alt={category.name}
                      fill
                      className="object-cover scale-105 transition-transform duration-1000 filter group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      quality={90}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#9b8e77] to-[#5e4f3b]"></div>
                  )}
                  <div className="absolute inset-0 bg-[#1a1a1a]/40 transition-opacity duration-700 group-hover:bg-[#1a1a1a]/30 z-10"></div>
                </div>

                {/* Content with Elegant Typography and Gold Accents */}
                <div className="relative z-20 text-center p-10 max-w-lg transform transition-all duration-700 group-hover:scale-105">
                  <div className="inline-block mb-6">
                    <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mb-6"></div>
                    <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-3 tracking-wide">
                      {category.name}
                    </h2>
                    <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mt-6"></div>
                  </div>

                  <p className="text-white/90 mb-8 text-lg max-w-[90%] mx-auto leading-relaxed">
                    {category.description ||
                      `Elegant ${category.name} collection crafted for discerning tastes, blending tradition with contemporary elements.`}
                  </p>

                  <Link
                    href={`/collections/${category.slug}`}
                    className="inline-block bg-transparent text-white border-2 border-[#d4af37] hover:bg-[#d4af37] py-3 px-10 uppercase tracking-wider text-sm font-medium transition-all duration-300 hover:shadow-gold"
                  >
                    Explore Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Elegant Footer with Design Elements */}
          <div className="text-center py-12 bg-white">
            <div className="flex justify-center items-center space-x-4 text-[#8a7d65]">
              <div className="w-12 h-[1px] bg-[#d4af37]"></div>
              <span className="uppercase tracking-widest text-xs">Crafted with excellence</span>
              <div className="w-12 h-[1px] bg-[#d4af37]"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[70vh] bg-white">
          <div className="text-center p-10 max-w-md">
            <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mb-6"></div>
            <h2 className="text-2xl font-serif text-[#382f21] mb-3">Our Collections</h2>
            <p className="text-[#8a7d65] mb-8">
              We're currently curating our exclusive collections. Please check back soon for our
              latest arrivals.
            </p>
            <Link
              href="/"
              className="inline-block bg-transparent text-[#382f21] border border-[#d4af37] hover:bg-[#d4af37] hover:text-white py-2 px-6 text-sm uppercase tracking-wider transition-all duration-300"
            >
              Return Home
            </Link>
            <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mt-6"></div>
          </div>
        </div>
      )}
    </div>
  )
}
