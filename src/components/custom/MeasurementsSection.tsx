import React from "react";
import { Ruler } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/payload-types";

interface MeasurementData {
  chest: string;
  shoulder: string;
  sleeve: string;
  length: string;
  waist: string;
  hip: string;
  notes: string;
}

interface MeasurementsSectionProps {
  measurementData: MeasurementData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  product: Product;
}

export function MeasurementsSection({
  measurementData,
  handleChange,
  product,
}: Readonly<MeasurementsSectionProps>) {
  // Determine category slug from product
  const getCategorySlug = (): string => {
    if (typeof product.category === "string") {
      return product.category;
    }
    return product.category?.slug || "abaya"; // Default to abaya if no category
  };

  const categorySlug = getCategorySlug();

  // Measurement guide images based on category
  const measurementImages = {
    chest: `/measurements/${categorySlug}-chest.webp`,
    shoulder: `/measurements/${categorySlug}-shoulders.webp`,
    sleeve: `/measurements/${categorySlug}-sleeve.webp`,
    length: `/measurements/${categorySlug}-full-length.webp`,
    waist: `/measurements/${categorySlug}-waist.webp`,
    hip: `/measurements/${categorySlug}-waist.webp`, // Using waist image for hip as they're similar
  };

  const measurementFields = [
    {
      id: "chest",
      name: "chest",
      label: "Chest/Bust*",
      placeholder: "e.g. 96",
      image: measurementImages.chest,
      isFullLength: false,
    },
    {
      id: "shoulder",
      name: "shoulder",
      label: "Shoulder Width*",
      placeholder: "e.g. 42",
      image: measurementImages.shoulder,
      isFullLength: false,
    },
    {
      id: "sleeve",
      name: "sleeve",
      label: "Sleeve Length*",
      placeholder: "e.g. 60",
      image: measurementImages.sleeve,
      isFullLength: false,
    },
    {
      id: "length",
      name: "length",
      label: "Total Length*",
      placeholder: "e.g. 140",
      image: measurementImages.length,
      isFullLength: true,
    },
    {
      id: "waist",
      name: "waist",
      label: "Waist*",
      placeholder: "e.g. 80",
      image: measurementImages.waist,
      isFullLength: false,
    },
    {
      id: "hip",
      name: "hip",
      label: "Hip*",
      placeholder: "e.g. 100",
      image: measurementImages.hip,
      isFullLength: false,
    },
  ];

  return (
    <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
      <h3 className='font-cinzel text-sm md:text-lg text-[#382f21] mb-4 flex items-center gap-2'>
        <Ruler className='h-5 w-5' />
        Body Measurements (cm)
      </h3>

      <div className='space-y-6'>
        {measurementFields.map((field) => (
          <div key={field.id} className='space-y-3'>
            {/* Input Field - Full Width */}
            <div>
              <label
                htmlFor={field.id}
                className='block text-xs text-[#8a7d65] mb-1'>
                {field.label}
              </label>
              <input
                type='number'
                id={field.id}
                name={field.name}
                value={measurementData[field.name as keyof MeasurementData]}
                onChange={handleChange}
                className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                placeholder={field.placeholder}
                required
              />
            </div>

            {/* Measurement Photo - Full width, height based on type */}
            <div className='w-full'>
              <div
                className={`w-full bg-[#f9f6f2] rounded-sm overflow-hidden border border-[#e0d8c9] ${
                  field.isFullLength ? "h-96" : "h-24 sm:h-32 md:h-40"
                }`}>
                <Image
                  src={field.image}
                  alt={`How to measure ${field.label.replace("*", "")}`}
                  width={400}
                  height={field.isFullLength ? 384 : 96}
                  className='w-full h-full object-cover'
                />
              </div>
              <p className='text-xs text-[#8a7d65] text-center mt-2'>
                {field.label.replace("*", "")} Guide
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6'>
        <label htmlFor='notes' className='block text-xs text-[#8a7d65] mb-1'>
          Additional Notes (Optional)
        </label>
        <textarea
          id='notes'
          name='notes'
          value={measurementData.notes}
          onChange={handleChange}
          rows={3}
          className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
          placeholder='Any special requirements or notes...'
        />
      </div>
    </div>
  );
}
