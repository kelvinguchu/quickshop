import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

// Accept both Payload-generated Category and a custom fallback type
import type { Category as PayloadCategory, Media } from "@/payload-types";

type CustomCategory = {
  id: string;
  name: string;
  slug: string;
  staticImage: string;
  isCustom: true;
};

type CategoryCardData = PayloadCategory | CustomCategory;

interface CategoryCardProps {
  category: CategoryCardData & {
    parentCategory?: string;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Determine image source
  let imageSource: string | undefined;

  if ("image" in category) {
    const img = (category as PayloadCategory).image as string | Media;
    if (typeof img === "string") {
      imageSource = img;
    } else if (img && typeof img === "object") {
      imageSource = img.url ?? undefined;
    }
  }

  if (!imageSource) {
    imageSource = category.staticImage ?? "/placeholder-category.jpg";
  }

  // Create the link URL based on available data
  const linkUrl = (category as CustomCategory).isCustom
    ? "/custom" // Direct to custom page for custom category
    : category.parentCategory
      ? `/collections/${category.parentCategory}/${category.slug}`
      : `/collections/${category.slug || category.id}`;

  // Custom button text based on category type
  const buttonText = (category as CustomCategory).isCustom
    ? "Get Custom Order"
    : "Explore Collection";

  return (
    <div className='group relative overflow-hidden rounded-sm'>
      {/* Dark overlay to ensure text visibility */}
      <div className='absolute inset-0 bg-black/40 z-10'></div>

      {/* Image */}
      <div className='relative h-[450px] w-full overflow-hidden'>
        <Image
          src={imageSource}
          alt={category.name}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-110'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      {/* Content - always visible */}
      <div className='absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6'>
        <h3 className='font-cinzel text-2xl md:text-3xl font-semibold text-white mb-4'>
          {category.name}
        </h3>
        <Link
          href={linkUrl}
          className='inline-flex items-center font-montserrat text-xs uppercase tracking-wider bg-white text-black border border-white px-5 py-2 hover:bg-[#d4af37] hover:border-[#d4af37] transition-colors'>
          {buttonText}
          <FaArrowRight className='ml-2 h-3 w-3' />
        </Link>
      </div>
    </div>
  );
}
