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
    <div className="border-b border-gray-200 h-[40px] flex items-center ">
      <div className="container mx-auto px-4">
        <div className="flex items-center text-[12px]">
          <Link href="/" className="text-gray-500 hover:text-gray-800">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/collections" className="text-gray-500 hover:text-gray-800">
            Collections
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/collections/${categorySlug}`} className="text-gray-500 hover:text-gray-800">
            {categoryName}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-medium text-gray-800">{productName}</span>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
