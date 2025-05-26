"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Trash2,
  ShoppingBag,
  Heart,
  Check,
  AlertCircle,
  User,
} from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist/wishlistStore";
import { useCart } from "@/lib/cart/CartContext";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

interface WishlistSheetProps {
  children: React.ReactNode;
}

export function WishlistSheet({ children }: WishlistSheetProps) {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { items: cartItems, addItem: addToCart } = useCart();
  const { user } = useAuth();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Check if an item is already in the cart
  const isInCart = (itemId: string) => {
    return cartItems.some((cartItem) => cartItem.id === itemId);
  };

  const handleAddToCart = (item: any) => {
    // Only add if not already in cart
    if (!isInCart(item.id)) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      });

      // Show added indicator
      setAddedItems((prev) => ({ ...prev, [item.id]: true }));

      // Reset after 2 seconds
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [item.id]: false }));
      }, 2000);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side='right'
        className='sm:min-w-[40vw] min-w-[95vw] bg-white p-0 overflow-y-auto'>
        <SheetHeader className='border-b border-[#e0d8c9]/40 py-3'>
          <SheetTitle className='font-cinzel text-lg text-[#382f21] px-4'>
            My Wishlist
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>
          {items.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-center p-6'>
              <div className='w-16 h-16 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-4'>
                <Heart className='w-8 h-8 text-[#8a7d65]' />
              </div>
              <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
                Your wishlist is empty
              </h3>
              <p className='text-[#8a7d65] text-sm mb-4'>
                Items added to your wishlist will appear here
              </p>
              {!user && (
                <div className='border-t border-[#e0d8c9]/40 pt-3 mt-3'>
                  <p className='text-xs text-[#8a7d65] text-center mb-2'>
                    <Link
                      href='/login'
                      className='text-[#382f21] hover:underline font-medium'>
                      Sign in
                    </Link>{" "}
                    to save your wishlist across devices
                  </p>
                </div>
              )}
            </div>
          ) : (
            <ul className='divide-y divide-[#e0d8c9]/40'>
              {items.map((item) => (
                <li key={item.id} className='px-4 py-3 flex gap-4'>
                  <div className='relative w-20 h-20 bg-[#f9f6f2] overflow-hidden rounded-sm flex-shrink-0'>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    )}
                  </div>
                  <div className='flex-grow min-w-0'>
                    <h3 className='font-cinzel text-sm text-[#382f21] line-clamp-1'>
                      <Link
                        href={`/products/${item.id}`}
                        className='hover:text-[#8a7d65] transition-colors'>
                        {item.name}
                      </Link>
                    </h3>
                    <p className='font-cormorant text-base font-semibold text-[#8a7d65]'>
                      ${item.price.toFixed(2)}
                    </p>

                    {isInCart(item.id) && (
                      <p className='text-xs text-amber-600 flex items-center mt-1'>
                        <AlertCircle className='w-3 h-3 mr-1' />
                        Already in cart
                      </p>
                    )}

                    <div className='flex gap-2 mt-2'>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={isInCart(item.id)}
                        className={`flex items-center text-xs ${
                          addedItems[item.id]
                            ? "bg-green-600 text-white"
                            : isInCart(item.id)
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-[#382f21] text-white hover:bg-[#4e4538]"
                        } px-2.5 py-1.5 rounded-sm transition-colors`}>
                        {addedItems[item.id] ? (
                          <>
                            <Check className='w-3 h-3 mr-1' />
                            Added
                          </>
                        ) : isInCart(item.id) ? (
                          <>
                            <Check className='w-3 h-3 mr-1' />
                            In Cart
                          </>
                        ) : (
                          <>
                            <ShoppingBag className='w-3 h-3 mr-1' />
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className='flex items-center text-xs text-[#382f21] hover:text-red-500 transition-colors'>
                        <Trash2 className='w-3 h-3 mr-1' />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className='border-t border-[#e0d8c9]/40 px-4 py-3'>
            {!user && (
              <div className='border-t border-[#e0d8c9]/40 pt-3 mb-3'>
                <p className='text-xs text-[#8a7d65] text-center'>
                  <Link
                    href='/login'
                    className='text-[#382f21] hover:underline font-medium'>
                    Sign in
                  </Link>{" "}
                  to keep your wishlist saved
                </p>
              </div>
            )}
            <button
              onClick={clearWishlist}
              className='w-full bg-transparent border border-[#382f21] text-[#382f21] rounded-sm font-montserrat text-sm uppercase tracking-wider text-center hover:bg-[#382f21] hover:text-white transition-colors flex items-center justify-center gap-2 py-2 px-4'>
              <X className='w-3.5 h-3.5' />
              Clear Wishlist
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
