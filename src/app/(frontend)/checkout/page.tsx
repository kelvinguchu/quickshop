'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart/CartContext'
import { CheckoutForm, CheckoutFormData } from '@/components/checkout/CheckoutForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart()
  const [customerData, setCustomerData] = useState<CheckoutFormData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-cinzel text-2xl text-[#382f21] mb-6">Checkout</h1>
        <div className="bg-white rounded-sm border border-[#e0d8c9] p-8 text-center">
          <p className="text-[#8a7d65] mb-4">Your cart is empty</p>
          <a
            href="/"
            className="inline-block bg-transparent border border-[#382f21] text-[#382f21] px-6 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider text-center hover:bg-[#382f21] hover:text-white transition-all"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto  px-4 py-4  md:py-8 bg-[#f9f6f2]">
      <h1 className="font-cinzel text-2xl text-[#382f21] mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 mb-16 md:mt-0">
          <CheckoutForm />
        </div>

        <div className="lg:col-span-1 hidden lg:block">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
