"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

interface RegisterFormProps {
  redirectTo?: string;
}

export function RegisterForm({
  redirectTo = "/account",
}: Readonly<RegisterFormProps>) {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Successful registration - user should be automatically logged in
      router.push(redirectTo);
      router.refresh(); // Refresh to update auth state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label
              htmlFor='firstName'
              className='block text-sm font-medium text-[#382f21] mb-1'>
              First Name
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-[#e0d8c9] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65] focus:border-[#8a7d65]'
              placeholder='First name'
            />
          </div>
          <div>
            <label
              htmlFor='lastName'
              className='block text-sm font-medium text-[#382f21] mb-1'>
              Last Name
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-[#e0d8c9] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65] focus:border-[#8a7d65]'
              placeholder='Last name'
            />
          </div>
        </div>

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

        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-[#382f21] mb-1'>
            Confirm Password
          </label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 pr-10 border border-[#e0d8c9] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65] focus:border-[#8a7d65]'
              placeholder='Confirm your password'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7d65] hover:text-[#382f21]'>
              {showConfirmPassword ? (
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
}
