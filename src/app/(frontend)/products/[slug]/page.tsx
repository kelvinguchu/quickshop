import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Import our components
import ProductGallery from '@/components/products/ProductGallery'
import ProductDetails from '@/components/products/ProductDetails'
import RelatedProducts from '@/components/products/RelatedProducts'
import Breadcrumb from '@/components/products/Breadcrumb'

// Client component wrapper for product details section with dynamic color selection
import dynamic from 'next/dynamic'

// Import the client component for handling color selection
const ProductViewWithColorSelection = dynamic(
  () => import('@/components/products/ProductViewWithColorSelection'),
  { ssr: true },
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    // Initialize payload
    const payload = await getPayload({ config })

    // Fetch the product
    const productQuery = await payload.find({
      collection: 'products',
      where: {
        id: {
          equals: slug,
        },
      },
      limit: 1,
    })

    if (productQuery.docs.length === 0) {
      return {
        title: 'Not Found',
        description: 'Product not found',
      }
    }

    const product = productQuery.docs[0]

    // Handle description properly, as it's a richText field
    let descriptionText = ''
    if (product.description) {
      // Check if it's a string or richText object
      if (typeof product.description === 'string') {
        descriptionText = product.description.slice(0, 160)
      } else if (product.description.root && product.description.root.children) {
        // Extract text from the richText structure
        descriptionText = product.description.root.children
          .map((node) => {
            // Try to extract text from paragraph nodes
            if (node.children && Array.isArray(node.children)) {
              return node.children
                .filter((child) => child.text)
                .map((child) => child.text)
                .join(' ')
            }
            return ''
          })
          .join(' ')
          .slice(0, 160)
      }
    }

    return {
      title: `${product.name} - QuickShop`,
      description: descriptionText || 'View product details',
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product - QuickShop',
      description: 'View product details',
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Initialize payload
  const payload = await getPayload({ config })

  // Fetch the product
  const productQuery = await payload.find({
    collection: 'products',
    where: {
      id: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (productQuery.docs.length === 0) {
    notFound()
  }

  const product = productQuery.docs[0]

  // Fetch related products (same category)
  let relatedProducts = { docs: [] }
  try {
    relatedProducts = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            category: {
              equals:
                typeof product.category === 'string' ? product.category : product.category?.id,
            },
          },
          {
            id: {
              not_equals: product.id,
            },
          },
        ],
      },
      limit: 4,
    })
  } catch (error) {
    console.error('Error fetching related products:', error)
  }

  // Fetch additional product images if they exist
  const additionalImages =
    product.images && Array.isArray(product.images)
      ? product.images.map((img) => ({ url: img.url, alt: product.name }))
      : []

  return (
    <div className="w-full bg-white md:mt-8">
      <Breadcrumb productName={product.name} category={product.category} />

      <div className="container mx-auto mt-10 px-4 py-8">
        <ProductViewWithColorSelection product={product} additionalImages={additionalImages} />
        <div className="pb-24 md:pb-0">
          <RelatedProducts products={relatedProducts.docs} />
        </div>
      </div>
    </div>
  )
}
