'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'

// Define the Category and Subcategory types
type Subcategory = {
  id: string
  name: string
  slug: string
}

type Category = {
  id: string
  name: string
  slug: string
  subcategories: Subcategory[]
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { itemCount } = useCart()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch categories from Payload CMS built-in API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)

        // First fetch categories
        const categoriesResponse = await fetch('/api/categories')

        if (!categoriesResponse.ok) {
          console.error('Failed to fetch categories:', categoriesResponse.status)
          throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`)
        }

        const categoriesData = await categoriesResponse.json()

        // Now fetch subcategories
        const subcategoriesResponse = await fetch('/api/subcategories')

        if (!subcategoriesResponse.ok) {
          console.error('Failed to fetch subcategories:', subcategoriesResponse.status)
          throw new Error(`Failed to fetch subcategories: ${subcategoriesResponse.status}`)
        }

        const subcategoriesData = await subcategoriesResponse.json()

        // Create a map of categories by ID for quick lookup
        const categoriesMap = {}
        categoriesData.docs.forEach((cat) => {
          categoriesMap[cat.id] = {
            ...cat,
            subcategories: [], // Initialize empty subcategories array
          }
        })

        // Organize subcategories by their parent category
        // In the SubCategories collection, each subcategory has a 'category' field
        // referencing its parent category
        subcategoriesData.docs.forEach((subcat) => {
          // Get the category ID from the subcategory
          const categoryId =
            typeof subcat.category === 'object' ? subcat.category.id : subcat.category

          // If the category exists in our map, add this subcategory to its array
          if (categoryId && categoriesMap[categoryId]) {
            categoriesMap[categoryId].subcategories.push({
              id: subcat.id,
              name: subcat.name,
              slug: subcat.slug,
            })
          }
        })

        // Convert the map back to an array
        const processedCategories = Object.values(categoriesMap)
        setCategories(processedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)

        // Mock data if there's an error
        setCategories([
          {
            id: 'mock1',
            name: 'Abaya',
            slug: 'abaya',
            subcategories: [
              { id: 'sub1', name: 'Classic', slug: 'classic' },
              { id: 'sub2', name: 'Modern', slug: 'modern' },
            ],
          },
          {
            id: 'mock2',
            name: 'Qamis',
            slug: 'qamis',
            subcategories: [
              { id: 'sub3', name: 'Traditional', slug: 'traditional' },
              { id: 'sub4', name: 'Contemporary', slug: 'contemporary' },
            ],
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(name)
    }
  }

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300
      ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}
    >
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center border-b border-[#e6ded0]/60 py-2 text-xs text-[#8a7d65]">
          <div className="flex items-center space-x-6 font-montserrat uppercase tracking-wider">
            <span>Free shipping on orders over $200</span>
            <span>24/7 Customer Service</span>
          </div>
          <div className="flex items-center space-x-4 font-montserrat">
            <Link href="/about" className="hover:text-[#382f21] transition-colors">
              About Us
            </Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-[#382f21] transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <div className="flex items-center">
              <span className="font-cinzel text-xl md:text-2xl font-bold text-[#382f21]">
                QuickShop
              </span>
              <div className="ml-2 h-5 w-5 flex items-center justify-center">
                <div className="h-2 w-2 bg-[#d4af37] rounded-full animate-pulse"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem href="/" label="Home" />

            {isLoading ? (
              // Loading placeholder
              <div className="w-20 h-8 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              // Render categories
              categories.map((category) => (
                <div key={category.id} className="relative group">
                  <button
                    className="flex items-center px-3 py-2 font-montserrat text-sm text-[#382f21] hover:text-[#d4af37] transition-colors"
                    onClick={() => toggleDropdown(category.slug)}
                  >
                    <span>{category.name}</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>

                  <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-4">
                      <Link
                        href={`/collections/${category.slug}`}
                        className="block py-2 text-sm font-montserrat text-[#382f21] hover:text-[#d4af37] transition-colors"
                      >
                        All {category.name}
                      </Link>

                      {category.subcategories && category.subcategories.length > 0 ? (
                        category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/collections/${category.slug}/${subcategory.slug}`}
                            className="block py-2 text-sm font-montserrat text-[#382f21] hover:text-[#d4af37] transition-colors"
                          >
                            {subcategory.name}
                          </Link>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400 py-2">No subcategories</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            <NavItem href="/collections/new-arrivals" label="New Arrivals" />
            <NavItem href="/collections/sale" label="Sale" />
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-[#382f21] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#f5f2ec]"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-lg rounded-sm p-3 border border-[#e6ded0]">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full p-2 bg-[#f9f6f2] border-none focus:ring-1 focus:ring-[#d4af37] font-montserrat text-sm rounded-sm"
                    />
                    <button className="ml-2 p-2 bg-[#382f21] text-white rounded-sm hover:bg-[#d4af37] transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <IconButton
              href="/wishlist"
              icon={<Heart className="w-5 h-5 stroke-[1.5]" />}
              label="Wishlist"
            />

            {/* User Account */}
            <IconButton
              href="/account"
              icon={<User className="w-5 h-5 stroke-[1.5]" />}
              label="Account"
            />

            {/* Shopping Bag */}
            <IconButton
              href="/cart"
              icon={<ShoppingBag className="w-5 h-5 stroke-[1.5]" />}
              label="Cart"
              badge={itemCount > 0 ? itemCount : undefined}
            />

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 md:hidden text-[#382f21] hover:text-[#d4af37] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto pt-4 pb-6 px-6">
          <div className="flex flex-col space-y-4">
            <div className="border-b border-[#e6ded0] pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-3 bg-[#f9f6f2] border-none focus:ring-1 focus:ring-[#d4af37] font-montserrat text-sm rounded-sm"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-[#382f21] text-white rounded-sm hover:bg-[#d4af37] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Link
              href="/"
              className="py-3 font-montserrat text-[#382f21] hover:text-[#d4af37] border-b border-[#e6ded0] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isLoading ? (
              <div className="py-3 w-full h-10 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="border-b border-[#e6ded0]">
                  <button
                    className="flex items-center justify-between w-full py-3 font-montserrat text-[#382f21]"
                    onClick={() => toggleDropdown(`mobile-${category.slug}`)}
                  >
                    <span>{category.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        activeDropdown === `mobile-${category.slug}` ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === `mobile-${category.slug}` && (
                    <div className="pl-4 pb-2">
                      <Link
                        href={`/collections/${category.slug}`}
                        className="block py-2 font-montserrat text-sm text-[#8a7d65] hover:text-[#d4af37] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        All {category.name}
                      </Link>

                      {category.subcategories && category.subcategories.length > 0 ? (
                        category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/collections/${category.slug}/${subcategory.slug}`}
                            className="block py-2 font-montserrat text-sm text-[#8a7d65] hover:text-[#d4af37] transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subcategory.name}
                          </Link>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400 py-2">No subcategories</div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            <Link
              href="/collections/new-arrivals"
              className="py-3 font-montserrat text-[#382f21] hover:text-[#d4af37] border-b border-[#e6ded0] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              New Arrivals
            </Link>

            <Link
              href="/collections/sale"
              className="py-3 font-montserrat text-[#382f21] hover:text-[#d4af37] border-b border-[#e6ded0] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sale
            </Link>

            <div className="flex flex-col space-y-2 pt-4">
              <Link
                href="/wishlist"
                className="flex items-center py-2 font-montserrat text-[#382f21] hover:text-[#d4af37] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5 mr-3 stroke-[1.5]" />
                <span>Wishlist</span>
              </Link>

              <Link
                href="/account"
                className="flex items-center py-2 font-montserrat text-[#382f21] hover:text-[#d4af37] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-3 stroke-[1.5]" />
                <span>My Account</span>
              </Link>

              <Link
                href="/cart"
                className="flex items-center py-2 font-montserrat text-[#382f21] hover:text-[#d4af37] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-5 h-5 mr-3 stroke-[1.5]" />
                <span>Shopping Bag {itemCount > 0 ? `(${itemCount})` : ''}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// NavItem component for consistent styling
function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 font-montserrat text-sm text-[#382f21] hover:text-[#d4af37] transition-colors"
    >
      {label}
    </Link>
  )
}

// IconButton component with optional badge
function IconButton({
  href,
  icon,
  label,
  badge,
}: {
  href: string
  icon: React.ReactNode
  label: string
  badge?: number
}) {
  return (
    <Link
      href={href}
      className="p-2 text-[#382f21] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#f5f2ec] relative"
      aria-label={label}
    >
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-[#d4af37] text-white rounded-full text-[10px] font-bold">
          {badge}
        </span>
      )}
    </Link>
  )
}
