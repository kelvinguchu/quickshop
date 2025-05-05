import React from 'react'
import Link from 'next/link'

interface Category {
  name: string
  slug: string
  id: string
}

interface BreadcrumbProps {
  productName: string
  category: string | Category
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ productName, category }) => {
  // Handle category, which could be a string or an object
  const categoryName = typeof category === 'string' ? category : category?.name || 'Category'
  const categorySlug = typeof category === 'string' ? category : category?.slug || ''

  return (
    <div className="border-b border-gray-200 h-[40px] font-montserrat flex items-center">
      <div className="container mx-auto px-4 w-full">
        <div className="flex items-center text-[12px] overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="text-gray-500 hover:text-gray-800 flex-shrink-0">
            Home
          </Link>
          <span className="mx-2 text-gray-400 flex-shrink-0">/</span>
          <Link href="/collections" className="text-gray-500 hover:text-gray-800 flex-shrink-0">
            Collections
          </Link>
          <span className="mx-2 text-gray-400 flex-shrink-0">/</span>
          <Link
            href={`/collections/${categorySlug}`}
            className="text-gray-500 hover:text-gray-800 flex-shrink-0 max-w-[100px] truncate"
          >
            {categoryName}
          </Link>
          <span className="mx-2 text-gray-400 flex-shrink-0">/</span>
          <span className="font-medium text-gray-800 flex-shrink-0 max-w-[120px] truncate">
            {productName}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
