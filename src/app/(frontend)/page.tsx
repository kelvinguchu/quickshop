import React from 'react'
import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'
import { FaArrowRight, FaSearch, FaMagic, FaShippingFast } from 'react-icons/fa'

import config from '@/payload.config'
import Hero from '@/components/home/Hero'
import SectionTitle from '@/components/home/SectionTitle'
import ProductCard from '@/components/home/ProductCard'
import CategoryCard from '@/components/home/CategoryCard'
import TestimonialCard from '@/components/home/TestimonialCard'
import FAQ from '@/components/home/FAQ'

// Static data for FAQs
const faqData = [
  {
    question: 'How do I provide custom measurements?',
    answer:
      "During checkout, you'll have the option to provide custom measurements for your selected items. Simply select 'Custom Measurements' and fill in the required measurements in centimeters.",
  },
  {
    question: 'What is your return policy?',
    answer:
      "We accept returns within 14 days of delivery for unworn items in their original packaging. Custom measured items cannot be returned unless there's a significant manufacturing defect.",
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for 2-3 business day delivery.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days depending on the destination.',
  },
  {
    question: 'How do I care for my garments?',
    answer:
      'We recommend dry cleaning for most of our items to maintain their quality and appearance. Specific care instructions are included with each garment.',
  },
]

// Static testimonials as fallback
const staticTestimonials = [
  {
    id: 'testimonial1',
    customerName: 'Aisha Rahman',
    text: 'I am absolutely in love with my new abaya! The quality of the fabric is exceptional and the attention to detail in the embroidery is stunning.',
    rating: 5,
  },
  {
    id: 'testimonial2',
    customerName: 'Yusuf Ali',
    text: "The custom measurements option was perfect for me. My qamis fits beautifully and the quality is far superior to anything I've purchased before.",
    rating: 5,
  },
  {
    id: 'testimonial3',
    customerName: 'Fatima Zahra',
    text: "Quick delivery and the product was exactly as pictured. I've already received many compliments on my new abaya!",
    rating: 4,
  },
  {
    id: 'testimonial4',
    customerName: 'Ahmed Hassan',
    text: 'Excellent customer service! They helped me choose the right size and the qamis arrived perfectly tailored.',
    rating: 5,
  },
]

// Fallback component when no products are available
const EmptyProductsSection = ({ collectionType, collectionName }) => (
  <div className="bg-gray-50 rounded-lg py-10 px-6 text-center">
    <div className="mb-6 relative h-[200px] w-[200px] mx-auto">
      <Image
        src={`/${collectionType}/${collectionType}1.webp`}
        alt={`${collectionName} Image`}
        fill
        sizes="200px"
        className="rounded-lg object-cover"
      />
    </div>
    <h3 className="font-cinzel text-xl font-semibold text-[#382f21] mb-3">
      No Trending {collectionName} Available
    </h3>
    <p className="text-gray-600 mb-6">
      We're currently updating our collection. Please check back soon or explore our complete
      catalog.
    </p>
    <Link
      href={`/collections/${collectionType}`}
      className="inline-flex items-center px-5 py-2.5 bg-[#382f21] text-white font-montserrat text-sm rounded hover:bg-[#4e4538] transition-colors"
    >
      Browse All {collectionName} <FaArrowRight className="ml-2 w-3 h-3" />
    </Link>
  </div>
)

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Initialize with empty data in case of errors
  let featuredCategories = { docs: [] }
  let trendingAbayas = { docs: [] }
  let trendingQamis = { docs: [] }
  let testimonials = { docs: [] }

  try {
    // Fetch featured categories
    featuredCategories = await payload.find({
      collection: 'categories',
      where: {
        featured: {
          equals: true,
        },
      },
      sort: 'displayOrder',
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
  }

  try {
    // Fetch trending Abayas - properly using the relationship query
    trendingAbayas = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            'category.slug': {
              equals: 'abaya',
            },
          },
          {
            trending: {
              equals: true,
            },
          },
          {
            status: {
              equals: 'active',
            },
          },
        ],
      },
      limit: 4,
      depth: 1,
    })
  } catch (error) {
    console.error('Error fetching abayas:', error)
  }

  try {
    // Fetch trending Qamis - properly using the relationship query
    trendingQamis = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            'category.slug': {
              equals: 'qamis',
            },
          },
          {
            trending: {
              equals: true,
            },
          },
          {
            status: {
              equals: 'active',
            },
          },
        ],
      },
      limit: 4,
      depth: 1,
    })
  } catch (error) {
    console.error('Error fetching qamis:', error)
  }

  try {
    // Fetch featured testimonials
    testimonials = await payload.find({
      collection: 'testimonials',
      where: {
        AND: [
          {
            featured: {
              equals: true,
            },
          },
          {
            active: {
              equals: true,
            },
          },
        ],
      },
      limit: 4,
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
  }

  // Add custom category directly to the display list, no static fallbacks
  const customCategory = {
    id: 'custom',
    name: 'Custom Made',
    slug: 'custom',
    staticImage: '/abayas/abaya1.webp',
    isCustom: true,
  }

  const categoriesToDisplay = [...featuredCategories.docs, customCategory]

  // Use CMS data directly without static fallbacks for products
  const abayasToDisplay = trendingAbayas.docs
  const qamisToDisplay = trendingQamis.docs

  // Use static testimonials as fallback
  const testimonialsToDisplay =
    testimonials.docs.length > 0 ? testimonials.docs : staticTestimonials

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <section className="py-16 bg-[#f9f6f2]">
        <div className="container mx-auto px-4">
          <SectionTitle title="Shop by Category" subtitle="Explore our collections" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoriesToDisplay.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Abayas Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Trending Abayas"
            subtitle="Our most popular designs"
            ctaText="View All Abayas"
            ctaLink="/collections/abaya"
          />

          {abayasToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {abayasToDisplay.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProductsSection collectionType="abayas" collectionName="Abayas" />
          )}
        </div>
      </section>

      {/* Unique Selling Proposition */}
      <section className="py-16 bg-[#f5f2ec]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#382f21] flex items-center justify-center mb-4">
                <FaSearch className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold text-[#382f21] mb-2">
                Premium Quality
              </h3>
              <p className="font-montserrat text-[#5c5243]">
                Crafted with the finest materials for exceptional comfort and durability.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#382f21] flex items-center justify-center mb-4">
                <FaMagic className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold text-[#382f21] mb-2">
                Custom Tailoring
              </h3>
              <p className="font-montserrat text-[#5c5243]">
                Perfect fit guaranteed with our personalized measurement options.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#382f21] flex items-center justify-center mb-4">
                <FaShippingFast className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold text-[#382f21] mb-2">
                Worldwide Shipping
              </h3>
              <p className="font-montserrat text-[#5c5243]">
                Fast and reliable delivery to your doorstep, wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Qamis Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Trending Qamis"
            subtitle="Handcrafted with precision"
            ctaText="View All Qamis"
            ctaLink="/collections/qamis"
          />

          {qamisToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {qamisToDisplay.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProductsSection collectionType="qamis" collectionName="Qamis" />
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#f9f6f2]">
        <div className="container mx-auto px-4">
          <SectionTitle title="What Our Customers Say" subtitle="Testimonials" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonialsToDisplay.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#382f21] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-cinzel text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="font-cormorant text-xl mb-8 text-[#e6ded0]">
            Subscribe to receive updates on new collections, special offers, and styling tips.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 bg-white/10 border border-[#e6ded0]/30 placeholder-[#e6ded0]/70 text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#d4af37] text-[#382f21] font-montserrat text-sm uppercase tracking-wider hover:bg-[#e6ded0] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionTitle title="Frequently Asked Questions" subtitle="Need help?" />

          <FAQ faqs={faqData} />
        </div>
      </section>
    </div>
  )
}
