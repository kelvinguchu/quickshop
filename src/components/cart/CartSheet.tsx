"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface CartSheetProps {
  children: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const [open, setOpen] = useState(false);
  const { items, itemCount, total, removeItem, updateQuantity, clearCart } =
    useCart();
  const { user } = useAuth();

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    } else {
      removeItem(id);
    }
  };

  const handleCheckout = () => {
    // Close the sheet when proceeding to checkout
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side='right'
        className='sm:min-w-[40vw] min-w-[95vw] bg-white p-0 overflow-y-auto flex flex-col'>
        <SheetHeader className='border-b border-[#e0d8c9]/40 py-3'>
          <SheetTitle className='font-cinzel text-lg text-[#382f21] px-4'>
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>
          {items.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-center p-6'>
              <div className='w-16 h-16 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-4'>
                <ShoppingBag className='w-8 h-8 text-[#8a7d65]' />
              </div>
              <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
                Your cart is empty
              </h3>
              <p className='text-[#8a7d65] text-sm'>
                Items added to your cart will appear here
              </p>
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

                    <div className='flex items-center justify-between mt-2'>
                      <div className='flex items-center border border-[#e0d8c9] rounded-sm'>
                        <button
                          onClick={() =>
                            handleDecreaseQuantity(item.id, item.quantity)
                          }
                          className='px-2 py-1 text-[#382f21] hover:bg-[#f5f2ec] transition-colors'>
                          <Minus className='w-3 h-3' />
                        </button>
                        <span className='px-2 py-1 text-xs font-medium min-w-[24px] text-center'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleIncreaseQuantity(item.id, item.quantity)
                          }
                          className='px-2 py-1 text-[#382f21] hover:bg-[#f5f2ec] transition-colors'>
                          <Plus className='w-3 h-3' />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className='flex items-center text-xs text-[#382f21] hover:text-red-500 transition-colors'>
                        <Trash2 className='w-3 h-3 mr-1' />
                        Remove
                      </button>
                    </div>
                    <p className='text-xs text-right text-[#8a7d65] mt-1'>
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className='border-t border-[#e0d8c9]/40 py-4 px-4 flex flex-col gap-3'>
            <div className='flex justify-between items-center'>
              <span className='font-cinzel text-base text-[#382f21]'>
                Total
              </span>
              <div>
                <span className='font-cinzel text-lg font-semibold text-[#382f21]'>
                  ${total.toFixed(2)}
                </span>
                <p className='text-xs text-[#8a7d65] text-right'>
                  Shipping & taxes at checkout
                </p>
              </div>
            </div>

            {!user && (
              <div className='border-t border-[#e0d8c9]/40 pt-3 mb-2'>
                <p className='text-xs text-[#8a7d65] text-center'>
                  <Link
                    href='/login?redirect=/checkout'
                    className='text-[#382f21] hover:underline font-medium'>
                    Sign in
                  </Link>{" "}
                  for faster checkout
                </p>
              </div>
            )}

            <div className='flex items-center gap-3 mt-2'>
              <button
                onClick={clearCart}
                className='text-xs text-[#382f21] hover:text-red-500 transition-colors flex items-center border border-[#e0d8c9]/40 px-2.5 py-1.5 rounded-sm'>
                <X className='w-3 h-3 mr-1' />
                Clear
              </button>
              <Link
                href='/checkout'
                onClick={handleCheckout}
                className='flex-1 bg-transparent border border-[#382f21] text-[#382f21] px-4 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider text-center hover:bg-[#382f21] hover:text-white transition-all flex items-center justify-center gap-2'>
                <ShoppingBag className='h-3.5 w-3.5' />
                Checkout
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
