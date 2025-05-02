import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductImage {
  url: string
  alt?: string
}

interface RelatedProduct {
  id: string
  name: string | any
  price: number | any
  mainImage?: ProductImage | null
}

interface RelatedProductsProps {
  products: RelatedProduct[]
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="mt-16">
        <h2 className="font-cinzel text-xl font-bold text-[#382f21] mb-6 text-center">
          You May Also Like
        </h2>
        <div className="col-span-4 text-center py-8 text-gray-500">No related products found</div>
      </div>
    )
  }

  return (
    <div className="mt-16">
      <h2 className="font-cinzel text-xl font-bold text-[#382f21] mb-6 text-center">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-100 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
              {product.mainImage ? (
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.mainImage.url}
                    alt={typeof product.name === 'string' ? product.name : 'Product'}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </Link>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>

            <div className="p-3">
              <Link href={`/products/${product.id}`} className="block">
                <h3 className="text-sm font-cinzel font-medium text-[#382f21] truncate">
                  {typeof product.name === 'string' ? product.name : 'Product'}
                </h3>
                <p className="mt-1 text-sm font-bold text-[#8a7d65]">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
