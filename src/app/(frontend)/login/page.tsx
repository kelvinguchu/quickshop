import React from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In - QuickShop",
  description: "Sign in to your QuickShop account",
};

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo =
    typeof params.redirect === "string" ? params.redirect : "/account";
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className='min-h-screen bg-[#f9f6f2] py-8'>
      <div className='max-w-md mx-auto px-4'>
        <div className='text-center mb-8'>
          <h1 className='font-cinzel text-2xl text-[#382f21] mb-2'>
            Welcome Back
          </h1>
          <p className='text-[#8a7d65] text-sm'>
            Sign in to your QuickShop account
          </p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 text-sm'>
            {error}
          </div>
        )}

        <div className='bg-white rounded-sm border border-[#e0d8c9] p-6'>
          <LoginForm redirectTo={redirectTo} />

          <div className='mt-6 text-center'>
            <p className='text-sm text-[#8a7d65]'>
              Don't have an account?{" "}
              <Link
                href={`/register${redirectTo !== "/account" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                className='text-[#382f21] hover:text-[#8a7d65] font-medium'>
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
