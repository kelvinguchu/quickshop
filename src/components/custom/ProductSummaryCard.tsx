import React from "react";
import Image from "next/image";
import type { Product } from "@/payload-types";

interface ProductSummaryCardProps {
  product: Product;
  depositAmount: number;
  finalImageSource: string;
}

export function ProductSummaryCard({
  product,
  depositAmount,
  finalImageSource,
}: Readonly<ProductSummaryCardProps>) {
  return (
    <div className='bg-white rounded-sm border border-[#e0d8c9] p-4 sticky top-4'>
      <div className='aspect-[4/5] w-full bg-[#f9f6f2] rounded-sm overflow-hidden mb-4'>
        <Image
          src={finalImageSource}
          alt={product.name}
          width={300}
          height={375}
          className='w-full h-full object-cover'
        />
      </div>
      <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
        {product.name}
      </h3>
      <div className='space-y-1 text-sm text-[#8a7d65]'>
        <p>
          Full Price:{" "}
          <span className='font-medium'>${product.price.toFixed(2)}</span>
        </p>
        <p>
          Deposit (30%):{" "}
          <span className='font-medium text-amber-600'>
            ${depositAmount.toFixed(2)}
          </span>
        </p>
        <p>
          Remaining:{" "}
          <span className='font-medium'>
            ${(product.price - depositAmount).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}
