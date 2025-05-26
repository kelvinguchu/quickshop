"use client";

import React from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserButtonProps {
  className?: string;
}

export function UserButton({ className = "" }: UserButtonProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={`p-2 rounded-full ${className}`}>
        <div className='w-5 h-5 bg-gray-200 rounded-full animate-pulse' />
      </div>
    );
  }

  if (!user) {
    // Not authenticated - show login link
    return (
      <Link
        href='/login'
        className={`p-2 text-[#382f21] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#f5f2ec] ${className}`}
        aria-label='Sign In'>
        <User className='w-5 h-5 stroke-[1.5]' />
      </Link>
    );
  }

  // Get user initials for fallback
  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  
  // Get profile photo URL if available
  const profilePhotoUrl = user.profilePhoto && typeof user.profilePhoto === 'object' && 'url' in user.profilePhoto 
    ? user.profilePhoto.url 
    : null;

  // Authenticated - link to account page with avatar
  return (
    <Link
      href='/account'
      className={`p-1 text-[#382f21] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#f5f2ec] ${className}`}
      aria-label='My Account'>
      <Avatar className="w-6 h-6">
        {profilePhotoUrl && (
          <AvatarImage 
            src={profilePhotoUrl} 
            alt={`${user.firstName} ${user.lastName}`}
          />
        )}
        <AvatarFallback className="bg-[#382f21] text-white text-xs font-medium">
          {initials || <User className='w-3 h-3' />}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
