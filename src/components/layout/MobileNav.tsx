"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, Home, Grid } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlistStore } from "@/lib/wishlist/wishlistStore";
import { WishlistSheet } from "@/components/wishlist/WishlistSheet";
import { CartSheet } from "@/components/cart/CartSheet";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";

// Import Payload types
import type {
  Category as PayloadCategory,
  Subcategory as PayloadSubcategory,
} from "@/payload-types";

// Simplified local types for UI
type SubcategoryUI = {
  id: string;
  name: string;
  slug: string;
};

type CategoryUI = {
  id: string;
  name: string;
  slug: string;
  subcategories: SubcategoryUI[];
};

export default function MobileNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { itemCount } = useCart();
  const wishlistCount = useWishlistStore((state) => state.itemCount);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories from Payload CMS built-in API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);

        // First fetch categories
        const categoriesResponse = await fetch("/api/categories");

        if (!categoriesResponse.ok) {
          console.error(
            "Failed to fetch categories:",
            categoriesResponse.status
          );
          throw new Error(
            `Failed to fetch categories: ${categoriesResponse.status}`
          );
        }

        const categoriesData = await categoriesResponse.json();

        // Now fetch subcategories
        const subcategoriesResponse = await fetch("/api/subcategories");

        if (!subcategoriesResponse.ok) {
          console.error(
            "Failed to fetch subcategories:",
            subcategoriesResponse.status
          );
          throw new Error(
            `Failed to fetch subcategories: ${subcategoriesResponse.status}`
          );
        }

        const subcategoriesData = await subcategoriesResponse.json();

        const categoriesMap: Record<string, CategoryUI> = {};
        (categoriesData.docs as PayloadCategory[]).forEach((cat) => {
          categoriesMap[cat.id] = {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            subcategories: [], // Initialize empty subcategories array
          };
        });

        // Organize subcategories
        (subcategoriesData.docs as PayloadSubcategory[]).forEach((subcat) => {
          const categoryId =
            typeof subcat.category === "object"
              ? subcat.category?.id
              : subcat.category;
          if (categoryId && categoriesMap[categoryId]) {
            categoriesMap[categoryId].subcategories.push({
              id: subcat.id,
              name: subcat.name,
              slug: subcat.slug,
            });
          }
        });

        setCategories(Object.values(categoriesMap));
      } catch (error) {
        console.error("Error fetching categories:", error);

        // Mock data if there's an error
        setCategories([
          {
            id: "mock1",
            name: "Abaya",
            slug: "abaya",
            subcategories: [
              { id: "sub1", name: "Classic", slug: "classic" },
              { id: "sub2", name: "Modern", slug: "modern" },
            ],
          },
          {
            id: "mock2",
            name: "Qamis",
            slug: "qamis",
            subcategories: [
              { id: "sub3", name: "Traditional", slug: "traditional" },
              { id: "sub4", name: "Contemporary", slug: "contemporary" },
            ],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to handle search UI
  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 border-b border-[#e6ded0]/60 md:hidden
        ${isScrolled ? "bg-white shadow-md" : "bg-white"}`}>
        <div className='max-w-[100%] mx-auto px-3'>
          {/* Main Navbar */}
          <div className='flex items-center justify-between h-12'>
            {/* Logo */}
            <Link href='/' className='relative z-10'>
              <div className='flex items-center'>
                <span className='font-cinzel text-xl font-bold text-[#382f21] truncate'>
                  QuickShop
                </span>
                <div className='ml-1 h-4 w-4 flex items-center justify-center'>
                  <div className='h-2 w-2 bg-[#d4af37] rounded-full animate-pulse'></div>
                </div>
              </div>
            </Link>

            {/* Mobile Account Icon */}
            <div>
              <IconButton
                href='/'
                icon={<User className='w-6 h-6 stroke-[1.5]' />}
                label='Account'
              />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (appears fixed at the top when search is opened) */}
        {isSearchOpen && (
          <div className='fixed left-0 top-12 w-full bg-white z-50 p-3 shadow-md border-t border-[#e6ded0]/60'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search products...'
                className='w-full p-2.5 bg-[#f9f6f2] border-none focus:ring-1 focus:ring-[#d4af37] font-montserrat text-sm rounded-sm'
              />
              <button className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-[#382f21] text-white rounded-sm hover:bg-[#d4af37] transition-colors'>
                <Search className='w-4 h-4' />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Dock - App Style */}
      <div className='md:hidden fixed bottom-0 left-0 w-full bg-white z-50 border-t border-[#e6ded0]/60 shadow-lg'>
        <div className='flex justify-around items-center px-2 py-1'>
          {/* Home */}
          <Link
            href='/'
            className='flex flex-col items-center font-montserrat p-1.5 text-[#382f21] hover:text-[#d4af37] transition-colors'>
            <Home className='w-6 h-6 stroke-[1.5]' />
            <span className='text-xs mt-0.5'>Home</span>
          </Link>

          {/* Search */}
          <button
            onClick={handleSearchClick}
            className='flex flex-col items-center font-montserrat p-1.5 text-[#382f21] hover:text-[#d4af37] transition-colors'
            aria-label='Search'>
            <Search className='w-6 h-6 stroke-[1.5]' />
            <span className='text-xs mt-0.5'>Search</span>
          </button>

          {/* Categories - Using Drawer */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button
                className='flex flex-col items-center font-montserrat p-1.5 text-[#382f21] hover:text-[#d4af37] transition-colors'
                aria-label='Categories'>
                <Grid className='w-6 h-6 stroke-[1.5]' />
                <span className='text-xs mt-0.5'>Categories</span>
              </button>
            </DrawerTrigger>
            <DrawerContent className='bg-white p-4 pt-0 rounded-t-xl max-h-[80vh] overflow-hidden'>
              <DrawerTitle className='font-cinzel text-lg text-[#382f21] pt-6 px-1'>
                Categories
              </DrawerTitle>
              <div className='mt-4 font-montserrat max-h-[calc(80vh-60px)] overflow-y-auto pb-6'>
                <div className='space-y-4'>
                  {/* Special Categories presented in the same format as other categories */}
                  <div className='border-b border-[#e0d8c9] pb-4'>
                    <Link
                      href='/collections'
                      className='flex items-center justify-between mb-2 text-[#382f21] font-medium hover:text-[#d4af37] transition-colors'
                      onClick={() => setDrawerOpen(false)}>
                      <span>New Arrivals</span>
                    </Link>
                    {/* No subcategories */}
                  </div>

                  <div className='border-b border-[#e0d8c9] pb-4'>
                    <Link
                      href='/collections'
                      className='flex items-center justify-between mb-2 text-[#382f21] font-medium hover:text-[#d4af37] transition-colors'
                      onClick={() => setDrawerOpen(false)}>
                      <span>Sale</span>
                    </Link>
                    {/* No subcategories */}
                  </div>

                  {/* Product Categories */}
                  {isLoading ? (
                    <div className='space-y-2'>
                      <div className='h-12 bg-gray-100 animate-pulse rounded-sm'></div>
                      <div className='h-12 bg-gray-100 animate-pulse rounded-sm'></div>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className='border-b border-[#e0d8c9] pb-4'>
                        <Link
                          href={`/collections/${category.slug}`}
                          className='flex items-center justify-between mb-2 text-[#382f21] font-medium hover:text-[#d4af37] transition-colors'
                          onClick={() => setDrawerOpen(false)}>
                          <span>{category.name}</span>
                        </Link>

                        {category.subcategories &&
                          category.subcategories.length > 0 && (
                            <div className='pl-4 space-y-2'>
                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  href={`/collections/${category.slug}/${subcategory.slug}`}
                                  className='block py-1 text-sm text-[#8a7d65] hover:text-[#d4af37] transition-colors'
                                  onClick={() => setDrawerOpen(false)}>
                                  {subcategory.name}
                                </Link>
                              ))}
                            </div>
                          )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Wishlist */}
          <WishlistSheet>
            <button
              className='flex flex-col items-center p-1.5 font-montserrat text-[#382f21] hover:text-[#d4af37] transition-colors relative'
              aria-label='Wishlist'>
              <Heart className='w-6 h-6 stroke-[1.5]' />
              {wishlistCount > 0 && (
                <span className='absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-[#d4af37] text-white rounded-full text-[10px] font-bold'>
                  {wishlistCount}
                </span>
              )}
              <span className='text-xs mt-0.5'>Wishlist</span>
            </button>
          </WishlistSheet>

          {/* Cart */}
          <CartSheet>
            <button
              className='flex flex-col items-center font-montserrat p-1.5 text-[#382f21] hover:text-[#d4af37] transition-colors relative'
              aria-label='Cart'>
              <ShoppingBag className='w-6 h-6 stroke-[1.5]' />
              {itemCount > 0 && (
                <span className='absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-[#d4af37] text-white rounded-full text-[10px] font-bold'>
                  {itemCount}
                </span>
              )}
              <span className='text-xs mt-0.5'>Cart</span>
            </button>
          </CartSheet>
        </div>
      </div>

      {/* Adjusted padding height slightly for larger icons */}
      <div className='md:hidden h-[52px]'></div>
    </>
  );
}

// IconButton component with optional badge
function IconButton({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className='p-2 text-[#382f21] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#f5f2ec] relative'
      aria-label={label}>
      {icon}
      {badge && (
        <span className='absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-[#d4af37] text-white rounded-full text-[10px] font-bold'>
          {badge}
        </span>
      )}
    </Link>
  );
}
