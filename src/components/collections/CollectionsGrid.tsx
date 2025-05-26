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

export default function CollectionsGrid({ categories }: Readonly<CollectionsGridProps>) {
  // Map Payload categories to a simpler structure for view components
  const processedCategories: ProcessedCategory[] = categories.map((cat) => {
    let imageUrl: string | undefined;

    if (typeof cat.image === "string") {
      imageUrl = cat.image;
    } else if (cat.image && typeof cat.image === "object") {
      imageUrl = (cat.image).url ?? undefined;
    }

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: imageUrl,
      mainImage: imageUrl,
    };
  });

  return (
    <div className='bg-[#f9f6f2]'>
      <MobileCollectionView categories={processedCategories} />
      <DesktopCollectionView categories={processedCategories} />
    </div>
  );
}
