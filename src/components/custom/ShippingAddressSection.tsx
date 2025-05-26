import React from "react";

interface ShippingData {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface ShippingAddressSectionProps {
  measurementData: ShippingData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export function ShippingAddressSection({
  measurementData,
  handleChange,
}: Readonly<ShippingAddressSectionProps>) {
  return (
    <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
      <h3 className='font-cinzel text-sm md:text-lg text-[#382f21] mb-4'>
        Shipping Address
      </h3>

      <div className='space-y-4'>
        <div>
          <label
            htmlFor='address'
            className='block text-xs text-[#8a7d65] mb-1'>
            Address*
          </label>
          <input
            type='text'
            id='address'
            name='address'
            value={measurementData.address}
            onChange={handleChange}
            className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
            required
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='city'
              className='block text-xs text-[#8a7d65] mb-1'>
              City*
            </label>
            <input
              type='text'
              id='city'
              name='city'
              value={measurementData.city}
              onChange={handleChange}
              className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
              required
            />
          </div>

          <div>
            <label
              htmlFor='postalCode'
              className='block text-xs text-[#8a7d65] mb-1'>
              Postal Code*
            </label>
            <input
              type='text'
              id='postalCode'
              name='postalCode'
              value={measurementData.postalCode}
              onChange={handleChange}
              className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
              required
            />
          </div>

          <div>
            <label
              htmlFor='country'
              className='block text-xs text-[#8a7d65] mb-1'>
              Country*
            </label>
            <select
              id='country'
              name='country'
              value={measurementData.country}
              onChange={handleChange}
              className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
              required>
              <option value='Kenya'>Kenya</option>
              <option value='Uganda'>Uganda</option>
              <option value='Tanzania'>Tanzania</option>
              <option value='Rwanda'>Rwanda</option>
              <option value='Ethiopia'>Ethiopia</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 