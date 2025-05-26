"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Ruler,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CustomOrdersSheetProps {
  children: React.ReactNode;
}

interface CustomOrder {
  id: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  measurements: {
    chest: number;
    shoulder: number;
    sleeve: number;
    length: number;
    waist: number;
    hip: number;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  depositAmount: number;
  remainingAmount: number;
  status: string;
  createdAt: string;
  estimatedCompletion?: string;
  productionNotes?: string;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "deposit-paid":
      return <Clock className='w-4 h-4 text-blue-600' />;
    case "in-production":
      return <Package className='w-4 h-4 text-yellow-600' />;
    case "quality-check":
      return <AlertCircle className='w-4 h-4 text-orange-600' />;
    case "ready-for-payment":
      return <DollarSign className='w-4 h-4 text-green-600' />;
    case "fully-paid":
      return <CheckCircle className='w-4 h-4 text-green-600' />;
    case "shipped":
      return <Package className='w-4 h-4 text-blue-600' />;
    case "delivered":
      return <CheckCircle className='w-4 h-4 text-green-600' />;
    default:
      return <Clock className='w-4 h-4 text-gray-600' />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "deposit-paid":
      return "text-blue-600 bg-blue-50";
    case "in-production":
      return "text-yellow-600 bg-yellow-50";
    case "quality-check":
      return "text-orange-600 bg-orange-50";
    case "ready-for-payment":
      return "text-green-600 bg-green-50";
    case "fully-paid":
      return "text-green-600 bg-green-50";
    case "shipped":
      return "text-blue-600 bg-blue-50";
    case "delivered":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const formatStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function CustomOrdersSheet({
  children,
}: Readonly<CustomOrdersSheetProps>) {
  const { user } = useAuth();
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomOrders = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/custom-orders", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch custom orders");
      }

      const data = await response.json();
      setCustomOrders(data.docs ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load custom orders"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCustomOrders();
  }, [user, fetchCustomOrders]);

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
            <Ruler className='w-8 h-8 text-[#8a7d65]' />
          </div>
          <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
            Sign in required
          </h3>
          <p className='text-[#8a7d65] text-sm mb-4'>
            Please sign in to view your custom orders
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
          <p className='text-[#8a7d65] text-sm'>
            Loading your custom orders...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='flex flex-col items-center justify-center h-64 text-center p-6'>
          <div className='w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4'>
            <Ruler className='w-8 h-8 text-red-500' />
          </div>
          <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
            Error loading orders
          </h3>
          <p className='text-red-600 text-sm mb-4'>{error}</p>
          <button
            onClick={fetchCustomOrders}
            className='inline-block bg-[#382f21] text-white px-4 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider hover:bg-[#4e4538] transition-colors'>
            Try Again
          </button>
        </div>
      );
    }

    if (customOrders.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center h-64 text-center p-6'>
          <div className='w-16 h-16 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-4'>
            <Ruler className='w-8 h-8 text-[#8a7d65]' />
          </div>
          <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
            No custom orders yet
          </h3>
          <p className='text-[#8a7d65] text-sm mb-4'>
            Custom measurement orders will appear here
          </p>
          <a
            href='/custom'
            className='inline-block bg-transparent text-[#382f21] border border-[#382f21] px-4 py-2 rounded-sm font-montserrat text-sm uppercase tracking-wider hover:bg-[#4e4538] transition-colors'>
            Browse Custom Items
          </a>
        </div>
      );
    }

    return (
      <div className='divide-y divide-[#e0d8c9]/40'>
        {customOrders.map((order) => (
          <div key={order.id} className='p-4'>
            {/* Order Header */}
            <div className='flex items-start gap-3 mb-3'>
              <div className='relative w-16 h-16 bg-[#f9f6f2] overflow-hidden rounded-sm flex-shrink-0'>
                {order.productImage && (
                  <Image
                    src={order.productImage}
                    alt={order.productName}
                    fill
                    className='object-cover'
                  />
                )}
              </div>
              <div className='flex-grow'>
                <h4 className='font-cinzel text-sm text-[#382f21] line-clamp-1 mb-1'>
                  {order.productName}
                </h4>
                <div className='flex items-center gap-2 mb-2'>
                  {getStatusIcon(order.status)}
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
                <p className='text-xs text-[#8a7d65] flex items-center gap-1'>
                  <Calendar className='w-3 h-3' />
                  Ordered: {formatDate(order.createdAt)}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-[#382f21]'>
                  ${order.productPrice.toFixed(2)}
                </p>
                <p className='text-xs text-[#8a7d65]'>
                  Paid: ${order.depositAmount.toFixed(2)}
                </p>
                {order.remainingAmount > 0 && (
                  <p className='text-xs text-orange-600'>
                    Due: ${order.remainingAmount.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Measurements */}
            <div className='bg-[#f9f6f2] rounded-sm p-3 mb-3'>
              <h5 className='font-cinzel text-xs text-[#382f21] mb-2 flex items-center gap-1'>
                <Ruler className='w-3 h-3' />
                Measurements (inches)
              </h5>
              <div className='grid grid-cols-3 gap-2 text-xs'>
                <div>
                  <span className='text-[#8a7d65]'>Chest:</span>{" "}
                  {order.measurements.chest}"
                </div>
                <div>
                  <span className='text-[#8a7d65]'>Shoulder:</span>{" "}
                  {order.measurements.shoulder}"
                </div>
                <div>
                  <span className='text-[#8a7d65]'>Sleeve:</span>{" "}
                  {order.measurements.sleeve}"
                </div>
                <div>
                  <span className='text-[#8a7d65]'>Length:</span>{" "}
                  {order.measurements.length}"
                </div>
                <div>
                  <span className='text-[#8a7d65]'>Waist:</span>{" "}
                  {order.measurements.waist}"
                </div>
                <div>
                  <span className='text-[#8a7d65]'>Hip:</span>{" "}
                  {order.measurements.hip}"
                </div>
              </div>
            </div>

            {/* Production Notes */}
            {order.productionNotes && (
              <div className='bg-blue-50 rounded-sm p-3 mb-3'>
                <h5 className='font-cinzel text-xs text-blue-800 mb-1'>
                  Production Update
                </h5>
                <p className='text-xs text-blue-700'>{order.productionNotes}</p>
              </div>
            )}

            {/* Estimated Completion */}
            {order.estimatedCompletion && (
              <div className='text-xs text-[#8a7d65] mb-3'>
                <span className='font-medium'>Estimated completion:</span>{" "}
                {formatDate(order.estimatedCompletion)}
              </div>
            )}

            {/* Shipping Address */}
            <div className='pt-3 border-t border-[#e0d8c9]/40'>
              <p className='text-xs text-[#8a7d65]'>
                <span className='font-medium'>Shipping to:</span>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
            </div>

            {/* Payment Action */}
            {order.status === "ready-for-payment" &&
              order.remainingAmount > 0 && (
                <div className='mt-3 pt-3 border-t border-[#e0d8c9]/40'>
                  <button className='w-full bg-green-600 text-white px-4 py-2 rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-green-700 transition-colors'>
                    Pay Remaining ${order.remainingAmount.toFixed(2)}
                  </button>
                </div>
              )}
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
            Custom Orders
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>{renderContent()}</div>
      </SheetContent>
    </Sheet>
  );
}
