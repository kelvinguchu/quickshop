import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { TbBoxOff } from "react-icons/tb";
import ProductCard from "@/components/home/ProductCard";
import FilterBar from "./FilterBar";
import type { Category, Subcategory, Product } from "@/payload-types";

interface CategoryDisplayProps {
  category: Category;
  subcategories: Subcategory[];
  products: Product[];
  totalProducts: number;
  currentSort: string;
}

export default function CategoryDisplay({
  category,
  subcategories,
  products,
  totalProducts,
  currentSort,
}: CategoryDisplayProps) {
  return (
    <div className='w-full bg-white lg:mt-8'>
      {/* Compact header with breadcrumb */}
      <div className='font-montserrat border-b border-gray-200 h-[40px] flex items-center overflow-x-auto'>
        <div className='container mx-auto px-2 sm:px-4'>
          <div className='flex items-center text-xs sm:text-sm whitespace-nowrap'>
            <Link href='/' className='text-gray-500 hover:text-gray-800'>
              Home
            </Link>
            <span className='mx-1 sm:mx-2 text-gray-400'>/</span>
            <Link
              href='/collections'
              className='text-gray-500 hover:text-gray-800'>
              Collections
            </Link>
            <span className='mx-1 sm:mx-2 text-gray-400'>/</span>
            <span className='font-medium text-gray-800'>{category.name}</span>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-2 sm:px-4 py-4 sm:py-6'>
        {/* Elegant centered category title */}
        <div className='mb-4 sm:mb-6 text-center'>
          <h2 className='font-cinzel text-lg sm:text-xl font-bold text-[#382f21] inline-block relative'>
            {category.name}
            <span className='block text-xs font-montserrat text-gray-500 mt-1'>
              {totalProducts} products
            </span>
            <div className='absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-6 sm:w-8 h-0.5 bg-[#d4af37]'></div>
          </h2>
        </div>

        <FilterBar
          category={category}
          siblingSubcategories={subcategories}
          currentSort={currentSort}
        />

        {/* Product grid - updated grid cols */}
        {products.length > 0 ? (
          <>
            {/* Default to 2 columns, 3 on sm+, 4 on lg+ */}
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'>
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>

            {/* Pagination - added responsive classes */}
            {totalProducts > 12 && (
              <div className='mt-6 sm:mt-8 flex justify-center'>
                <nav className='inline-flex border border-gray-200 rounded overflow-hidden'>
                  <button
                    disabled
                    className='bg-white text-gray-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-r border-gray-200'>
                    Previous
                  </button>
                  <span className='bg-gray-100 text-gray-800 font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-r border-gray-200'>
                    1
                  </span>
                  <button
                    disabled
                    className='bg-white text-gray-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'>
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-8 sm:py-12 border border-gray-200 rounded'>
            <div className='mb-3 sm:mb-4'>
              <TbBoxOff
                className='mx-auto text-gray-400 w-8 h-8 sm:w-10 sm:h-10'
                strokeWidth={1}
              />
            </div>
            <h3 className='text-base sm:text-lg font-medium text-gray-900 mb-1'>
              No Products Found
            </h3>
            <p className='text-sm text-gray-500 mb-4 sm:mb-6'>
              We couldn't find any products in this category.
            </p>
            <Link
              href='/collections'
              className='inline-block bg-gray-800 text-white px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded hover:bg-gray-700 transition-colors'>
              Browse Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
