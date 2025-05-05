import React, { useState } from 'react'
import { FaShoppingBag, FaRegHeart, FaHeart } from 'react-icons/fa'
import { Check, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { useWishlistStore } from '@/lib/wishlist/wishlistStore'
import { CartSheet } from '@/components/cart/CartSheet'

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
  image: {
    url: string
  }
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

interface ConfettiEmoji {
  id: number
  emoji: string
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
}

interface ProductDetailsProps {
  id: string
  name: string
  price: number
  description: string | RichText
  mainImage?: { url: string } | null
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
  id,
  name,
  price,
  description,
  mainImage,
  color = '',
  colorCode = '',
  colorVariations = [],
  sizeVariations = [],
  heightRanges = [],
  onColorSelect,
}) => {
  const { addItem: addToCart, items: cartItems } = useCart()
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
    items: wishlistItems,
  } = useWishlistStore()

  // Combine main color and color variations for display
  const allColorOptions =
    color && colorCode
      ? [
          { color, colorCode, isMain: true, image: mainImage },
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

  // State for button confirmations
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const isProductInCart = cartItems.some((item) => item.id === id)
  const isProductInWishlist = isInWishlist(id)

  // Emoji confetti states
  const [cartConfetti, setCartConfetti] = useState<ConfettiEmoji[]>([])
  const [wishlistConfetti, setWishlistConfetti] = useState<ConfettiEmoji[]>([])

  // Determine the image to use for cart/wishlist based on selected color
  const getSelectedImage = () => {
    const selectedColorOption = allColorOptions.find((v) => v.colorCode === selectedColor)
    return selectedColorOption?.image?.url || mainImage?.url || undefined
  }

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

  // Create emoji confetti effect
  const createConfetti = (type: 'cart' | 'wishlist', buttonRef: Element | null) => {
    if (!buttonRef) return

    // Define emojis based on the type
    const emojis = type === 'cart' ? ['🛍️', '✨', '💼'] : ['❤️', '💕', '✨']

    // Get button position for confetti
    const rect = buttonRef.getBoundingClientRect()

    // Create random positions for each emoji
    const confetti = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 60 - 30, // Random X offset from -30 to 30
      y: -(Math.random() * 60 + 20), // Upward Y offset from -20 to -80
      rotation: Math.random() * 360, // Random rotation
      scale: 0.5 + Math.random() * 1, // Random scale between 0.5 and 1.5
      opacity: 0.8 + Math.random() * 0.2, // Random opacity between 0.8 and 1
    }))

    // Set the confetti state based on type
    if (type === 'cart') {
      setCartConfetti(confetti)
      setTimeout(() => setCartConfetti([]), 1000) // Clear after animation
    } else {
      setWishlistConfetti(confetti)
      setTimeout(() => setWishlistConfetti([]), 1000) // Clear after animation
    }
  }

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

  // Handle Add to Cart
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isProductInCart) {
      addToCart({
        id: id,
        name: name,
        price: price,
        quantity: 1,
        image: getSelectedImage(),
      })
      setIsAddedToCart(true)
      createConfetti('cart', e.currentTarget)
      setTimeout(() => setIsAddedToCart(false), 2000)
    }
  }

  // Handle Wishlist Toggle
  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isProductInWishlist) {
      removeFromWishlist(id)
    } else {
      addToWishlist({
        id: id,
        name: name,
        price: price,
        image: getSelectedImage(),
      })
      createConfetti('wishlist', e.currentTarget)
    }
  }

  return (
    <div className="w-full md:w-1/2 space-y-4 mt-1 md:mt-0 relative">
      {/* Product title and price */}
      <div className="pb-1 border-b border-gray-100">
        <h2 className="font-cinzel text-lg sm:text-xl font-medium text-[#382f21]">{name}</h2>
        <p className="font-cormorant text-base sm:text-lg text-[#8a7d65] mt-0.5">
          ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
        </p>
      </div>

      {/* Description */}
      <div className="pb-2">
        <h3 className="text-xs uppercase tracking-wide font-medium text-[#382f21] mb-1.5">
          Description
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-gray-600">{formattedDescription}</p>
      </div>

      {/* Color Selection */}
      {allColorOptions.length > 0 && (
        <div className="pb-2">
          <h3 className="text-xs uppercase tracking-wide font-medium text-[#382f21] mb-2">Color</h3>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {allColorOptions.map((colorOption) => (
                <button
                  key={colorOption.colorCode}
                  className={`w-6 h-6 sm:w-5 sm:h-5 rounded-full border ${
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

      {/* Size Selection */}
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
                  className={`py-2 sm:py-1 px-0 border ${
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

      {/* Height Range */}
      {heightRanges.length > 0 && (
        <div className="pb-2">
          <h3 className="text-xs uppercase tracking-wide font-medium text-[#382f21] mb-2">
            Height
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {heightRanges.map((range) => (
              <button
                key={range.label}
                className={`py-2 sm:py-1 border ${
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
      <div className="flex gap-2 pt-2 relative">
        {isProductInCart ? (
          <CartSheet>
            <button className="flex-1 bg-[#8a7d65] font-montserrat border border-[#8a7d65] text-white py-3 sm:py-2 px-4 rounded flex items-center justify-center gap-1.5 text-xs transition-colors">
              <ShoppingCart className="w-3 h-3" />
              <span>View Cart</span>
            </button>
          </CartSheet>
        ) : (
          <button
            className={`flex-1 py-3 sm:py-2 px-4 rounded flex items-center justify-center gap-1.5 text-xs transition-colors ${
              isAddedToCart
                ? 'bg-green-600 text-white border border-green-600'
                : 'bg-[#382f21] hover:bg-[#4e4538] text-white'
            }`}
            onClick={handleAddToCart}
          >
            {isAddedToCart ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <FaShoppingBag className="w-3 h-3" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
        <button
          className="w-12 h-12 sm:w-9 sm:h-9 flex items-center justify-center bg-white border border-[#e6ded0] rounded text-[#8a7d65] hover:text-[#382f21] hover:border-[#8a7d65] transition-colors"
          onClick={handleWishlistToggle}
          aria-label={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isProductInWishlist ? (
            <FaHeart className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-red-500" />
          ) : (
            <FaRegHeart className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          )}
        </button>

        {/* Cart Confetti Effect */}
        {cartConfetti.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute z-10 pointer-events-none"
            style={{
              left: '30%',
              bottom: '0',
              transform: `translate(${emoji.x}px, ${emoji.y}px) rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
              opacity: emoji.opacity,
              animation: 'confetti 1s ease-out forwards',
            }}
          >
            {emoji.emoji}
          </div>
        ))}

        {/* Wishlist Confetti Effect */}
        {wishlistConfetti.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute z-10 pointer-events-none"
            style={{
              right: '12px',
              bottom: '12px',
              transform: `translate(${emoji.x}px, ${emoji.y}px) rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
              opacity: emoji.opacity,
              animation: 'confetti 1s ease-out forwards',
            }}
          >
            {emoji.emoji}
          </div>
        ))}
      </div>

      {/* Add confetti animation style */}
      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(var(--x, 0), var(--y, -60px)) rotate(var(--r, 360deg))
              scale(var(--s, 1.5));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default ProductDetails
