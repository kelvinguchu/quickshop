import React from "react";
import { notFound } from "next/navigation";
import SubcategoryDisplay from "@/components/collections/SubcategoryDisplay";
import {
  getCategoryBySlug,
  getProducts,
  getSubcategories,
  getSubcategoryBySlug,
} from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const categoryDoc = await getCategoryBySlug(category);
  const subcategoryDoc = categoryDoc
    ? await getSubcategoryBySlug(categoryDoc.id, slug)
    : null;

  if (!categoryDoc || !subcategoryDoc) {
    return { title: "Not Found", description: "Page not found" };
  }

  return {
    title: `${subcategoryDoc.name} - ${categoryDoc.name} Collection | QuickShop`,
    description: `Browse our premium ${subcategoryDoc.name} in the ${categoryDoc.name} collection`,
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { category, slug } = await params;
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

  const subcategoryDoc = await getSubcategoryBySlug(categoryDoc.id, slug);
  if (!subcategoryDoc) {
    notFound();
  }

  const [siblingSubcategories, products] = await Promise.all([
    getSubcategories(categoryDoc.id),
    getProducts({ subcategory: subcategoryDoc.id }, sort),
  ]);

  return (
    <SubcategoryDisplay
      category={categoryDoc}
      subcategory={subcategoryDoc}
      siblingSubcategories={siblingSubcategories}
      products={products.docs}
      totalProducts={products.totalDocs}
      currentSort={sort}
    />
  );
}
