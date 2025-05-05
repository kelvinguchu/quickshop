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
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;

  // Get sort parameter or default to 'latest'
  const sort =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : "latest";

  // Initialize payload
  const payload = await getPayload({ config });

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

  // Initialize with empty data
  let subcategories: PaginatedDocs<Subcategory> = {
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
  let products: PaginatedDocs<Product> = {
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
    // Fetch all subcategories for the current category
    subcategories = await payload.find<
      "subcategories",
      SubcategoriesSelect<true>
    >({
      collection: "subcategories",
      where: {
        category: {
          equals: categoryId,
        },
      },
      sort: "displayOrder",
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
  }

  try {
    // Fetch products directly with literal query object
    products = await payload.find<"products", ProductsSelect<true>>({
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
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <CategoryDisplay
      category={categoryDoc}
      subcategories={subcategories.docs}
      products={products.docs}
      totalProducts={products.totalDocs}
      currentSort={sort}
    />
  );
}
