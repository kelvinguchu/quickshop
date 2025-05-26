import React from "react";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import config from "@/payload.config";
import type { Product } from "@/payload-types";
import CustomMeasurementForm from "@/components/custom/CustomMeasurementForm";

interface CustomProductPageProps {
  params: Promise<{
    product: string;
  }>;
}

export async function generateMetadata({ params }: CustomProductPageProps) {
  const payload = await getPayload({ config });
  const { product: slug } = await params;

  try {
    const productQuery = await payload.find({
      collection: "products",
      where: {
        id: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2,
    });

    if (productQuery.docs.length === 0) {
      return {
        title: "Custom Measurements | QuickShop",
        description: "Provide custom measurements for your selected product",
      };
    }

    const product = productQuery.docs[0];

    return {
      title: `Custom Measurements - ${product.name} | QuickShop`,
      description: `Provide custom measurements for ${product.name}`,
    };
  } catch (error) {
    return {
      title: "Custom Measurements | QuickShop",
      description: "Provide custom measurements for your selected product",
    };
  }
}

export default async function CustomProductPage({
  params,
}: Readonly<CustomProductPageProps>) {
  const payload = await getPayload({ config });
  const { product: slug } = await params;

  let product: Product | null = null;

  try {
    const productQuery = await payload.find({
      collection: "products",
      where: {
        id: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2,
    });

    if (productQuery.docs.length === 0) {
      notFound();
    }

    product = productQuery.docs[0];
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }

  if (!product || product.status !== "active") {
    notFound();
  }

  return (
    <div className='min-h-screen bg-[#f9f6f2] py-4 sm:py-6 md:py-8'>
      <div className='max-w-4xl mx-auto px-2 sm:px-4 mb-20 md:mb-0'>
        {/* Header */}
        <div className='text-center mb-6'>
          <h1 className='font-cinzel text-sm sm:text-lg md:text-xl text-[#382f21] mb-2'>
           Measurements
          </h1>
          <p className='font-montserrat text-xs sm:text-sm text-[#8a7d65]'>
            Provide your measurements for:{" "}
            <span className='font-medium'>{product.name}</span>
          </p>
        </div>

        {/* Custom Measurement Form */}
        <CustomMeasurementForm product={product} />
      </div>
    </div>
  );
}
