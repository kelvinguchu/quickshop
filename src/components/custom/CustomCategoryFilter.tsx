"use client";

import React, { useState, useMemo } from "react";
import type { Product, Category } from "@/payload-types";
import CustomProductCard from "./CustomProductCard";

interface CustomCategoryFilterProps {
  categories: Category[];
  products: Product[];
}

export default function CustomCategoryFilter({
  categories,
  products,
}: Readonly<CustomCategoryFilterProps>) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    return products.filter((product) => {
      if (typeof product.category === "object" && product.category?.slug) {
        return product.category.slug === selectedCategory;
      }
      return false;
    });
  }, [products, selectedCategory]);

  return (
    <div className='mb-4 sm:mb-6'>
      {/* Filter Buttons */}
      <div className='flex justify-center mb-4 sm:mb-5 px-1 sm:px-2'>
        <div className='inline-flex bg-white border border-[#e0d8c9] rounded-sm overflow-hidden w-full max-w-xs sm:max-w-md'>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-1 px-1.5 sm:px-3 py-2 sm:py-2.5 font-montserrat text-[10px] sm:text-xs uppercase tracking-wide transition-colors whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-[#382f21] text-white"
                : "text-[#382f21] hover:bg-[#f5f2ec]"
            }`}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`flex-1 px-1.5 sm:px-3 py-2 sm:py-2.5 font-montserrat text-[10px] sm:text-xs uppercase tracking-wide transition-colors border-l border-[#e0d8c9] whitespace-nowrap ${
                selectedCategory === category.slug
                  ? "bg-[#382f21] text-white"
                  : "text-[#382f21] hover:bg-[#f5f2ec]"
              }`}>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Count */}
      <div className='text-center mb-4 sm:mb-5 px-2 sm:px-4'>
        <p className='text-[#8a7d65] font-montserrat text-[10px] sm:text-xs'>
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} available
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 px-1 sm:px-2 lg:px-0'>
          {filteredProducts.map((product) => (
            <CustomProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className='text-center py-16'>
          <div className='w-24 h-24 mx-auto mb-6 bg-[#f5f2ec] rounded-full flex items-center justify-center'>
            <svg
              className='w-12 h-12 text-[#8a7d65]'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <h3 className='font-cinzel text-xl text-[#382f21] mb-2'>
            No Products Available
          </h3>
          <p className='text-[#8a7d65]'>
            {selectedCategory === "all"
              ? "No products available for custom measurements at the moment."
              : `No ${categories.find((c) => c.slug === selectedCategory)?.name ?? "products"} available for custom measurements.`}
          </p>
        </div>
      )}
    </div>
  );
}
