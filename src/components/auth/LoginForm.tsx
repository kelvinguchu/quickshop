"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({
  redirectTo = "/account",
}: Readonly<LoginFormProps>) {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      // Successful login
      router.push(redirectTo);
      router.refresh(); // Refresh to update auth state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-[#382f21] mb-1'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border border-[#e0d8c9] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65] focus:border-[#8a7d65]'
            placeholder='Enter your email'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-[#382f21] mb-1'>
            Password
          </label>
          <div className='relative'>
            <input
              type={showPassword ? "text" : "password"}
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 pr-10 border border-[#e0d8c9] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65] focus:border-[#8a7d65]'
              placeholder='Enter your password'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7d65] hover:text-[#382f21]'>
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-sm text-sm'>
            {error}
          </div>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-[#382f21] text-white py-2 px-4 rounded-sm font-montserrat text-sm uppercase tracking-wider hover:bg-[#4e4538] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2'>
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
