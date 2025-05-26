import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";
import type { PaginatedDocs } from "payload";
import type {
  Subcategory,
  Product,
  SubcategoriesSelect,
  ProductsSelect,
} from "@/payload-types";
import CategoryDisplay from "@/components/collections/CategoryDisplay";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  try {
    // Initialize payload
    const payload = await getPayload({ config });

    // Fetch the category to get its name
    const categoryData = await payload.find({
      collection: "categories",
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    });

    if (categoryData.docs.length === 0) {
      return {
        title: "Not Found",
        description: "Page not found",
      };
    }

    const categoryName = categoryData.docs[0].name;

    return {
      title: `${categoryName} Collection - QuickShop`,
      description: `Browse our premium ${categoryName.toLowerCase()} collection`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Collections - QuickShop",
      description: "Browse our collections",
    };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;

  // Get sort parameter or default to 'latest'
  const sort =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : "latest";

  const payload = await getPayload({ config });

  try {
    // Fetch the category
    const categoryData = await payload.find({
      collection: "categories",
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    });

    if (categoryData.docs.length === 0) {
      notFound();
    }

    const categoryDoc = categoryData.docs[0];
    const categoryId = categoryDoc.id;

    // Fetch subcategories and products in parallel for better performance
    const [subcategoriesData, productsData] = await Promise.all([
      payload.find<"subcategories", SubcategoriesSelect<true>>({
        collection: "subcategories",
        where: {
          category: {
            equals: categoryId,
          },
        },
        sort: "displayOrder",
      }),
      payload.find<"products", ProductsSelect<true>>({
        collection: "products",
        where: {
          category: {
            equals: categoryId,
          },
        },
        sort:
          sort === "price-desc"
            ? "-price"
            : sort === "price-asc"
              ? "price"
              : "-createdAt",
        limit: 12,
      }),
    ]);

    return (
      <CategoryDisplay
        category={categoryDoc}
        subcategories={subcategoriesData.docs}
        products={productsData.docs}
        totalProducts={productsData.totalDocs}
        currentSort={sort}
      />
    );
  } catch (error) {
    console.error("Error fetching category data:", error);
    throw error;
  }
}
