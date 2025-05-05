"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlistStore } from "@/lib/wishlist/wishlistStore";
import { CartSheet } from "@/components/cart/CartSheet";

interface ProductCardProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    price: number;
    mainImage?: {
      url: string;
    };
    staticImage?: string;
  };
  imageWidth?: number;
  imageHeight?: number;
}

interface ConfettiEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

export default function ProductCard({
  product,
  imageWidth = 400,
  imageHeight = 500,
}: Readonly<ProductCardProps>) {
  const { addItem, items } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Emoji confetti states
  const [cartConfetti, setCartConfetti] = useState<ConfettiEmoji[]>([]);
  const [wishlistConfetti, setWishlistConfetti] = useState<ConfettiEmoji[]>([]);

  // Handle image source (either from CMS or static folder)
  const imageSource = product.mainImage?.url ?? product.staticImage;

  // Check if the product is in wishlist and cart when component mounts or cart/wishlist changes
  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
    setIsInCart(items.some((item) => item.id === product.id));
  }, [isInWishlist, product.id, items]);

  // Create emoji confetti effect
  const createConfetti = (
    type: "cart" | "wishlist",
    buttonRef: Element | null
  ) => {
    if (!buttonRef) return;

    // Define emojis based on the type
    const emojis = type === "cart" ? ["🛍️", "✨", "💼"] : ["❤️", "💕", "✨"];

    // Get button position for confetti
    const rect = buttonRef.getBoundingClientRect();

    // Create random positions for each emoji
    const confetti = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 60 - 30, // Random X offset from -30 to 30
      y: -(Math.random() * 60 + 20), // Upward Y offset from -20 to -80
      rotation: Math.random() * 360, // Random rotation
      scale: 0.5 + Math.random() * 1, // Random scale between 0.5 and 1.5
      opacity: 0.8 + Math.random() * 0.2, // Random opacity between 0.8 and 1
    }));

    // Set the confetti state based on type
    if (type === "cart") {
      setCartConfetti(confetti);
      setTimeout(() => setCartConfetti([]), 1000); // Clear after animation
    } else {
      setWishlistConfetti(confetti);
      setTimeout(() => setWishlistConfetti([]), 1000); // Clear after animation
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageSource,
      });
      setIsWishlisted(true);
      createConfetti("wishlist", e.currentTarget);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    if (!isInCart) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: imageSource,
      });

      // Show confirmation
      setIsAddedToCart(true);
      createConfetti("cart", e.currentTarget);

      // Reset after 2 seconds
      setTimeout(() => {
        setIsAddedToCart(false);
        setIsInCart(true);
      }, 2000);
    }
  };

  return (
    <div
      className='group relative overflow-hidden border border-[#e0d8c9]/40 rounded-sm bg-white transition-all duration-300 hover:shadow-md hover:border-[#e0d8c9]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Product Image with elegant overlay on hover */}
      <Link href={`/products/${product.id}`} className='block'>
        <div className='relative aspect-[4/5] w-full overflow-hidden bg-[#f9f6f2]'>
          <Image
            src={imageSource}
            alt={product.name}
            fill
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
            className='object-cover transition-all duration-700 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-[#382f21]/0 transition-all duration-300 group-hover:bg-[#382f21]/10'></div>
        </div>
      </Link>

      {/* Wishlist button - elegant positioning */}
      <button
        onClick={handleWishlistToggle}
        className='absolute right-1 bottom-24 sm:bottom-28 flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors'
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
        {isWishlisted ? (
          <FaHeart className='text-red-500 w-4 h-4 sm:w-4 sm:h-4' />
        ) : (
          <FaRegHeart className='text-[#382f21] w-4 h-4 sm:w-4 sm:h-4' />
        )}
      </button>

      {/* Wishlist Confetti Effect */}
      {wishlistConfetti.map((emoji) => (
        <div
          key={emoji.id}
          className='absolute z-10 pointer-events-none'
          style={{
            right: "12px",
            bottom: "112px",
            transform: `translate(${emoji.x}px, ${emoji.y}px) rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
            opacity: emoji.opacity,
            animation: "confetti 1s ease-out forwards",
          }}>
          {emoji.emoji}
        </div>
      ))}

      {/* Price tag - elegant ribbon style */}
      <div className='absolute top-0 left-0 bg-[#382f21] text-white py-0.5 sm:py-1 px-2 sm:px-4 font-cormorant text-sm sm:text-lg font-semibold clip-path-ribbon'>
        ${product.price.toFixed(2)}
      </div>

      {/* Add ribbon clip path to make the price tag more elegant */}
      <style jsx global>{`
        .clip-path-ribbon {
          clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
        }

        @keyframes confetti {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(var(--x, 0), var(--y, -60px))
              rotate(var(--r, 360deg)) scale(var(--s, 1.5));
            opacity: 0;
          }
        }
      `}</style>

      {/* Product Info - refined typography and spacing */}
      <div className='p-2 sm:p-3 border-t border-[#e0d8c9]/40'>
        <h3 className='font-cinzel text-xs sm:text-sm font-medium text-[#382f21]'>
          <Link
            href={`/products/${product.id}`}
            className='hover:text-[#8a7d65] transition-colors'>
            {product.name}
          </Link>
        </h3>

        {/* Add to Cart Button - elegant hover effect */}
        <div className='mt-1.5 sm:mt-2'>
          {isInCart ? (
            <CartSheet>
              <button className='w-full flex items-center justify-center gap-1 sm:gap-2 bg-[#8a7d65] border border-[#8a7d65] text-white rounded-md px-2 sm:px-4 py-1 sm:py-1.5 font-montserrat text-[10px] sm:text-xs uppercase tracking-wider transition-colors'>
                <ShoppingCart className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
                <span>View in Cart</span>
              </button>
            </CartSheet>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAddedToCart}
              className={`w-full flex items-center justify-center gap-1 sm:gap-2 ${
                isAddedToCart
                  ? "bg-green-600 border-green-600 text-white"
                  : "bg-transparent border border-[#382f21] text-[#382f21] hover:bg-[#382f21] hover:text-white"
              } rounded-md px-2 sm:px-4 py-1 sm:py-1.5 font-montserrat text-[10px] sm:text-xs uppercase tracking-wider transition-colors`}>
              {isAddedToCart ? (
                <>
                  <Check className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <FaShoppingBag className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}

          {/* Cart Confetti Effect */}
          {cartConfetti.map((emoji) => (
            <div
              key={emoji.id}
              className='absolute z-10 pointer-events-none'
              style={{
                left: "50%",
                bottom: "0",
                transform: `translate(${emoji.x}px, ${emoji.y}px) rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
                opacity: emoji.opacity,
                animation: "confetti 1s ease-out forwards",
              }}>
              {emoji.emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
