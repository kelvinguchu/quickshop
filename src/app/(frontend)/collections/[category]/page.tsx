import React from "react";
import { notFound } from "next/navigation";
import CategoryDisplay from "@/components/collections/CategoryDisplay";
import { getCategoryBySlug, getProducts, getSubcategories } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryDoc = await getCategoryBySlug(category);

  if (!categoryDoc) {
    return { title: "Not Found", description: "Page not found" };
  }

  return {
    title: `${categoryDoc.name} Collection - QuickShop`,
    description: `Browse our premium ${categoryDoc.name.toLowerCase()} collection`,
  };
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

  const categoryDoc = await getCategoryBySlug(category);
  if (!categoryDoc) {
    notFound();
  }

  const [subcategories, products] = await Promise.all([
    getSubcategories(categoryDoc.id),
    getProducts({ category: categoryDoc.id }, sort),
  ]);

  return (
    <CategoryDisplay
      category={categoryDoc}
      subcategories={subcategories}
      products={products.docs}
      totalProducts={products.totalDocs}
      currentSort={sort}
    />
  );
}
