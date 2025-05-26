import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import type { Product, Category } from "@/payload-types";
import CustomCategoryFilter from "@/components/custom/CustomCategoryFilter";

export const metadata = {
  title: "Custom Measurements - QuickShop",
  description: "Get your perfect fit with our custom measurement service",
};

export default async function CustomPage() {
  const payload = await getPayload({ config });

  // Fetch categories (Abaya and Qamis)
  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    // Fetch main categories
    const categoriesData = await payload.find({
      collection: "categories",
      where: {
        slug: {
          in: ["abaya", "qamis"],
        },
      },
      sort: "displayOrder",
      depth: 1,
    });

    categories = categoriesData.docs || [];

    // Fetch all active products
    const productsData = await payload.find({
      collection: "products",
      where: {
        status: {
          equals: "active",
        },
      },
      sort: "-createdAt",
      limit: 50,
      depth: 2,
    });

    products = productsData.docs || [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div className='min-h-screen bg-[#f9f6f2] py-4 sm:py-6 md:py-8 overflow-x-hidden'>
      <div className='max-w-7xl mx-auto px-2 sm:px-4'>
        {/* Header Section */}
        <div className='text-center mb-3 sm:mb-4 px-2'>
          <h1 className='font-cinzel text-xs sm:text-sm md:text-base text-[#382f21] whitespace-nowrap'>
            <span className='sm:hidden'>Custom Orders</span>
            <span className='hidden sm:inline'>Custom Measurements</span>
          </h1>
        </div>

        {/* Category Filter */}
        <CustomCategoryFilter categories={categories} products={products} />
      </div>
    </div>
  );
}
