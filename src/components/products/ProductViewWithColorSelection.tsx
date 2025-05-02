'use client'

import React, { useState, useEffect } from 'react'
import ProductGallery from './ProductGallery'
import ProductDetails from './ProductDetails'

interface ProductImage {
  url: string
  alt?: string
}

interface ProductViewWithColorSelectionProps {
  product: any
  additionalImages: ProductImage[]
}

const ProductViewWithColorSelection: React.FC<ProductViewWithColorSelectionProps> = ({
  product,
  additionalImages,
}) => {
  // Initialize with main color if available, otherwise first color variation
  const defaultColor =
    product.colorCode ||
    (product.colorVariations?.length > 0 ? product.colorVariations[0].colorCode : null)

  // State for the selected color
  const [selectedColorCode, setSelectedColorCode] = useState<string | null>(defaultColor)

  // Handle color selection
  const handleColorSelect = (colorVariation: any) => {
    setSelectedColorCode(colorVariation.colorCode)
  }

  // Update color when product changes
  useEffect(() => {
    setSelectedColorCode(defaultColor)
  }, [product, defaultColor])

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <ProductGallery
        mainImage={product.mainImage}
        additionalImages={additionalImages}
        productName={product.name}
        colorVariations={product.colorVariations}
        selectedColorCode={selectedColorCode}
      />

      <ProductDetails
        name={product.name}
        price={product.price}
        description={product.description}
        color={product.color}
        colorCode={product.colorCode}
        colorVariations={product.colorVariations}
        sizeVariations={product.sizeVariations}
        heightRanges={product.heightRanges}
        onColorSelect={handleColorSelect}
      />
    </div>
  )
}

export default ProductViewWithColorSelection
