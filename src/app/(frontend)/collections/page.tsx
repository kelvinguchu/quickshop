import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import CollectionsGrid from "@/components/collections/CollectionsGrid";

export const metadata = {
  title: "Collections - QuickShop",
  description: "Browse our beautiful Islamic clothing collections",
};

export default async function CollectionsPage() {
  const payload = await getPayload({ config });

  try {
    // Fetch main categories with images
    const categoriesData = await payload.find({
      collection: "categories",
      where: {
        featured: {
          equals: true,
        },
      },
      sort: "displayOrder",
      depth: 1,
      limit: 10,
    });

    const categories = categoriesData.docs || [];

    return <CollectionsGrid categories={categories} />;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
}
