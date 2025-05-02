import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaChevronDown, FaShoppingBag, FaHeart } from 'react-icons/fa'
import SortSelect from './SortSelect'

interface Subcategory {
  id: string
  name: string
  slug: string
  description?: string
  bannerImage?: {
    url: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  price: number
  mainImage?: {
    url: string
  }
}

interface SubcategoryDisplayProps {
  category: Category
  subcategory: Subcategory
  siblingSubcategories: Subcategory[]
  products: Product[]
  totalProducts: number
  currentSort: string
}

export default function SubcategoryDisplay({
  category,
  subcategory,
  siblingSubcategories,
  products,
  totalProducts,
  currentSort,
}: SubcategoryDisplayProps) {
  return (
    <div className="w-full bg-white mt-16">
      {/* Compact header with breadcrumb */}
      <div className="border-b border-gray-200 h-[40px] flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-800">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/collections" className="text-gray-500 hover:text-gray-800">
              Collections
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link
              href={`/collections/${category.slug}`}
              className="text-gray-500 hover:text-gray-800"
            >
              {category.name}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-medium text-gray-800">{subcategory.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 py-3">
        {/* Elegant centered subcategory title */}
        <div className="mb-5 text-center">
          <h2 className="font-cinzel text-xl font-bold text-[#382f21] inline-block relative">
            {subcategory.name}
            <span className="block text-xs font-montserrat text-gray-500 mt-1">
              {totalProducts} products in {category.name}
            </span>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-8 h-0.5 bg-[#d4af37]"></div>
          </h2>
        </div>

        {/* Horizontal filter bar */}
        <div className="flex flex-wrap items-center justify-between py-2 border-t border-b border-gray-200 mb-4">
          <div className="flex flex-wrap gap-2">
            {/* Collection filter dropdown */}
            <div className="relative group">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md flex items-center gap-2 bg-white">
                <span>Collection</span>
                <FaChevronDown className="w-2.5 h-2.5" />
              </button>
              <div className="absolute z-10 left-0 top-full mt-1 w-56 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block">
                <div className="py-1">
                  <Link
                    href={`/collections/${category.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    All {category.name}
                  </Link>
                  {siblingSubcategories.map((sibling) => (
                    <Link
                      key={sibling.id}
                      href={`/collections/${category.slug}/${sibling.slug}`}
                      className={`block px-4 py-2 text-sm ${
                        subcategory.id === sibling.id
                          ? 'bg-gray-100 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {sibling.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Price filter dropdown */}
            <div className="relative group">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md flex items-center gap-2 bg-white">
                <span>Price</span>
                <FaChevronDown className="w-2.5 h-2.5" />
              </button>
              <div className="absolute z-10 left-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block">
                <div className="py-1">
                  <Link
                    href={`/collections/${category.slug}/${subcategory.slug}?sort=price-asc`}
                    className={`block px-4 py-2 text-sm ${
                      currentSort === 'price-asc' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    Price: Low to High
                  </Link>
                  <Link
                    href={`/collections/${category.slug}/${subcategory.slug}?sort=price-desc`}
                    className={`block px-4 py-2 text-sm ${
                      currentSort === 'price-desc' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    Price: High to Low
                  </Link>
                </div>
              </div>
            </div>

            {/* Size filter dropdown */}
            <div className="relative group">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md flex items-center gap-2 bg-white">
                <span>Size</span>
                <FaChevronDown className="w-2.5 h-2.5" />
              </button>
              <div className="absolute z-10 left-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block">
                <div className="p-3 grid grid-cols-3 gap-1">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      className="border border-gray-300 rounded px-2 py-1 text-xs hover:bg-gray-100"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Color filter dropdown */}
            <div className="relative group">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md flex items-center gap-2 bg-white">
                <span>Color</span>
                <FaChevronDown className="w-2.5 h-2.5" />
              </button>
              <div className="absolute z-10 left-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block">
                <div className="p-3 flex flex-wrap gap-2">
                  {['#000000', '#FFFFFF', '#C19A6B', '#808080', '#0000FF', '#E6E6FA'].map(
                    (color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="mt-0">
            <SortSelect
              category={category.slug}
              subcategory={subcategory.slug}
              currentSort={currentSort}
            />
          </div>
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group border border-gray-100 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                    {product.mainImage ? (
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={product.mainImage.url}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </Link>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="text-sm font-cinzel font-medium text-[#382f21] truncate">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-[#8a7d65]">
                        ${product.price.toFixed(2)}
                      </p>
                    </Link>

                    {/* Quick action buttons - always visible */}
                    <div className="flex items-center justify-between mt-2">
                      <button className="flex-1 mr-1 bg-[#382f21] text-white text-xs py-1.5 rounded hover:bg-[#4e4538] transition-colors flex items-center justify-center">
                        <FaShoppingBag className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-white border border-[#e6ded0] rounded text-[#8a7d65] hover:text-[#382f21] hover:border-[#8a7d65] transition-colors">
                        <FaHeart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalProducts > 12 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex border border-gray-200 rounded overflow-hidden">
                  <button
                    disabled
                    className="bg-white text-gray-500 px-4 py-2 border-r border-gray-200"
                  >
                    Previous
                  </button>
                  <span className="bg-gray-100 text-gray-800 font-medium px-4 py-2 border-r border-gray-200">
                    1
                  </span>
                  <button disabled className="bg-white text-gray-500 px-4 py-2">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 border border-gray-200 rounded">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto text-gray-400"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Products Found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any products in this subcategory.</p>
            <Link
              href={`/collections/${category.slug}`}
              className="inline-block bg-gray-800 text-white px-5 py-2 text-sm font-medium rounded hover:bg-gray-700 transition-colors"
            >
              View All {category.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
