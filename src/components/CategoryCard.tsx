import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug?: string
    parentCategory?: string
    image?: {
      url: string
    }
    staticImage?: string // For using static images from public folder
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Handle image source (either from CMS or static folder)
  const imageSource = category.image?.url || category.staticImage || '/placeholder-category.jpg'

  // Create the link URL based on available data
  const linkUrl = category.parentCategory
    ? `/collections/${category.parentCategory}/${category.slug}`
    : `/collections/${category.slug || category.id}`

  return (
    <div className="group relative overflow-hidden rounded-sm">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1a1a1a]/20 transition-all duration-500 group-hover:bg-[#1a1a1a]/40 z-10"></div>

      {/* Image */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <Image
          src={imageSource}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6">
        <h3 className="font-cinzel text-2xl md:text-3xl font-semibold text-white mb-2 transform transition-transform duration-500 group-hover:translate-y-0">
          {category.name}
        </h3>
        <Link
          href={linkUrl}
          className="inline-flex items-center font-montserrat text-xs uppercase tracking-wider bg-transparent text-white border border-white/70 px-5 py-2 mt-4 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white/20"
        >
          Explore Collection
          <FaArrowRight className="ml-2 h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
