import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import type { PaginatedDocs } from "payload";
import type { Product } from "@/payload-types";
import config from "@/payload.config";

// Import our components
import ProductGallery from "@/components/products/ProductGallery";
import ProductDetails from "@/components/products/ProductDetails";
import RelatedProducts from "@/components/products/RelatedProducts";
import Breadcrumb from "@/components/products/Breadcrumb";

// Client component wrapper for product details section with dynamic color selection
import dynamic from "next/dynamic";

// Import the client component for handling color selection
const ProductViewWithColorSelection = dynamic(
  () => import("@/components/products/ProductViewWithColorSelection"),
  { ssr: true }
);

// Extend Product type to include optional images array (if present)
type ProductWithImages = Product & {
  images?: { url: string }[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    // Initialize payload
    const payload = await getPayload({ config });

    // Fetch the product
    const productQuery = await payload.find({
      collection: "products",
      where: {
        id: {
          equals: slug,
        },
      },
      limit: 1,
    });

    if (productQuery.docs.length === 0) {
      return {
        title: "Not Found",
        description: "Product not found",
      };
    }

    const product = productQuery.docs[0] as ProductWithImages;

    // Handle description properly, as it's a richText field
    let descriptionText = "";
    if (product.description) {
      const descUnknown = product.description as unknown;
      // Check if it's a plain string
      if (typeof descUnknown === "string") {
        descriptionText = descUnknown.slice(0, 160);
      } else if (
        typeof descUnknown === "object" &&
        descUnknown !== null &&
        "root" in descUnknown &&
        (descUnknown as any).root.children
      ) {
        // Extract text from the richText structure
        descriptionText = (descUnknown as any).root.children
          .map((node: any) => {
            // Try to extract text from paragraph nodes
            if (node.children && Array.isArray(node.children)) {
              return node.children
                .filter((child: any) => child.text)
                .map((child: any) => child.text)
                .join(" ");
            }
            return "";
          })
          .join(" ")
          .slice(0, 160);
      }
    }

    return {
      title: `${product.name} - QuickShop`,
      description: descriptionText || "View product details",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product - QuickShop",
      description: "View product details",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Initialize payload
  const payload = await getPayload({ config });

  // Fetch the product
  const productQuery = await payload.find({
    collection: "products",
    where: {
      id: {
        equals: slug,
      },
    },
    limit: 1,
  });

  if (productQuery.docs.length === 0) {
    notFound();
  }

  const product = productQuery.docs[0] as ProductWithImages;

  // Fetch related products (same category)
  let relatedProducts: PaginatedDocs<Product> = {
    docs: [],
    totalDocs: 0,
    limit: 0,
    page: 1,
    pagingCounter: 0,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };
  try {
    relatedProducts = await payload.find({
      collection: "products",
      where: {
        and: [
          {
            category: {
              equals:
                typeof product.category === "string"
                  ? product.category
                  : product.category?.id,
            },
          },
          {
            id: {
              not_equals: product.id,
            },
          },
        ],
      },
      limit: 4,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
  }

  // Fetch additional product images if they exist
  const additionalImages = Array.isArray(product.images)
    ? product.images.map((img) => ({ url: img.url, alt: product.name }))
    : [];

  return (
    <div className='w-full bg-white md:mt-8'>
      <Breadcrumb productName={product.name} category={product.category} />

      <div className='container mx-auto mt-10 px-4 py-8'>
        <ProductViewWithColorSelection
          product={product}
          additionalImages={additionalImages}
        />
        <div className='pb-24 md:pb-0'>
          <RelatedProducts products={relatedProducts.docs} />
        </div>
      </div>
    </div>
  );
}
