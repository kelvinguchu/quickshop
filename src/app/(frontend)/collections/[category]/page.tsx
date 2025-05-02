import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import CategoryDisplay from '@/components/collections/CategoryDisplay'

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
  const resolvedSearchParams = await searchParams

  // Get sort parameter or default to 'latest'
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'latest'

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

  // Initialize with empty data
  let subcategories = { docs: [] }
  let products = { docs: [], totalDocs: 0 }

  try {
    // Fetch all subcategories for the current category
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
    <CategoryDisplay
      category={categoryDoc}
      subcategories={subcategories.docs}
      products={products.docs}
      totalProducts={products.totalDocs}
      currentSort={sort}
    />
  )
}
