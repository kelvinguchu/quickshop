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
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link
        href={`/products/${product.slug || product.id}`}
        className="block overflow-hidden bg-[#f5f2ec]"
      >
        <div className="relative h-[350px] w-full overflow-hidden transition-all">
          <Image
            src={imageSource}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>
      </Link>

      {/* Quick Actions */}
      <div
        className={`absolute right-4 top-4 flex flex-col gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#f9f6f2] transition-colors"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-[#382f21]" />
          )}
        </button>
      </div>

      {/* Add to Cart Button */}
      <div
        className={`absolute bottom-[72px] left-0 right-0 text-center transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button className="mx-auto flex items-center justify-center gap-2 bg-[#382f21] px-6 py-2 font-montserrat text-sm uppercase tracking-wider text-white hover:bg-[#4e4538] transition-colors">
          <FaShoppingBag className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-4 px-2 text-center">
        <h3 className="font-cinzel text-base font-medium text-[#382f21]">
          <Link href={`/products/${product.slug || product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 font-cormorant text-lg font-semibold text-[#8a7d65]">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
