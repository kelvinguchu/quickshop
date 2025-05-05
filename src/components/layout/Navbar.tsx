"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlistStore } from "@/lib/wishlist/wishlistStore";
import { WishlistSheet } from "@/components/wishlist/WishlistSheet";
import { CartSheet } from "@/components/cart/CartSheet";
import MobileNav from "./MobileNav";

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

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { itemCount } = useCart();
  const wishlistCount = useWishlistStore((state) => state.itemCount);

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

        // Create a map of categories by ID for quick lookup
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

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className='md:hidden'>
        <MobileNav />
      </div>

      {/* Desktop Navigation */}
      <header
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 border-b border-[#e6ded0]/60 hidden md:block
        ${isScrolled ? "bg-white shadow-md" : "bg-white"}`}>
        <div className='w-full'>
          {/* Top Bar */}
          <div className='flex justify-between items-center border-b border-[#e6ded0]/60 py-2 text-xs bg-[#382f21] px-4 text-white'>
            <div className='flex items-center space-x-4 font-montserrat'>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-[#d4af37] transition-colors'>
                <Instagram className='h-4 w-4' />
              </a>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-[#d4af37] transition-colors'>
                <Facebook className='h-4 w-4' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-[#d4af37] transition-colors'>
                <Twitter className='h-4 w-4' />
              </a>
            </div>
            <div className='flex items-center space-x-4 font-montserrat'>
              <span>Call: +254 700 123 456</span>
              <span>|</span>
              <span>Email: info@quickshop.co.ke</span>
            </div>
          </div>

          {/* Main Navbar */}
          <div className='flex items-center justify-between px-4 py-3'>
            {/* Logo */}
            <Link href='/' className='relative z-10'>
              <div className='flex items-center'>
                <span className='font-cinzel text-2xl font-bold text-[#382f21]'>
                  QuickShop
                </span>
                <div className='ml-2 h-5 w-5 flex items-center justify-center'>
                  <div className='h-2 w-2 bg-[#d4af37] rounded-full animate-pulse'></div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className='flex items-center space-x-1'>
              <NavItem href='/' label='Home' />

              {isLoading ? (
                // Loading placeholder
                <div className='w-20 h-8 bg-gray-100 animate-pulse rounded'></div>
              ) : (
                // Render categories
                categories.map((category) => (
                  <div key={category.id} className='relative group'>
                    <button
                      className='flex items-center px-3 py-2 font-montserrat text-sm text-[#382f21] hover:text-[#d4af37] transition-colors'
                      onClick={() => toggleDropdown(category.slug)}>
                      <span>{category.name}</span>
                      <ChevronDown className='ml-1 h-4 w-4' />
                    </button>

                    <div className='absolute left-0 top-full w-48 bg-white shadow-lg rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
                      <div className='p-4'>
                        <Link
                          href={`/collections/${category.slug}`}
                          className='block py-2 text-sm font-montserrat text-[#382f21] hover:text-[#d4af37] transition-colors'>
                          All {category.name}
                        </Link>

                        {category.subcategories &&
                        category.subcategories.length > 0 ? (
                          category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              href={`/collections/${category.slug}/${subcategory.slug}`}
                              className='block py-2 text-sm font-montserrat text-[#382f21] hover:text-[#d4af37] transition-colors'>
                              {subcategory.name}
                            </Link>
                          ))
                        ) : (
                          <div className='text-sm text-gray-400 py-2'>
                            No subcategories
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              <NavItem href='/collections' label='New Arrivals' />
              <NavItem href='/collections' label='Sale' />
            </nav>

            {/* Desktop Icons */}
            <div className='flex items-center space-x-2'>
              {/* Search */}
              <div className='relative'>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className='p-2 text-[#382f21] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#f5f2ec]'
                  aria-label='Search'>
                  <Search className='w-5 h-5 stroke-[1.5]' />
                </button>

                {isSearchOpen && (
                  <div className='absolute right-0 top-full mt-2 w-72 bg-white shadow-lg rounded-sm p-3 border border-[#e6ded0]'>
                    <div className='flex items-center'>
                      <input
                        type='text'
                        placeholder='Search products...'
                        className='w-full p-2 bg-[#f9f6f2] border-none focus:ring-1 focus:ring-[#d4af37] font-montserrat text-sm rounded-sm'
                      />
                      <button className='ml-2 p-2 bg-[#382f21] text-white rounded-sm hover:bg-[#d4af37] transition-colors'>
                        <Search className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <WishlistSheet>
                <button
                  className='p-2 text-[#382f21] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#f5f2ec] relative'
                  aria-label='Wishlist'>
                  <Heart className='w-5 h-5 stroke-[1.5]' />
                  {wishlistCount > 0 && (
                    <span className='absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-[#d4af37] text-white rounded-full text-[10px] font-bold'>
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </WishlistSheet>

              {/* User Account */}
              <IconButton
                href='/'
                icon={<User className='w-5 h-5 stroke-[1.5]' />}
                label='Account'
              />

              {/* Shopping Bag */}
              <CartSheet>
                <button
                  className='p-2 text-[#382f21] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#f5f2ec] relative'
                  aria-label='Shopping Cart'>
                  <ShoppingBag className='w-5 h-5 stroke-[1.5]' />
                  {itemCount > 0 && (
                    <span className='absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-[#d4af37] text-white rounded-full text-[10px] font-bold'>
                      {itemCount}
                    </span>
                  )}
                </button>
              </CartSheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// NavItem component for consistent styling
function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className='px-3 py-2 font-montserrat text-sm text-[#382f21] hover:text-[#d4af37] transition-colors'>
      {label}
    </Link>
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
