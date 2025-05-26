import React from "react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({
  message = "Loading...",
  fullScreen = true,
}: LoadingProps) {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-50" : "absolute inset-0"
      } bg-white/80 backdrop-blur-sm flex items-center justify-center`}>
      <div className='text-center'>
        {/* Loading spinner */}
        <div className='mb-4'>
          <div className='w-8 h-8 border-2 border-[#382f21]/20 border-t-[#382f21] rounded-full animate-spin mx-auto'></div>
        </div>

        {/* Loading text */}
        <p className='font-cinzel text-[#382f21] text-lg font-medium'>
          {message}
        </p>
      </div>
    </div>
  );
}

// Inline loading component for smaller areas
export function InlineLoading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className='flex items-center justify-center py-8'>
      <div className='text-center'>
        <div className='mb-3'>
          <div className='w-6 h-6 border-2 border-[#382f21]/20 border-t-[#382f21] rounded-full animate-spin mx-auto'></div>
        </div>
        <p className='font-cinzel text-[#382f21] text-sm font-medium'>
          {message}
        </p>
      </div>
    </div>
  );
}
