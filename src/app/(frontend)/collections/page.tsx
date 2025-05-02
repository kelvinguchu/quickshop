import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata = {
  title: 'Collections - QuickShop',
  description: 'Browse our beautiful Islamic clothing collections',
}

export default async function CollectionsPage() {
  // Initialize payload
  const payload = await getPayload({ config })

  // Fetch main categories with images
  const categoriesData = await payload.find({
    collection: 'categories',
    where: {
      featured: {
        equals: true,
      },
    },
    sort: 'displayOrder',
    depth: 1,
    limit: 10,
  })

  const categories = categoriesData.docs || []

  return (
    <div className="collections-container">
      {categories.length > 0 ? (
        <div className="collections-split">
          {categories.map((category) => (
            <div key={category.id} className={`collection-half ${category.slug}-half`}>
              <div className="collection-overlay"></div>
              {category.image && (
                <Image
                  src={category.image.url}
                  alt={category.name}
                  fill
                  className="absolute inset-0 object-cover z-0"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
              <div className="collection-content">
                <h2>{category.name}</h2>
                <p>{category.description || `Beautiful ${category.name} collection`}</p>
                <Link href={`/collections/${category.slug}`} className="btn btn-primary">
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="collections-empty">
          <h2>No collections available</h2>
          <p>Please check back later for our latest collections</p>
        </div>
      )}
    </div>
  )
}
