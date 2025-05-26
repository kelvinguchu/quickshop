"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ruler, ArrowRight } from "lucide-react";
import type { Product } from "@/payload-types";

interface CustomProductCardProps {
  product: Product;
}

export default function CustomProductCard({
  product,
}: Readonly<CustomProductCardProps>) {
  const [isHovered, setIsHovered] = useState(false);

  // Handle image source
  let imageSource: string | undefined;

  if (
    product.mainImage &&
    typeof product.mainImage === "object" &&
    "url" in product.mainImage &&
    typeof product.mainImage.url === "string" &&
    product.mainImage.url.trim() !== ""
  ) {
    imageSource = product.mainImage.url;
  }

  const finalImageSource = imageSource ?? "/qamis/qamis1.webp";

  // Calculate 30% deposit
  const depositAmount = (product.price * 0.3).toFixed(2);

  return (
    <div
      className='group relative overflow-hidden border border-[#e0d8c9]/40 rounded-sm bg-white transition-all duration-300 hover:shadow-md hover:border-[#e0d8c9]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Product Image */}
      <div className='relative aspect-[4/5] w-full overflow-hidden bg-[#f9f6f2]'>
        <Image
          src={finalImageSource}
          alt={product.name}
          fill
          sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
          className='object-cover transition-all duration-700 group-hover:scale-105'
          onError={(e) => {
            // Fallback to a known good image if the current one fails
            const target = e.target as HTMLImageElement;
            if (target.src !== "/qamis/qamis1.webp") {
              target.src = "/qamis/qamis1.webp";
            }
          }}
        />
        <div className='absolute inset-0 bg-[#382f21]/0 transition-all duration-300 group-hover:bg-[#382f21]/10'></div>
      </div>

      {/* Product Info */}
      <div className='p-2 sm:p-3 border-t border-[#e0d8c9]/40'>
        <h3 className='font-cinzel text-xs sm:text-sm font-medium text-[#382f21] mb-1 line-clamp-2'>
          {product.name}
        </h3>

        <div className='text-xs text-[#8a7d65] mb-2 sm:mb-3'>
          <span className='block sm:inline'>
            Full: ${product.price.toFixed(2)}
          </span>
          <span className='hidden sm:inline'> | </span>
          <span className='block sm:inline text-amber-600'>
            Deposit: ${depositAmount}
          </span>
        </div>

        {/* Fill in Measurements Button */}
        <Link href={`/custom/${product.id}`}>
          <button className='w-full flex items-center justify-center gap-1 sm:gap-2 bg-transparent border border-[#382f21] text-[#382f21] hover:bg-[#382f21] hover:text-white rounded-sm px-2 sm:px-4 py-1.5 sm:py-2 font-montserrat text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300'>
            <Ruler className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
            <span className='hidden sm:inline'>Fill in Measurements</span>
            <span className='sm:hidden'>Measurements</span>
            <ArrowRight className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
          </button>
        </Link>
      </div>
    </div>
  );
}
