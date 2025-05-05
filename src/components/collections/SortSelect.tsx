'use client'

import React from 'react'
import Link from 'next/link'
import { FaChevronDown } from 'react-icons/fa'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

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

  const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || 'Latest'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm whitespace-nowrap">
          Sort by: {currentLabel}
          <FaChevronDown className="ml-1 h-2 w-2 sm:ml-1.5 sm:h-2.5 sm:w-2.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 sm:w-48 z-50">
          {sortOptions.map((option) => (
          <DropdownMenuItem key={option.value} asChild>
            <Link
              href={`${basePath}${option.value === 'latest' ? '' : `?sort=${option.value}`}`}
              className={`w-full ${currentSort === option.value ? 'font-medium bg-accent' : ''}`}
            >
              {option.label}
            </Link>
          </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
