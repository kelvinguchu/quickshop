"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Package, Calendar, Truck, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface OrdersSheetProps {
  children: React.ReactNode;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    country: string;
  };
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return <CheckCircle className='w-4 h-4 text-green-600' />;
    case "processing":
      return <Clock className='w-4 h-4 text-yellow-600' />;
    case "shipped":
      return <Truck className='w-4 h-4 text-blue-600' />;
    case "delivered":
      return <CheckCircle className='w-4 h-4 text-green-600' />;
    default:
      return <Package className='w-4 h-4 text-gray-600' />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "text-green-600 bg-green-50";
    case "processing":
      return "text-yellow-600 bg-yellow-50";
    case "shipped":
      return "text-blue-600 bg-blue-50";
    case "delivered":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export function OrdersSheet({ children }: Readonly<OrdersSheetProps>) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.docs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [user, fetchOrders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className='flex flex-col items-center justify-center h-64 text-center p-6'>
          <div className='w-16 h-16 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-4'>
            <Package className='w-8 h-8 text-[#8a7d65]' />
          </div>
          <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
            Sign in required
          </h3>
          <p className='text-[#8a7d65] text-sm mb-4'>
            Please sign in to view your order history
          </p>
          <a
            href='/login'
            className='inline-block bg-[#382f21] text-white px-4 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider hover:bg-[#4e4538] transition-colors'>
            Sign In
          </a>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className='flex flex-col items-center justify-center h-64 text-center p-6'>
          <div className='w-8 h-8 border-2 border-[#8a7d65] border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='text-[#8a7d65] text-sm'>Loading your orders...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='flex flex-col items-center justify-center h-64 text-center p-6'>
          <div className='w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4'>
            <Package className='w-8 h-8 text-red-500' />
          </div>
          <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
            Error loading orders
          </h3>
          <p className='text-red-600 text-sm mb-4'>{error}</p>
          <button
            onClick={fetchOrders}
            className='inline-block bg-[#382f21] text-white px-4 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider hover:bg-[#4e4538] transition-colors'>
            Try Again
          </button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center h-64 text-center p-6'>
          <div className='w-16 h-16 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-4'>
            <Package className='w-8 h-8 text-[#8a7d65]' />
          </div>
          <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
            No orders yet
          </h3>
          <p className='text-[#8a7d65] text-sm'>
            Your order history will appear here once you make a purchase
          </p>
        </div>
      );
    }

    return (
      <div className='divide-y divide-[#e0d8c9]/40'>
        {orders.map((order) => (
          <div key={order.id} className='p-4'>
            {/* Order Header */}
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                {getStatusIcon(order.status)}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-[#382f21]'>
                  ${order.total.toFixed(2)}
                </p>
                <p className='text-xs text-[#8a7d65] flex items-center gap-1'>
                  <Calendar className='w-3 h-3' />
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className='space-y-2'>
              {order.items.map((item) => (
                <div key={item.id} className='flex items-center gap-3'>
                  <div className='relative w-12 h-12 bg-[#f9f6f2] overflow-hidden rounded-sm flex-shrink-0'>
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
                    <h4 className='font-cinzel text-sm text-[#382f21] line-clamp-1'>
                      {item.name}
                    </h4>
                    <p className='text-xs text-[#8a7d65]'>
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className='mt-3 pt-3 border-t border-[#e0d8c9]/40'>
              <p className='text-xs text-[#8a7d65]'>
                <span className='font-medium'>Shipping to:</span>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side='right'
        className='sm:min-w-[40vw] min-w-[95vw] bg-white p-0 overflow-y-auto'>
        <SheetHeader className='border-b border-[#e0d8c9]/40 py-3'>
          <SheetTitle className='font-cinzel text-lg text-[#382f21] px-4'>
            My Orders
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>{renderContent()}</div>
      </SheetContent>
    </Sheet>
  );
}
