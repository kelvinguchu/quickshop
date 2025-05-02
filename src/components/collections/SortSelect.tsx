'use client'

import React from 'react'
import Link from 'next/link'
import { FaChevronDown } from 'react-icons/fa'

interface SortSelectProps {
  category: string
  subcategory?: string
  currentSort: string
}

export default function SortSelect({ category, subcategory, currentSort }: SortSelectProps) {
  const basePath = subcategory
    ? `/collections/${category}/${subcategory}`
    : `/collections/${category}`

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ]

  return (
    <div className="relative group">
      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md flex items-center gap-2 bg-white">
        <span>
          Sort by: {sortOptions.find((opt) => opt.value === currentSort)?.label || 'Latest'}
        </span>
        <FaChevronDown className="w-2.5 h-2.5" />
      </button>
      <div className="absolute z-10 right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block">
        <div className="py-1">
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              href={`${basePath}${option.value === 'latest' ? '' : `?sort=${option.value}`}`}
              className={`block px-4 py-2 text-sm ${
                currentSort === option.value ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
