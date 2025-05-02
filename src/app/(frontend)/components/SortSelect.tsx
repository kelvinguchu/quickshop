'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface SortSelectProps {
  category?: string
  subcategory?: string
  currentSort: string
}

export default function SortSelect({ category, subcategory, currentSort }: SortSelectProps) {
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = subcategory
      ? `/collections/${category}/${subcategory}?sort=${e.target.value}`
      : `/collections/${category}?sort=${e.target.value}`

    router.push(url)
  }

  return (
    <div className="products-sort">
      <label htmlFor="sort">Sort by:</label>
      <select id="sort" className="sort-select" onChange={handleChange} value={currentSort}>
        <option value="latest">Latest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  )
}
