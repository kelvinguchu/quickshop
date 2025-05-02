import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import SortSelect from '../../../components/SortSelect'

import config from '@/payload.config'

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params

  // Initialize payload
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let categoryDoc = null
  let subcategory = null

  try {
    // First get category
    const categoryQuery = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    })

    if (categoryQuery.docs.length === 0) {
      return {
        title: 'Not Found',
        description: 'Page not found',
      }
    }

    categoryDoc = categoryQuery.docs[0]

    // Fetch subcategory
    const subcategoryQuery = await payload.find({
      collection: 'subcategories',
      where: {
        slug: {
          equals: slug,
        },
        category: {
          equals: categoryDoc.id,
        },
      },
      limit: 1,
    })

    if (subcategoryQuery.docs.length > 0) {
      subcategory = subcategoryQuery.docs[0]
    }
  } catch (error) {
    console.error('Error fetching subcategory for metadata:', error)
  }

  if (!subcategory) {
    return {
      title: 'Not Found',
      description: 'Page not found',
    }
  }

  return {
    title: `${subcategory.name} ${categoryDoc.name} - QuickShop`,
    description:
      subcategory.description || `Browse our ${subcategory.name} ${categoryDoc.name} collection`,
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: { category: string; slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { category, slug } = params

  // Only allow abaya and qamis categories
  if (category !== 'abaya' && category !== 'qamis') {
    notFound()
  }

  // Get sort parameter or default to 'latest'
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'latest'

  // Initialize payload
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Initialize with empty data
  let categoryDoc = null
  let subcategory = null
  let subcategories = { docs: [] }
  let products = { docs: [], totalDocs: 0 }

  try {
    // Fetch category
    const categoryQuery = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    })

    if (categoryQuery.docs.length === 0) {
      notFound()
    }

    categoryDoc = categoryQuery.docs[0]

    // Fetch subcategory
    const subcategoryQuery = await payload.find({
      collection: 'subcategories',
      where: {
        slug: {
          equals: slug,
        },
        category: {
          equals: categoryDoc.id,
        },
      },
      limit: 1,
    })

    if (subcategoryQuery.docs.length === 0) {
      notFound()
    }

    subcategory = subcategoryQuery.docs[0]
  } catch (error) {
    console.error('Error fetching subcategory:', error)
    notFound()
  }

  try {
    // Fetch all subcategories for the sidebar
    subcategories = await payload.find({
      collection: 'subcategories',
      where: {
        category: {
          equals: categoryDoc.id,
        },
      },
      sort: 'displayOrder',
    })
  } catch (error) {
    console.error('Error fetching all subcategories:', error)
  }

  try {
    // Build the query for products
    const productsQuery = {
      collection: 'products',
      where: {
        AND: [
          {
            category: {
              equals: categoryDoc.id,
            },
          },
          {
            subcategory: {
              equals: subcategory.id,
            },
          },
        ],
      },
      sort: sort === 'price-desc' ? '-price' : sort === 'price-asc' ? 'price' : '-createdAt',
      limit: 12,
    }

    // Fetch products
    products = await payload.find(productsQuery)
  } catch (error) {
    console.error('Error fetching products for subcategory:', error)
  }

  return (
    <div className="category-page">
      {/* Subcategory Header */}
      <div className={`category-header subcategory-header`}>
        {subcategory.image ? (
          <Image
            src={subcategory.image.url}
            alt={subcategory.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          // Fallback to category background
          <div className={`${category}-background`}></div>
        )}
        <div className="category-overlay"></div>
        <div className="category-header-content">
          <h1>
            {subcategory.name} {categoryDoc.name}
          </h1>
          {subcategory.description && <p>{subcategory.description}</p>}
        </div>
      </div>

      <div className="category-content container">
        <div className="breadcrumbs">
          <Link href="/" className="breadcrumb-item">
            Home
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/collections" className="breadcrumb-item">
            Collections
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link href={`/collections/${category}`} className="breadcrumb-item">
            {category === 'abaya' ? 'Abayas' : 'Qamis'}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item current">{subcategory.name}</span>
        </div>

        <div className="category-layout">
          {/* Sidebar with filters */}
          <aside className="category-sidebar">
            <div className="filter-section">
              <h3>Subcategories</h3>
              <ul className="filter-list">
                <li>
                  <Link href={`/collections/${category}`} className="filter-item">
                    All {category === 'abaya' ? 'Abayas' : 'Qamis'}
                  </Link>
                </li>
                {subcategories.docs.map((subcat) => (
                  <li key={subcat.id}>
                    <Link
                      href={`/collections/${category}/${subcat.slug}`}
                      className={`filter-item ${subcat.id === subcategory.id ? 'active' : ''}`}
                    >
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
                    href={`/collections/${category}/${slug}?sort=price-asc`}
                    className={`filter-item ${sort === 'price-asc' ? 'active' : ''}`}
                  >
                    Low to High
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/collections/${category}/${slug}?sort=price-desc`}
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
              <h2>
                {subcategory.name} {categoryDoc.name}
              </h2>
              <SortSelect category={category} subcategory={slug} currentSort={sort} />
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
                <p>No products found in this subcategory.</p>
                <Link href={`/collections/${category}`} className="btn btn-primary mt-4">
                  View All {category === 'abaya' ? 'Abayas' : 'Qamis'}
                </Link>
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
