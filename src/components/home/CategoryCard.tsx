import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import type { Category as PayloadCategory, Media } from "@/payload-types";

export type CustomCategory = {
  id: string;
  name: string;
  slug: string;
  staticImage: string;
  isCustom: boolean;
  parentCategory?: string;
};

export type CategoryCardData = PayloadCategory | CustomCategory;

interface CategoryCardProps {
  category: CategoryCardData;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Determine image source
  let imageSource: string | undefined;

  // Only use the URL if the image field is populated (is an object with a url)
  if (
    "image" in category &&
    category.image &&
    typeof category.image === "object" &&
    "url" in category.image
  ) {
    imageSource = category.image.url ?? undefined;
  }

  // Fallback to staticImage if imageSource is still undefined
  if (!imageSource && "staticImage" in category && category.staticImage) {
    imageSource = category.staticImage;
  }

  // Final fallback to a default image
  if (!imageSource) {
    imageSource = "/abayas/abaya4.webp"; // Default fallback
  }

  // Create the link URL based on available data
  const isCustom = "isCustom" in category && category.isCustom;
  const parentCat =
    "parentCategory" in category ? category.parentCategory : undefined;

  const linkUrl = isCustom
    ? "/custom"
    : parentCat
      ? `/collections/${parentCat}/${category.slug}`
      : `/collections/${category.slug || category.id}`;

  // Custom button text based on category type
  const buttonText = isCustom ? "Get Custom Order" : "Explore Collection";

  // The whole card is one link: a large tap target with a single, clear accessible name.
  // `!` on text colours overrides the unlayered `a { color: currentColor }` rule in styles.css.
  return (
    <Link
      href={linkUrl}
      className='group relative block h-36 overflow-hidden rounded-md bg-[#382f21] sm:h-44 md:h-[clamp(240px,48vh,400px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]'>
      <Image
        src={imageSource}
        alt=''
        fill
        className='object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100'
        sizes='(max-width: 768px) 100vw, 33vw'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5' />

      <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5'>
        <div>
          <h3 className='font-cinzel text-xl font-semibold leading-tight text-white! md:text-2xl'>
            {category.name}
          </h3>
          <span className='mt-1 block font-montserrat text-[11px] uppercase tracking-[0.2em] text-white/80!'>
            {buttonText}
          </span>
        </div>
        <span
          aria-hidden='true'
          className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#382f21]! transition-colors group-hover:bg-[#d4af37] group-hover:text-white!'>
          <FaArrowRight className='h-3 w-3' />
        </span>
      </div>
    </Link>
  );
}
