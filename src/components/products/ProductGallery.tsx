import React, { useState } from "react";
import Image from "next/image";

interface ProductImage {
  url: string;
  alt?: string;
}

interface ColorVariation {
  color: string;
  colorCode: string;
  image: {
    url: string;
  };
  additionalImages?: Array<{
    image: {
      url: string;
    };
  }>;
}

interface ProductGalleryProps {
  mainImage: ProductImage | null;
  additionalImages?: ProductImage[];
  productName: string;
  colorVariations?: ColorVariation[];
  selectedColorCode?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  mainImage,
  additionalImages = [],
  productName,
  colorVariations = [],
  selectedColorCode,
}) => {
  // State to track the main displayed image
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(
    mainImage?.url || null
  );

  // Get the currently selected color variation
  const selectedVariation = selectedColorCode
    ? colorVariations.find((c) => c.colorCode === selectedColorCode)
    : null;

  // Determine which images to display based on selected color
  const displayImages = React.useMemo(() => {
    // If a color is selected, use that color's images
    if (selectedVariation) {
      const variationImages = [
        {
          url: selectedVariation.image.url,
          alt: `${productName} - ${selectedVariation.color}`,
        },
      ];

      // Add additional images for this color variation if they exist
      if (
        selectedVariation.additionalImages &&
        selectedVariation.additionalImages.length > 0
      ) {
        selectedVariation.additionalImages.forEach((img, index) => {
          variationImages.push({
            url: img.image.url,
            alt: `${productName} - ${selectedVariation.color} view ${index + 1}`,
          });
        });
      }

      return variationImages;
    }

    // Otherwise use the default main image and additionalImages
    const images: ProductImage[] = [];
    if (mainImage) {
      images.push(mainImage);
    }

    // Add unique additional images
    additionalImages.forEach((img) => {
      if (!images.some((existing) => existing.url === img.url)) {
        images.push(img);
      }
    });

    return images;
  }, [mainImage, additionalImages, selectedVariation, productName]);

  // Reset active image when color changes
  React.useEffect(() => {
    if (selectedVariation && selectedVariation.image) {
      setActiveImageUrl(selectedVariation.image.url);
    } else if (mainImage) {
      setActiveImageUrl(mainImage.url);
    }
  }, [selectedVariation, mainImage]);

  // Handle click on thumbnail
  const handleThumbnailClick = (imageUrl: string) => {
    setActiveImageUrl(imageUrl);
  };

  // Determine the main image to display
  const currentMainImage = activeImageUrl || displayImages[0]?.url || null;

  return (
    <div className='w-full md:w-1/2 space-y-3 md:space-y-4'>
      {/* Main Product Image */}
      <div className='relative pt-6 md:pt-10 aspect-square overflow-hidden bg-gray-50 border border-gray-100 rounded-md'>
        {currentMainImage ? (
          <Image
            src={currentMainImage}
            alt={productName}
            fill
            className='object-contain'
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
            <span className='text-gray-400 text-sm'>No image</span>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery - Only show if we have additional unique images */}
      {displayImages.length > 1 && (
        <div className='grid grid-cols-5 sm:grid-cols-4 gap-1 sm:gap-2'>
          {displayImages.slice(0, 5).map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden border rounded-md cursor-pointer ${
                image.url === currentMainImage
                  ? "border-[#8a7d65] ring-1 ring-[#8a7d65]"
                  : "border-gray-200 hover:border-[#8a7d65]"
              }`}
              onClick={() => handleThumbnailClick(image.url)}>
              <Image
                src={image.url}
                alt={image.alt || `${productName} - view ${index + 1}`}
                fill
                className='object-contain p-1'
                sizes='(max-width: 640px) 20vw, 12.5vw'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
