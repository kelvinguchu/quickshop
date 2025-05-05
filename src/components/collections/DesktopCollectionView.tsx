'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  image?: string
  mainImage?: string
}

interface DesktopCollectionViewProps {
  categories: Category[]
}

export default function DesktopCollectionView({ categories }: DesktopCollectionViewProps) {
  // We'll show only the first 2 categories for simplicity
  const displayCategories = categories.slice(0, 2)

  // Map images for categories - 2 images per category side by side
  const categoryImages = {
    Abayas: ['/abayas/abaya10.webp', '/abayas/abaya2.webp'],
    Qamis: ['/qamis/qamis3.webp', '/qamis/qamis9.webp'],
  }

  return (
    <div className="hidden md:flex w-full h-[calc(100vh-94px)]">
      {displayCategories.map((category, index) => (
        <div key={category.id} className="flex flex-1 h-full relative">
          {/* Two portrait images side by side for each category */}
          <div className="flex w-full h-full">
            {/* First image */}
            <div className="w-1/2 h-full relative">
              <Image
                src={
                  category.mainImage ||
                  categoryImages[category.name]?.[0] ||
                  `/abayas/abaya${index + 1}.webp`
                }
                alt={category.name}
                fill
                className="object-cover"
                sizes="25vw"
                priority
                quality={90}
              />
            </div>

            {/* Second image */}
            <div className="w-1/2 h-full relative">
              <Image
                src={categoryImages[category.name]?.[1] || `/abayas/abaya${index + 2}.webp`}
                alt={category.name}
                fill
                className="object-cover"
                sizes="25vw"
                priority
                quality={90}
              />
            </div>
          </div>

          {/* Dark overlay across both images */}
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 hover:bg-black/30"></div>

          {/* Text overlay on top of both images */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-transform duration-700 hover:scale-105">
            <div className="w-16 h-[1px] bg-[#d4af37] mb-6"></div>
            <h2 className="font-cinzel text-5xl text-white mb-3 tracking-wide text-center">
              {category.name}
            </h2>
            <div className="w-16 h-[1px] bg-[#d4af37] mt-6 mb-8"></div>

            <Link
              href={`/collections/${category.slug}`}
              className="inline-block bg-[#d4af37] text-white border-2 border-[#d4af37] hover:bg-[#c39a28] py-3 px-10 uppercase tracking-wider text-sm font-montserrat font-medium transition-all duration-300 hover:shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
