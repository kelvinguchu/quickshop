"use client";

import React from "react";
import { User, ShoppingBag, Heart, Package, LogOut, Ruler } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { OrdersSheet } from "@/components/orders/OrdersSheet";
import { CustomOrdersSheet } from "@/components/orders/CustomOrdersSheet";
import { WishlistSheet } from "@/components/wishlist/WishlistSheet";
import { CartSheet } from "@/components/cart/CartSheet";
import { ProfileSheet } from "@/components/account/ProfileSheet";

interface AccountDashboardProps {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePhoto?: 
      | string
      | {
          url?: string | null;
        }
      | null;
  };
}

export function AccountDashboard({ user }: Readonly<AccountDashboardProps>) {
  // Get user initials and profile photo
  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  const profilePhotoUrl = user.profilePhoto && typeof user.profilePhoto === 'object' && 'url' in user.profilePhoto 
    ? user.profilePhoto.url 
    : null;

  return (
    <div className='min-h-screen bg-[#f9f6f2] py-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='text-center mb-8'>
          {/* User Avatar */}
          <div className='flex justify-center mb-4'>
            <Avatar className="w-20 h-20">
              {profilePhotoUrl && (
                <AvatarImage 
                  src={profilePhotoUrl} 
                  alt={`${user.firstName} ${user.lastName}`}
                />
              )}
              <AvatarFallback className="bg-[#382f21] text-white text-xl font-medium">
                {initials || <User className='w-8 h-8' />}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h1 className='font-cinzel text-2xl text-[#382f21] mb-2'>
            My Account
          </h1>
          <p className='text-[#8a7d65] text-sm'>
            Welcome back, {user.firstName ?? user.email}
          </p>
        </div>

        <div className='bg-white rounded-sm border border-[#e0d8c9] overflow-hidden'>
          {/* Profile Information */}
          <ProfileSheet>
            <div className='p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-4'>
                <Avatar className="w-10 h-10">
                  {profilePhotoUrl && (
                    <AvatarImage 
                      src={profilePhotoUrl} 
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  )}
                  <AvatarFallback className="bg-[#f5f2ec] text-[#8a7d65] text-sm font-medium">
                    {initials || <User className='w-5 h-5' />}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-lg text-[#382f21] mb-1'>
                    Profile
                  </h2>
                  <p className='text-sm text-[#8a7d65] truncate'>
                    {user.firstName} {user.lastName} • {user.email}
                  </p>
                </div>
                <span className='text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  Edit →
                </span>
              </div>
            </div>
          </ProfileSheet>

          {/* Orders */}
          <OrdersSheet>
            <div className='p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Package className='w-5 h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-lg text-[#382f21] mb-1'>
                    Orders
                  </h2>
                  <p className='text-sm text-[#8a7d65]'>
                    View your order history and track shipments
                  </p>
                </div>
                <span className='text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </OrdersSheet>

          {/* Custom Orders */}
          <CustomOrdersSheet>
            <div className='p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Ruler className='w-5 h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-lg text-[#382f21] mb-1'>
                    Custom Orders
                  </h2>
                  <p className='text-sm text-[#8a7d65]'>
                    Track your custom measurement orders
                  </p>
                </div>
                <span className='text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </CustomOrdersSheet>

          {/* Wishlist */}
          <WishlistSheet>
            <div className='p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Heart className='w-5 h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-lg text-[#382f21] mb-1'>
                    Wishlist
                  </h2>
                  <p className='text-sm text-[#8a7d65]'>
                    Items you've saved for later
                  </p>
                </div>
                <span className='text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </WishlistSheet>

          {/* Cart */}
          <CartSheet>
            <div className='p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <ShoppingBag className='w-5 h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-lg text-[#382f21] mb-1'>
                    Shopping Cart
                  </h2>
                  <p className='text-sm text-[#8a7d65]'>
                    Review items in your cart
                  </p>
                </div>
                <span className='text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </CartSheet>

          {/* Logout */}
          <div className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                <LogOut className='w-5 h-5 text-[#8a7d65]' />
              </div>
              <div className='flex-grow min-w-0'>
                <h2 className='font-cinzel text-lg text-[#382f21] mb-1'>
                  Sign Out
                </h2>
                <p className='text-sm text-[#8a7d65]'>
                  Securely sign out of your account
                </p>
              </div>
              <form action='/api/users/logout' method='POST'>
                <button
                  type='submit'
                  className='text-sm text-red-600 hover:text-red-700 font-medium flex-shrink-0'>
                  Sign Out →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
