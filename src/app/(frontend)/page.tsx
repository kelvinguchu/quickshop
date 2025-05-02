import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import Hero from '@/components/Hero'
import SectionTitle from '@/components/SectionTitle'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import TestimonialCard from '@/components/TestimonialCard'
import FAQ from '@/components/FAQ'

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

// Static data for abayas when CMS data is not available
const staticAbayas = [
  {
    id: 'abaya1',
    name: 'Elegant Black Abaya',
    price: 129.99,
    staticImage: '/abayas/abaya1.webp',
  },
  {
    id: 'abaya2',
    name: 'Royal Gold Trim Abaya',
    price: 149.99,
    staticImage: '/abayas/abaya2.webp',
  },
  {
    id: 'abaya3',
    name: 'Classic Embroidered Abaya',
    price: 139.99,
    staticImage: '/abayas/abaya3.webp',
  },
  {
    id: 'abaya4',
    name: 'Modern Cut Abaya',
    price: 159.99,
    staticImage: '/abayas/abaya4.webp',
  },
]

// Static data for qamis when CMS data is not available
const staticQamis = [
  {
    id: 'qamis1',
    name: 'Classic White Qamis',
    price: 99.99,
    staticImage: '/qamis/qamis1.webp',
  },
  {
    id: 'qamis2',
    name: 'Premium Embroidered Qamis',
    price: 119.99,
    staticImage: '/qamis/qamis2.webp',
  },
  {
    id: 'qamis3',
    name: 'Modern Cut Qamis',
    price: 109.99,
    staticImage: '/qamis/qamis3.webp',
  },
  {
    id: 'qamis4',
    name: 'Royal Blue Qamis',
    price: 129.99,
    staticImage: '/qamis/qamis4.webp',
  },
]

// Static data for categories when CMS data is not available
const staticCategories = [
  {
    id: 'abaya',
    name: 'Abayas',
    slug: 'abaya',
    staticImage: '/abayas/abaya5.webp',
  },
  {
    id: 'qamis',
    name: 'Qamis',
    slug: 'qamis',
    staticImage: '/qamis/qamis5.webp',
  },
  {
    id: 'hijabs',
    name: 'Hijabs',
    parentCategory: 'abaya',
    slug: 'hijabs',
    staticImage: '/abayas/abaya6.webp',
  },
]

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
    // Fetch trending Abayas
    trendingAbayas = await payload.find({
      collection: 'products',
      where: {
        AND: [
          {
            category: {
              equals: 'abaya',
            },
          },
          {
            trending: {
              equals: true,
            },
          },
        ],
      },
      limit: 4,
    })
  } catch (error) {
    console.error('Error fetching abayas:', error)
  }

  try {
    // Fetch trending Qamis
    trendingQamis = await payload.find({
      collection: 'products',
      where: {
        AND: [
          {
            category: {
              equals: 'qamis',
            },
          },
          {
            trending: {
              equals: true,
            },
          },
        ],
      },
      limit: 4,
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

  // Use static data if CMS data is not available
  const categoriesToDisplay =
    featuredCategories.docs.length > 0 ? featuredCategories.docs : staticCategories

  const abayasToDisplay = trendingAbayas.docs.length > 0 ? trendingAbayas.docs : staticAbayas

  const qamisToDisplay = trendingQamis.docs.length > 0 ? trendingQamis.docs : staticQamis

  // Static testimonials if CMS data is not available
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {abayasToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Unique Selling Proposition */}
      <section className="py-16 bg-[#f5f2ec]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#382f21] flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qamisToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
