'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaHeart, FaRegHeart, FaShoppingBag } from 'react-icons/fa'

interface ProductCardProps {
  product: {
    id: string
    slug?: string
    name: string
    price: number
    mainImage?: {
      url: string
    }
    staticImage?: string // For using static images from public folder
  }
  imageWidth?: number
  imageHeight?: number
}

export default function ProductCard({
  product,
  imageWidth = 400,
  imageHeight = 500,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Handle image source (either from CMS or static folder)
  const imageSource = product.mainImage?.url || product.staticImage || '/placeholder-product.jpg'

  return (
    <div
      className="group relative border border-[#e0d8c9] rounded-sm shadow-sm hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="block overflow-hidden bg-[#f5f2ec]"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={imageSource}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover top-center transition-all duration-700"
          />
        </div>
      </Link>

      {/* Wishlist button - always visible */}
      <div className="absolute right-3 top-3">
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#f9f6f2] transition-colors"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-[#382f21]" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="px-3 py-1.5">
        <h3 className="font-cinzel text-sm font-medium text-[#382f21] text-left leading-tight -mb-4">
          <Link href={`/products/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="font-cormorant -mt-4 text-lg font-semibold text-[#8a7d65] text-left leading-tight">
          ${product.price.toFixed(2)}
        </p>

        {/* Add to Cart Button - always visible */}
        <div className="mt-1">
          <button className="w-full flex items-center justify-center gap-1 bg-[#382f21] px-4 py-1.5 font-montserrat text-xs uppercase tracking-wider text-white hover:bg-[#4e4538] transition-colors">
            <FaShoppingBag className="h-3 w-3" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}
