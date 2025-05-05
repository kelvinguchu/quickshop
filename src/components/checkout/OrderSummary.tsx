'use client'

import React from 'react'
import Image from 'next/image'
import { useCart } from '@/lib/cart/CartContext'

export function OrderSummary() {
  const { items, itemCount, total } = useCart()
  const shippingFee = 2.5 // Fixed shipping fee in USD
  const finalTotal = total + shippingFee

  return (
    <div className="bg-white rounded-sm border border-[#e0d8c9] p-4">
      <h2 className="font-cinzel text-lg text-[#382f21] mb-4">Order Summary</h2>

      {items.length === 0 ? (
        <p className="text-center text-[#8a7d65] py-4">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          <ul className="divide-y divide-[#e0d8c9]/40">
            {items.map((item) => (
              <li key={item.id} className="py-2 flex gap-3">
                <div className="relative w-12 h-12 bg-[#f9f6f2] overflow-hidden rounded-sm flex-shrink-0">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-cinzel text-xs text-[#382f21] line-clamp-1">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="font-cormorant text-xs text-[#8a7d65]">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                    <p className="font-cormorant text-xs font-semibold text-[#382f21]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-[#e0d8c9]/40">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#8a7d65]">
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
              <span className="text-[#382f21]">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#8a7d65]">Shipping</span>
              <span className="text-[#382f21]">${shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-cinzel text-base font-semibold mt-2 pt-2 border-t border-[#e0d8c9]/40">
              <span className="text-[#382f21]">Total</span>
              <span className="text-[#382f21]">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
