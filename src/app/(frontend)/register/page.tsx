import React from "react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account - QuickShop",
  description: "Create your QuickShop account",
};

interface RegisterPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RegisterPage({
  searchParams,
}: Readonly<RegisterPageProps>) {
  const params = await searchParams;
  const redirectTo =
    typeof params.redirect === "string" ? params.redirect : "/account";

  return (
    <div className='min-h-screen bg-[#f9f6f2] py-8'>
      <div className='max-w-md mx-auto px-4'>
        <div className='text-center mb-8'>
          <h1 className='font-cinzel text-2xl text-[#382f21] mb-2'>
            Create Account
          </h1>
          <p className='text-[#8a7d65] text-sm'>
            Join QuickShop and start shopping
          </p>
        </div>

        <div className='bg-white rounded-sm border border-[#e0d8c9] p-6'>
          <RegisterForm redirectTo={redirectTo} />

          <div className='mt-6 text-center'>
            <p className='text-sm text-[#8a7d65]'>
              Already have an account?{" "}
              <Link
                href={`/login${redirectTo !== "/account" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                className='text-[#382f21] hover:text-[#8a7d65] font-medium'>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
