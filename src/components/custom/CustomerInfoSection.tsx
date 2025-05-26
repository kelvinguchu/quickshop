import React from "react";
import { User } from "lucide-react";
import type { User as AuthUser } from "@/lib/auth/AuthContext";

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CustomerInfoSectionProps {
  measurementData: CustomerData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  user: AuthUser | null;
}

export function CustomerInfoSection({
  measurementData,
  handleChange,
  user,
}: Readonly<CustomerInfoSectionProps>) {
  return (
    <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
      <h3 className='font-cinzel text-sm md:text-lg text-[#382f21] mb-4 flex items-center gap-2'>
        <User className='h-4 w-4' />
        Customer Information
      </h3>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='firstName'
            className='block text-xs text-[#8a7d65] mb-1'>
            First Name*
          </label>
          <input
            type='text'
            id='firstName'
            name='firstName'
            value={measurementData.firstName}
            onChange={handleChange}
            className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
            required
          />
        </div>

        <div>
          <label
            htmlFor='lastName'
            className='block text-xs text-[#8a7d65] mb-1'>
            Last Name*
          </label>
          <input
            type='text'
            id='lastName'
            name='lastName'
            value={measurementData.lastName}
            onChange={handleChange}
            className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
            required
          />
        </div>

        <div>
          <label htmlFor='email' className='block text-xs text-[#8a7d65] mb-1'>
            Email Address*
            {user && (
              <span className='text-xs text-green-600 ml-1'>
                (From account)
              </span>
            )}
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={measurementData.email}
            onChange={handleChange}
            readOnly={!!user}
            className={`w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65] ${
              user ? "bg-gray-50 cursor-not-allowed" : ""
            }`}
            required
          />
        </div>

        <div>
          <label htmlFor='phone' className='block text-xs text-[#8a7d65] mb-1'>
            Phone Number*
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={measurementData.phone}
            onChange={handleChange}
            className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
            required
          />
        </div>
      </div>
    </div>
  );
}
