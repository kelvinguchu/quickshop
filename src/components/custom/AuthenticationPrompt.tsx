import React from "react";
import Link from "next/link";
import { ArrowLeft, User, LogIn } from "lucide-react";

interface AuthenticationPromptProps {
  productId: string;
}

export function AuthenticationPrompt({
  productId,
}: Readonly<AuthenticationPromptProps>) {
  const redirectUrl = encodeURIComponent(`/custom/${productId}`);
  const loginUrl = `/login?redirect=${redirectUrl}`;
  const registerUrl = `/register?redirect=${redirectUrl}`;

  return (
    <div className='space-y-6'>
      <div className='max-w-md mx-auto'>
        <div className='bg-white rounded-sm border border-[#e0d8c9] p-6 text-center'>
          <div className='w-16 h-16 bg-[#f9f6f2] rounded-full flex items-center justify-center mx-auto mb-4'>
            <User className='h-8 w-8 text-[#8a7d65]' />
          </div>

          <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
            Account Required
          </h3>

          <div className='space-y-3'>
            <Link
              href={loginUrl}
              className='w-full inline-flex items-center justify-center gap-2 bg-transparent border border-[#382f21] text-[#382f21] px-4 py-2 rounded-sm hover:shadow-lg transition-all text-sm font-medium'>
              <LogIn className='h-4 w-4' />
              Sign In
            </Link>

            <Link
              href={registerUrl}
              className='w-full inline-flex items-center justify-center gap-2 bg-transparent border border-[#382f21] text-[#382f21] px-4 py-2 rounded-sm hover:shadow-lg transition-all text-sm font-medium'>
              <User className='h-4 w-4' />
              Create Account
            </Link>
          </div>

          <p className='text-xs text-[#8a7d65] mt-4'>
            Already have an account?{" "}
            <Link href={loginUrl} className='text-[#382f21] hover:underline'>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
