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

interface MobileCollectionViewProps {
  categories: Category[]
}

export default function MobileCollectionView({ categories }: MobileCollectionViewProps) {
  // We'll show only the first 2 categories for simplicity
  const displayCategories = categories.slice(0, 2)

  return (
    <div className="flex flex-col md:hidden w-full h-[calc(100vh-52px)]">
      {displayCategories.map((category, index) => (
        <div key={category.id} className="relative h-1/2 w-full overflow-hidden">
          {/* Image with top-center alignment */}
          <div className="absolute inset-0">
            <Image
              src={category.mainImage || `/qamis/qamis${index + 1}.webp`}
              alt={category.name}
              fill
              className="object-cover object-top"
              sizes="100vw"
              priority={index === 0}
              quality={90}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
            <div className="w-12 h-[1px] bg-[#d4af37] mb-4"></div>
            <h2 className="font-cinzel text-3xl text-white mb-2 tracking-wide text-center">
              {category.name}
            </h2>
            <div className="w-12 h-[1px] bg-[#d4af37] mt-4 mb-6"></div>

            <Link
              href={`/collections/${category.slug}`}
              className="inline-block bg-[#d4af37] text-white border-2 border-[#d4af37] hover:bg-[#c39a28] py-2.5 px-8 uppercase tracking-wider text-xs font-montserrat font-medium transition-all duration-300"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
