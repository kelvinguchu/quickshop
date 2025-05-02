import React, { useState } from 'react'
import { FaShoppingBag, FaRegHeart } from 'react-icons/fa'

interface RichTextNode {
  children?: Array<{
    text?: string
    [key: string]: any
  }>
  [key: string]: any
}

interface RichText {
  root?: {
    children?: RichTextNode[]
  }
  [key: string]: any
}

interface ColorVariation {
  color: string
  colorCode: string
  image: any
  additionalImages?: any[]
}

interface SizeVariation {
  size: string
  inStock: boolean
}

interface HeightRange {
  min: number
  max: number
  label: string
}

interface ProductDetailsProps {
  name: string
  price: number
  description: string | RichText
  color?: string
  colorCode?: string
  colorVariations?: ColorVariation[]
  sizeVariations?: SizeVariation[]
  heightRanges?: HeightRange[]
  onColorSelect?: (colorVariation: ColorVariation | { color: string; colorCode: string }) => void
}

// Standard size options for comparison
const ALL_SIZE_OPTIONS = [
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
  { label: 'XXL', value: 'XXL' },
]

const ProductDetails: React.FC<ProductDetailsProps> = ({
  name,
  price,
  description,
  color = '',
  colorCode = '',
  colorVariations = [],
  sizeVariations = [],
  heightRanges = [],
  onColorSelect,
}) => {
  // Combine main color and color variations for display
  const allColorOptions =
    color && colorCode
      ? [
          { color, colorCode, isMain: true },
          ...colorVariations.map((v) => ({ ...v, isMain: false })),
        ]
      : colorVariations.map((v) => ({ ...v, isMain: false }))

  // State for selected options
  const [selectedColor, setSelectedColor] = useState<string | null>(
    allColorOptions.length > 0 ? allColorOptions[0]?.colorCode : null,
  )
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizeVariations.length > 0 ? sizeVariations[0]?.size : null,
  )
  const [selectedHeight, setSelectedHeight] = useState<string | null>(
    heightRanges.length > 0 ? heightRanges[0]?.label : null,
  )

  // Format description for display
  const formattedDescription = React.useMemo(() => {
    if (typeof description === 'string') {
      return description
    } else if (description && description.root && description.root.children) {
      return description.root.children
        .map((node) => {
          if (node.children && Array.isArray(node.children)) {
            return node.children
              .filter((child) => child.text)
              .map((child) => child.text)
              .join(' ')
          }
          return ''
        })
        .join(' ')
    }
    return 'No description available'
  }, [description])

  // Handle color selection
  const handleColorSelect = (colorOption: any) => {
    setSelectedColor(colorOption.colorCode)
    if (onColorSelect) {
      onColorSelect(colorOption)
    }
  }

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  // Handle height selection
  const handleHeightSelect = (heightLabel: string) => {
    setSelectedHeight(heightLabel)
  }

  return (
    <div className="w-full md:w-1/2 space-y-4">
      {/* Product title and price */}
      <div className="pb-1 border-b border-gray-100">
        <h2 className="font-cinzel text-lg font-medium text-[#382f21]">{name}</h2>
        <p className="font-cormorant text-base text-[#8a7d65] mt-0.5">
          ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
        </p>
      </div>

      {/* Description */}
      <div className="pb-2">
        <h3 className="text-xs uppercase tracking-wide font-medium text-[#382f21] mb-1.5">
          Description
        </h3>
        <p className="text-xs leading-relaxed text-gray-600">{formattedDescription}</p>
      </div>

      {/* Color Selection - Only show if color variations are available */}
      {allColorOptions.length > 0 && (
        <div className="pb-2">
          <h3 className="text-xs uppercase tracking-wide font-medium text-[#382f21] mb-2">Color</h3>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {allColorOptions.map((colorOption) => (
                <button
                  key={colorOption.colorCode}
                  className={`w-5 h-5 rounded-full border ${
                    selectedColor === colorOption.colorCode
                      ? 'border-[#d4af37] ring-1 ring-[#d4af37]'
                      : 'border-gray-300'
                  } ${colorOption.isMain ? 'ring-1 ring-gray-400' : ''} focus:outline-none focus:ring-1 focus:ring-[#d4af37]`}
                  style={{ backgroundColor: colorOption.colorCode }}
                  aria-label={`Select ${colorOption.color} color`}
                  onClick={() => handleColorSelect(colorOption)}
                />
              ))}
            </div>
            {selectedColor && (
              <p className="text-xs text-gray-500">
                {allColorOptions.find((v) => v.colorCode === selectedColor)?.color}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Size Selection - Show all standard sizes but disable unavailable ones */}
      {sizeVariations.length > 0 && (
        <div className="pb-2">
          <h3 className="text-xs uppercase tracking-wide font-medium text-[#382f21] mb-2">Size</h3>
          <div className="grid grid-cols-5 gap-2">
            {ALL_SIZE_OPTIONS.map((sizeOption) => {
              const sizeVariation = sizeVariations.find((v) => v.size === sizeOption.value)
              const isAvailable = Boolean(sizeVariation?.inStock)

              return (
                <button
                  key={sizeOption.value}
                  className={`py-1 px-0 border ${
                    selectedSize === sizeOption.value
                      ? 'border-[#8a7d65] bg-[#8a7d65] text-white'
                      : isAvailable
                        ? 'border-gray-300 hover:border-[#8a7d65]'
                        : 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50'
                  } rounded text-xs transition-colors`}
                  disabled={!isAvailable}
                  onClick={() => isAvailable && handleSizeSelect(sizeOption.value)}
                >
                  {sizeOption.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Height Range - Show options if available */}
      {heightRanges.length > 0 && (
        <div className="pb-2">
          <h3 className="text-xs uppercase tracking-wide font-medium text-[#382f21] mb-2">
            Height
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {heightRanges.map((range) => (
              <button
                key={range.label}
                className={`py-1 border ${
                  selectedHeight === range.label
                    ? 'border-[#8a7d65] bg-[#8a7d65] text-white'
                    : 'border-gray-300 hover:border-[#8a7d65]'
                } rounded text-xs transition-colors px-1`}
                onClick={() => handleHeightSelect(range.label)}
              >
                {range.label} ({range.min}-{range.max}cm)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button className="flex-1 bg-[#382f21] hover:bg-[#4e4538] text-white py-2 px-4 rounded flex items-center justify-center gap-1.5 text-xs transition-colors">
          <FaShoppingBag className="w-3 h-3" />
          <span>Add to Cart</span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center bg-white border border-[#e6ded0] rounded text-[#8a7d65] hover:text-[#382f21] hover:border-[#8a7d65] transition-colors">
          <FaRegHeart className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default ProductDetails
