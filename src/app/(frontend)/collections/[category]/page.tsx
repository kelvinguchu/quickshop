import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import SortSelect from '../../components/SortSelect'

import config from '@/payload.config'

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params

  try {
    // Initialize payload
    const payload = await getPayload({ config })

    // Fetch the category to get its name
    const categoryData = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    })

    if (categoryData.docs.length === 0) {
      return {
        title: 'Not Found',
        description: 'Page not found',
      }
    }

    const categoryName = categoryData.docs[0].name

    return {
      title: `${categoryName} Collection - QuickShop`,
      description: `Browse our premium ${categoryName.toLowerCase()} collection`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Collections - QuickShop',
      description: 'Browse our collections',
    }
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { category } = await params

  // Get sort parameter or default to 'latest'
  const sortParam = await searchParams
  const sort = typeof sortParam.sort === 'string' ? sortParam.sort : 'latest'

  // Initialize payload
  const payload = await getPayload({ config })

  // Fetch the category
  const categoryData = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: category,
      },
    },
    limit: 1,
  })

  if (categoryData.docs.length === 0) {
    notFound()
  }

  const categoryDoc = categoryData.docs[0]
  const categoryId = categoryDoc.id
  const categoryName = categoryDoc.name

  // Initialize with empty data
  let subcategories = { docs: [] }
  let products = { docs: [], totalDocs: 0 }

  try {
    // Fetch subcategories for the current category
    subcategories = await payload.find({
      collection: 'subcategories',
      where: {
        category: {
          equals: categoryId,
        },
      },
      sort: 'displayOrder',
    })
  } catch (error) {
    console.error('Error fetching subcategories:', error)
  }

  try {
    // Build the query for products
    const productsQuery = {
      collection: 'products',
      where: {
        category: {
          equals: categoryId,
        },
      },
      sort: sort === 'price-desc' ? '-price' : sort === 'price-asc' ? 'price' : '-createdAt',
      limit: 12,
    }

    // Fetch products
    products = await payload.find(productsQuery)
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className={`category-header ${category}-header`}>
        <div className="category-overlay"></div>
        {categoryDoc.bannerImage && (
          <Image
            src={categoryDoc.bannerImage.url}
            alt={categoryName}
            fill
            className="absolute inset-0 object-cover z-0"
            sizes="100vw"
            priority
          />
        )}
        <div className="category-header-content">
          <h1>{categoryName} Collection</h1>
          <p>{categoryDoc.description || `Explore our ${categoryName} collection`}</p>
        </div>
      </div>

      <div className="category-content container">
        <div className="category-layout">
          {/* Sidebar with filters */}
          <aside className="category-sidebar">
            <div className="filter-section">
              <h3>Subcategories</h3>
              <ul className="filter-list">
                <li>
                  <Link href={`/collections/${category}`} className="filter-item active">
                    All {categoryName}
                  </Link>
                </li>
                {subcategories.docs.map((subcat) => (
                  <li key={subcat.id}>
                    <Link href={`/collections/${category}/${subcat.slug}`} className="filter-item">
                      {subcat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              {/* Price filter options */}
              <ul className="filter-list">
                <li>
                  <Link
                    href={`/collections/${category}?sort=price-asc`}
                    className={`filter-item ${sort === 'price-asc' ? 'active' : ''}`}
                  >
                    Low to High
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/collections/${category}?sort=price-desc`}
                    className={`filter-item ${sort === 'price-desc' ? 'active' : ''}`}
                  >
                    High to Low
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Products grid */}
          <div className="products-container">
            <div className="products-header">
              <h2>All {categoryName}</h2>
              <SortSelect category={category} currentSort={sort} />
            </div>

            {products.docs.length > 0 ? (
              <div className="products-grid">
                {products.docs.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="product-card">
                    {product.mainImage && (
                      <div className="product-image">
                        <Image
                          src={product.mainImage.url}
                          alt={product.name}
                          width={300}
                          height={400}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-price">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products found.</p>
              </div>
            )}

            {/* Pagination placeholder - to be implemented later */}
            {products.docs.length > 0 && (
              <div className="pagination">
                <span>Page 1 of {Math.ceil(products.totalDocs / 12)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
