'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react'

interface OrderDetails {
  id: string
  orderNumber: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  items: Array<{
    name: string
    price: number
    quantity: number
    image?: string
  }>
  subtotal: number
  shippingFee: number
  total: number
  payment: {
    method: string
    transactionId?: string
  }
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('No order information found')
      setLoading(false)
      return
    }

    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }

        const data = await response.json()
        setOrder(data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Could not load order details. Please contact customer support.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#8a7d65] border-t-transparent"></div>
        <p className="mt-2 text-[#8a7d65]">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-sm border border-[#e0d8c9] p-8 text-center">
          <h1 className="font-cinzel text-xl text-[#382f21] mb-4">Order Not Found</h1>
          <p className="text-[#8a7d65] mb-6">{error || 'Could not find order information'}</p>
          <Link
            href="/"
            className="inline-block bg-transparent border border-[#382f21] text-[#382f21] px-6 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider text-center hover:bg-[#382f21] hover:text-white transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  // Format payment method for display
  const paymentMethodDisplay = () => {
    switch (order.payment.method) {
      case 'mpesa':
        return 'M-Pesa'
      case 'card':
        return 'Card Payment'
      case 'bank':
        return 'Bank Transfer'
      default:
        return order.payment.method
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-sm border border-[#e0d8c9] p-6 mb-8">
        <div className="flex items-center justify-center flex-col text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-cinzel text-2xl text-[#382f21] mb-2">Order Confirmed</h1>
          <p className="text-[#8a7d65]">
            Thank you for your purchase! Your order has been received.
          </p>
          <p className="mt-2 font-medium text-[#382f21]">Order #{order.orderNumber}</p>
          <p className="text-sm text-[#8a7d65] mt-1">
            A confirmation email has been sent to {order.customer.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="font-cinzel text-lg text-[#382f21] mb-3">Order Details</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[#8a7d65]">Name:</span>{' '}
                <span className="text-[#382f21]">
                  {order.customer.firstName} {order.customer.lastName}
                </span>
              </p>
              <p>
                <span className="text-[#8a7d65]">Email:</span>{' '}
                <span className="text-[#382f21]">{order.customer.email}</span>
              </p>
              <p>
                <span className="text-[#8a7d65]">Phone:</span>{' '}
                <span className="text-[#382f21]">{order.customer.phone}</span>
              </p>
              <p>
                <span className="text-[#8a7d65]">Payment Method:</span>{' '}
                <span className="text-[#382f21]">{paymentMethodDisplay()}</span>
              </p>
              {order.payment.transactionId && (
                <p>
                  <span className="text-[#8a7d65]">Transaction ID:</span>{' '}
                  <span className="text-[#382f21]">{order.payment.transactionId}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-cinzel text-lg text-[#382f21] mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-[#8a7d65]">Subtotal:</span>
                <span className="text-[#382f21]">${order.subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8a7d65]">Shipping:</span>
                <span className="text-[#382f21]">${order.shippingFee.toFixed(2)}</span>
              </p>
              <p className="flex justify-between font-medium pt-1 border-t border-[#e0d8c9]/40">
                <span className="text-[#382f21]">Total:</span>
                <span className="text-[#382f21]">${order.total.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-cinzel text-lg text-[#382f21] mb-3">Items Ordered</h2>
          <ul className="divide-y divide-[#e0d8c9]/40">
            {order.items.map((item, index) => (
              <li key={index} className="py-3 flex gap-3">
                <div className="relative w-12 h-12 bg-[#f9f6f2] overflow-hidden rounded-sm flex-shrink-0">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-cinzel text-xs text-[#382f21]">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-[#8a7d65]">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                    <p className="text-xs font-medium text-[#382f21]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <Link
            href="/"
            className="bg-transparent border border-[#382f21] text-[#382f21] px-6 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider text-center hover:bg-[#382f21] hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="bg-transparent border border-[#e0d8c9] text-[#8a7d65] px-6 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider text-center hover:bg-[#f5f2ec] transition-all flex items-center justify-center gap-2"
          >
            View All Orders
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
