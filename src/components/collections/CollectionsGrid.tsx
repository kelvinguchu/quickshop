import React from "react";
import MobileCollectionView from "./MobileCollectionView";
import DesktopCollectionView from "./DesktopCollectionView";

// Use Payload-generated Category type for incoming data
import type { Category as PayloadCategory, Media } from "@/payload-types";

interface ProcessedCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  mainImage?: string;
}

interface CollectionsGridProps {
  categories: PayloadCategory[];
}

export default function CollectionsGrid({ categories }: CollectionsGridProps) {
  // Map Payload categories to a simpler structure for view components
  const processedCategories: ProcessedCategory[] = categories.map((cat) => {
    let imageUrl: string | undefined;

    if (typeof cat.image === "string") {
      imageUrl = cat.image;
    } else if (cat.image && typeof cat.image === "object") {
      imageUrl = (cat.image as Media).url ?? undefined;
    }

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: imageUrl,
      mainImage: imageUrl,
    };
  });

  // Specify default images when no categories exist
  const defaultCategories = [
    {
      id: "1",
      name: "Abayas",
      slug: "abayas",
      mainImage: "/abayas/abaya1.webp",
    },
    {
      id: "2",
      name: "Qamis",
      slug: "qamis",
      mainImage: "/qamis/qamis1.webp",
    },
  ];

  // Use processed categories if they exist, otherwise use defaults
  const displayCategories =
    processedCategories.length > 0 ? processedCategories : defaultCategories;

  return (
    <div className='bg-[#f9f6f2]'>
      <MobileCollectionView categories={displayCategories} />
      <DesktopCollectionView categories={displayCategories} />
    </div>
  );
}
