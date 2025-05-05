import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";
import SubcategoryDisplay from "@/components/collections/SubcategoryDisplay";

// Define the Subcategory interface to match the one in SubcategoryDisplay component
interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerImage?: {
    url: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  // Initialize payload
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  try {
    // First get category
    const categoryQuery = await payload.find({
      collection: "categories",
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    });

    if (categoryQuery.docs.length === 0) {
      return {
        title: "Not Found",
        description: "Page not found",
      };
    }

    // Then get subcategory
    const subcategoryQuery = await payload.find({
      collection: "subcategories",
      where: {
        slug: {
          equals: slug,
        },
        category: {
          equals: categoryQuery.docs[0].id,
        },
      },
      limit: 1,
    });

    if (subcategoryQuery.docs.length === 0) {
      return {
        title: "Not Found",
        description: "Page not found",
      };
    }

    const subcategoryName = subcategoryQuery.docs[0].name;
    const categoryName = categoryQuery.docs[0].name;

    return {
      title: `${subcategoryName} - ${categoryName} Collection | QuickShop`,
      description: `Browse our premium ${subcategoryName} in the ${categoryName} collection`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Collections - QuickShop",
      description: "Browse our collections",
    };
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Get sort parameter or default to 'latest'
  const sort =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : "latest";

  // Initialize payload
  const payload = await getPayload({ config });

  // Fetch the category
  const categoryQuery = await payload.find({
    collection: "categories",
    where: {
      slug: {
        equals: category,
      },
    },
    limit: 1,
  });

  if (categoryQuery.docs.length === 0) {
    notFound();
  }

  const categoryDoc = categoryQuery.docs[0];
  const categoryId = categoryDoc.id;

  // Fetch the subcategory
  const subcategoryQuery = await payload.find({
    collection: "subcategories",
    where: {
      slug: {
        equals: slug,
      },
      category: {
        equals: categoryId,
      },
    },
    limit: 1,
  });

  if (subcategoryQuery.docs.length === 0) {
    notFound();
  }

  const subcategoryDoc = subcategoryQuery.docs[0];
  const subcategoryId = subcategoryDoc.id;

  // Initialize with empty data
  let siblingSubcategories = { docs: [] as Subcategory[] };
  let products = { docs: [], totalDocs: 0 };

  try {
    // Fetch all subcategories for the current category (siblings)
    siblingSubcategories = await payload.find({
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
    // Build the query for products
    const productsQuery = {
      collection: "products",
      where: {
        subcategory: {
          equals: subcategoryId,
        },
      },
      sort:
        sort === "price-desc"
          ? "-price"
          : sort === "price-asc"
            ? "price"
            : "-createdAt",
      limit: 12,
    };

    // Fetch products
    products = await payload.find(productsQuery);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <SubcategoryDisplay
      category={categoryDoc}
      subcategory={subcategoryDoc}
      siblingSubcategories={siblingSubcategories.docs}
      products={products.docs}
      totalProducts={products.totalDocs}
      currentSort={sort}
    />
  );
}
