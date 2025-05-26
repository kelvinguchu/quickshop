"use client";

import React from "react";
import { User, ShoppingBag, Heart, Package, LogOut, Ruler } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { OrdersSheet } from "@/components/orders/OrdersSheet";
import { CustomOrdersSheet } from "@/components/orders/CustomOrdersSheet";
import { WishlistSheet } from "@/components/wishlist/WishlistSheet";
import { CartSheet } from "@/components/cart/CartSheet";
import { ProfileSheet } from "@/components/account/ProfileSheet";
import { MeasurementsSheet } from "@/components/account/MeasurementsSheet";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const { logout } = useAuth();
  const router = useRouter();

  // Get user initials and profile photo
  const initials =
    `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase();
  const profilePhotoUrl =
    user.profilePhoto &&
    typeof user.profilePhoto === "object" &&
    "url" in user.profilePhoto
      ? user.profilePhoto.url
      : null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully signed out");
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className='min-h-screen bg-[#f9f6f2] py-4 sm:py-8 pb-20 md:pb-8'>
      <div className='max-w-2xl mx-auto px-3 sm:px-4'>
        <div className='text-center mb-6 sm:mb-8'>
          {/* User Avatar */}
          <div className='flex justify-center mb-3 sm:mb-4'>
            <Avatar className='w-16 h-16 sm:w-20 sm:h-20'>
              {profilePhotoUrl && (
                <AvatarImage
                  src={profilePhotoUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                />
              )}
              <AvatarFallback className='bg-[#382f21] text-white text-lg sm:text-xl font-medium'>
                {initials || <User className='w-6 h-6 sm:w-8 sm:h-8' />}
              </AvatarFallback>
            </Avatar>
          </div>

          <h1 className='font-cinzel text-lg sm:text-2xl text-[#382f21] mb-2'>
            My Account
          </h1>
          <p className='text-[#8a7d65] text-xs sm:text-sm'>
            Welcome back, {user.firstName ?? user.email}
          </p>
        </div>

        <div className='bg-white rounded-sm border border-[#e0d8c9] overflow-hidden'>
          {/* Profile Information */}
          <ProfileSheet>
            <div className='p-4 sm:p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <Avatar className='w-8 h-8 sm:w-10 sm:h-10'>
                  {profilePhotoUrl && (
                    <AvatarImage
                      src={profilePhotoUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  )}
                  <AvatarFallback className='bg-[#f5f2ec] text-[#8a7d65] text-xs sm:text-sm font-medium'>
                    {initials || <User className='w-4 h-4 sm:w-5 sm:h-5' />}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-sm sm:text-lg text-[#382f21] mb-1'>
                    Profile
                  </h2>
                  <p className='text-xs sm:text-sm text-[#8a7d65] truncate'>
                    {[user.firstName, user.lastName]
                      .filter(Boolean)
                      .join(" ") || user.email}
                  </p>
                </div>
                <span className='text-xs sm:text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  Edit →
                </span>
              </div>
            </div>
          </ProfileSheet>

          {/* Orders */}
          <OrdersSheet>
            <div className='p-4 sm:p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Package className='w-4 h-4 sm:w-5 sm:h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-sm sm:text-lg text-[#382f21] mb-1'>
                    Orders
                  </h2>
                  <p className='text-xs text-[#8a7d65] leading-tight'>
                    View order history & track shipments
                  </p>
                </div>
                <span className='text-xs sm:text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </OrdersSheet>

          {/* Custom Orders */}
          <CustomOrdersSheet>
            <div className='p-4 sm:p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Ruler className='w-4 h-4 sm:w-5 sm:h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-sm sm:text-lg text-[#382f21] mb-1'>
                    Custom
                  </h2>
                  <p className='text-xs text-[#8a7d65] leading-tight'>
                    Track custom measurement orders
                  </p>
                </div>
                <span className='text-xs sm:text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </CustomOrdersSheet>

          {/* Saved Measurements */}
          <MeasurementsSheet>
            <div className='p-4 sm:p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Ruler className='w-4 h-4 sm:w-5 sm:h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-sm sm:text-lg text-[#382f21] mb-1'>
                    User Data
                  </h2>
                  <p className='text-xs text-[#8a7d65] leading-tight'>
                    Manage measurements & address
                  </p>
                </div>
                <span className='text-xs sm:text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </MeasurementsSheet>

          {/* Wishlist */}
          <WishlistSheet>
            <div className='p-4 sm:p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <Heart className='w-4 h-4 sm:w-5 sm:h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-sm sm:text-lg text-[#382f21] mb-1'>
                    Wishlist
                  </h2>
                  <p className='text-xs text-[#8a7d65] leading-tight'>
                    Items saved for later
                  </p>
                </div>
                <span className='text-xs sm:text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </WishlistSheet>

          {/* Cart */}
          <CartSheet>
            <div className='p-4 sm:p-6 border-b border-[#e0d8c9] cursor-pointer hover:bg-[#f9f6f2] transition-colors'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                  <ShoppingBag className='w-4 h-4 sm:w-5 sm:h-5 text-[#8a7d65]' />
                </div>
                <div className='flex-grow min-w-0'>
                  <h2 className='font-cinzel text-sm sm:text-lg text-[#382f21] mb-1'>
                    Cart
                  </h2>
                  <p className='text-xs text-[#8a7d65] leading-tight'>
                    Review cart items
                  </p>
                </div>
                <span className='text-xs sm:text-sm text-[#382f21] hover:text-[#8a7d65] font-medium flex-shrink-0'>
                  View →
                </span>
              </div>
            </div>
          </CartSheet>

          {/* Logout */}
          <div className='p-4 sm:p-6'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 bg-[#f5f2ec] rounded-full flex items-center justify-center flex-shrink-0'>
                <LogOut className='w-4 h-4 sm:w-5 sm:h-5 text-[#8a7d65]' />
              </div>
              <div className='flex-grow min-w-0'>
                <h2 className='font-cinzel text-sm sm:text-lg text-[#382f21] mb-1'>
                  Sign Out
                </h2>
                <p className='text-xs text-[#8a7d65] leading-tight'>
                  Securely sign out
                </p>
              </div>
              <button
                onClick={handleLogout}
                className='text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium flex-shrink-0 transition-colors'>
                Sign Out →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
