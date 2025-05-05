"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export interface Testimonial {
  id: string;
  customerName: string;
  text: string;
  rating: number | string;
}

interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
}

export default function TestimonialMarquee({
  testimonials,
}: TestimonialMarqueeProps) {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className='text-[#d4af37]' />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key='half' className='text-[#d4af37]' />);
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className='text-[#d4af37]' />);
    }

    return stars;
  };

  return (
    <div className='w-full py-4'>
      <Marquee
        gradient={true}
        gradientColor={[249, 246, 242]} // RGB for #f9f6f2
        gradientWidth={50}
        speed={40}
        pauseOnHover={true}>
        <div className='flex gap-6'>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className='bg-white p-6 rounded-lg shadow-sm border border-[#e0d8c9]/40 w-80 mx-4 flex-shrink-0'>
              <div className='flex items-center mb-4'>
                {renderStars(Number(testimonial.rating))}
              </div>
              <p className='text-[#5c5243] mb-4 italic font-cormorant text-lg'>
                "{testimonial.text}"
              </p>
              <div className='text-[#382f21] font-medium font-cinzel'>
                — {testimonial.customerName}
              </div>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
