import React from 'react'
import MobileCollectionView from './MobileCollectionView'
import DesktopCollectionView from './DesktopCollectionView'

interface Category {
  id: string
  name: string
  slug: string
  image?: {
    url: string
  }
  mainImage?: string
}

interface CollectionsGridProps {
  categories: Category[]
}

export default function CollectionsGrid({ categories }: CollectionsGridProps) {
  // Map the categories data to the format expected by our component
  const processedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image?.url || '',
    mainImage: cat.image?.url || '',
  }))

  // Specify default images when no categories exist
  const defaultCategories = [
    {
      id: '1',
      name: 'Abayas',
      slug: 'abayas',
      mainImage: '/abayas/abaya1.webp',
    },
    {
      id: '2',
      name: 'Qamis',
      slug: 'qamis',
      mainImage: '/qamis/qamis1.webp',
    },
  ]

  // Use processed categories if they exist, otherwise use defaults
  const displayCategories = processedCategories.length > 0 ? processedCategories : defaultCategories

  return (
    <div className="bg-[#f9f6f2]">
      <MobileCollectionView categories={displayCategories} />
      <DesktopCollectionView categories={displayCategories} />
    </div>
  )
}
