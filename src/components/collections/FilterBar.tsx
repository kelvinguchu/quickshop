'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaChevronDown } from 'react-icons/fa'
import { SlidersHorizontal, RefreshCw } from 'lucide-react'
import SortSelect from './SortSelect'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

// Define interfaces (can be shared or redefined here)
interface Subcategory {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface FilterBarProps {
  category: Category
  subcategory?: Subcategory // Optional for CategoryDisplay
  siblingSubcategories?: Subcategory[] // Optional for CategoryDisplay
  currentSort: string
}

export default function FilterBar({
  category,
  subcategory,
  siblingSubcategories,
  currentSort,
}: FilterBarProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    sizes: [],
    featured: false,
    trending: false,
    sort: currentSort || 'latest',
  })

  const basePath = subcategory
    ? `/collections/${category.slug}/${subcategory.slug}`
    : `/collections/${category.slug}`

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const toggleSize = (size) => {
    setSelectedFilters((prev) => {
      const sizes = [...prev.sizes]
      const index = sizes.indexOf(size)
      if (index >= 0) {
        sizes.splice(index, 1)
      } else {
        sizes.push(size)
      }
      return { ...prev, sizes }
    })
  }

  const toggleFeatured = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      featured: !prev.featured,
    }))
  }

  const toggleTrending = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      trending: !prev.trending,
    }))
  }

  const setSort = (sort) => {
    setSelectedFilters((prev) => ({
      ...prev,
      sort,
    }))
  }

  const resetFilters = () => {
    setSelectedFilters({
      sizes: [],
      featured: false,
      trending: false,
      sort: 'latest',
    })
  }

  // Calculate active filter count
  const activeFilterCount = () => {
    let count = 0

    // Count selected sizes
    count += selectedFilters.sizes.length

    // Count boolean filters
    if (selectedFilters.featured) count++
    if (selectedFilters.trending) count++

    // Count sort if not default
    if (selectedFilters.sort !== 'latest') count++

    return count
  }

  // Check if any filters are active
  const hasActiveFilters =
    selectedFilters.sizes.length > 0 ||
    selectedFilters.featured ||
    selectedFilters.trending ||
    selectedFilters.sort !== 'latest'

  // Apply filters function
  const applyFilters = () => {
    let queryParams = new URLSearchParams()

    // Add sort parameter if not default
    if (selectedFilters.sort !== 'latest') {
      queryParams.set('sort', selectedFilters.sort)
    }

    // Add size filter parameters
    if (selectedFilters.sizes.length > 0) {
      queryParams.set('sizes', selectedFilters.sizes.join(','))
    }

    // Add boolean filters
    if (selectedFilters.featured) {
      queryParams.set('featured', 'true')
    }

    if (selectedFilters.trending) {
      queryParams.set('trending', 'true')
    }

    // Create the URL with query parameters
    const targetUrl = queryParams.toString() ? `${basePath}?${queryParams.toString()}` : basePath

    // Navigate to the filtered URL
    router.push(targetUrl)
    setOpen(false)
  }

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden md:flex items-center justify-between flex-wrap gap-2 py-2 border-t border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Filters Section */}
        <div className="flex items-center gap-1 sm:gap-2 flex-nowrap">
          {/* Collection filter dropdown */}
          {siblingSubcategories && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Collection
                  <FaChevronDown className="ml-1 h-2 w-2 sm:ml-1.5 sm:h-2.5 sm:w-2.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 sm:w-56 z-50">
                <DropdownMenuLabel>Select Collection</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/collections/${category.slug}`}
                    className={`w-full ${!subcategory ? 'font-medium bg-accent' : ''}`}
                  >
                    All {category.name}
                  </Link>
                </DropdownMenuItem>
                {siblingSubcategories.map((sibling) => (
                  <DropdownMenuItem key={sibling.id} asChild>
                    <Link
                      href={`/collections/${category.slug}/${sibling.slug}`}
                      className={`w-full ${subcategory?.id === sibling.id ? 'font-medium bg-accent' : ''}`}
                    >
                      {sibling.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Price filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm whitespace-nowrap">
                Price
                <FaChevronDown className="ml-1 h-2 w-2 sm:ml-1.5 sm:h-2.5 sm:w-2.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 sm:w-48 z-50">
              <DropdownMenuLabel>Sort by Price</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`${basePath}?sort=price-asc`}
                  className={`w-full ${currentSort === 'price-asc' ? 'font-medium bg-accent' : ''}`}
                >
                  Low to High
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`${basePath}?sort=price-desc`}
                  className={`w-full ${currentSort === 'price-desc' ? 'font-medium bg-accent' : ''}`}
                >
                  High to Low
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Size filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm whitespace-nowrap">
                Size
                <FaChevronDown className="ml-1 h-2 w-2 sm:ml-1.5 sm:h-2.5 sm:w-2.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 sm:w-48 z-50">
              <DropdownMenuLabel>Filter by Size</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 grid grid-cols-3 gap-1">
                {sizeOptions.map((size) => (
                  <DropdownMenuItem key={size} asChild className="p-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-auto text-xs p-1 border-gray-300 hover:bg-accent"
                    >
                      {size}
                    </Button>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sort Section */}
        <div className="flex-shrink-0">
          <SortSelect
            category={category.slug}
            subcategory={subcategory?.slug}
            currentSort={currentSort}
          />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-[#382f21] text-white flex items-center justify-center shadow-lg"
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 bg-[#d4af37] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount()}
                </div>
              )}
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="sm:min-w-[40vw] min-w-[95vw] bg-white p-0 overflow-y-auto flex flex-col"
          >
            <div className="border-b border-[#e0d8c9]/40 py-3 px-4">
              <SheetTitle className="font-cinzel text-lg text-[#382f21]">Filter & Sort</SheetTitle>
            </div>

            <div className="flex-1 font-montserrat overflow-y-auto divide-y divide-[#e0d8c9]/40">
              {/* Sort section */}
              <div className="p-4">
                <h3 className="font-medium text-[#382f21] mb-3">Sort By</h3>
                <div className="space-y-2.5 pl-1">
                  {[
                    { value: 'latest', label: 'Latest' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`block py-2 text-sm text-left w-full ${
                        selectedFilters.sort === option.value
                          ? 'font-medium text-[#d4af37]'
                          : 'text-[#8a7d65]'
                      }`}
                      onClick={() => setSort(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size filter section */}
              <div className="p-4">
                <h3 className="font-medium text-[#382f21] mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      className={`min-w-16 py-2.5 px-4 text-sm rounded-md border ${
                        selectedFilters.sizes.includes(size)
                          ? 'bg-[#382f21] text-white border-[#382f21]'
                          : 'border-[#e6ded0] text-[#382f21] bg-white'
                      }`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special filters */}
              <div className="p-4">
                <h3 className="font-medium text-[#382f21] mb-3">Product Type</h3>
                <div className="space-y-4 pl-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="filter-featured" className="text-sm text-[#8a7d65]">
                      Featured Products
                    </Label>
                    <Switch
                      id="filter-featured"
                      checked={selectedFilters.featured}
                      onCheckedChange={toggleFeatured}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="filter-trending" className="text-sm text-[#8a7d65]">
                      Trending Products
                    </Label>
                    <Switch
                      id="filter-trending"
                      checked={selectedFilters.trending}
                      onCheckedChange={toggleTrending}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Apply filters and reset buttons */}
            <div className="border-t border-[#e0d8c9]/40 px-4 py-3 mt-auto">
              <div className="flex gap-2">
                <Button
                  className={`flex-1 text-sm bg-transparent border ${
                    hasActiveFilters
                      ? 'border-[#8a7d65] text-[#8a7d65] hover:bg-[#f5f2ec]'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Reset
                </Button>
                <Button
                  className="flex-1 bg-[#382f21] hover:bg-[#262015] text-white py-2.5"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
