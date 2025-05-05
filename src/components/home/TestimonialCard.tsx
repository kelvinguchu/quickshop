import React from "react";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    customerName: string;
    text: string;
    rating: number | string;
    customerImage?: {
      url: string;
    };
  };
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  // Convert rating to number if it's a string
  const ratingNumber =
    typeof testimonial.rating === "string"
      ? parseInt(testimonial.rating, 10)
      : testimonial.rating;

  return (
    <div className='bg-white p-8 rounded-sm shadow-sm relative flex flex-col h-full'>
      <div className='absolute -top-4 left-6 text-[#8a7d65] opacity-20'>
        <FaQuoteLeft className='w-12 h-12' />
      </div>

      <div className='flex-grow'>
        <div className='text-[#d4af37] mb-4'>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={
                i < ratingNumber ? "text-[#d4af37]" : "text-[#e6ded0]"
              }>
              ★
            </span>
          ))}
        </div>

        <p className='font-cormorant text-lg italic text-[#382f21] mb-6 relative z-10'>
          "{testimonial.text}"
        </p>
      </div>

      <div className='flex items-center mt-4'>
        {testimonial.customerImage ? (
          <div className='h-12 w-12 mr-4 relative rounded-full overflow-hidden'>
            <Image
              src={testimonial.customerImage.url}
              alt={testimonial.customerName}
              fill
              className='object-cover'
            />
          </div>
        ) : (
          <div className='h-12 w-12 mr-4 rounded-full bg-[#f5f2ec] flex items-center justify-center'>
            <span className='font-cinzel text-lg text-[#8a7d65]'>
              {testimonial.customerName.charAt(0)}
            </span>
          </div>
        )}

        <span className='font-cinzel text-[#382f21] font-medium'>
          {testimonial.customerName}
        </span>
      </div>
    </div>
  );
}
