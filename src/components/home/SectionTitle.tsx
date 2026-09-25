import React from 'react'
import { FaLongArrowAltRight } from 'react-icons/fa'
import Link from 'next/link'

interface SectionTitleProps {
  title: string
  subtitle?: string
  alignment?: 'left' | 'center'
  ctaText?: string
  ctaLink?: string
  className?: string
}

export default function SectionTitle({
  title,
  subtitle,
  alignment = 'center',
  ctaText,
  ctaLink,
  className = '',
}: SectionTitleProps) {
  return (
    <div className={`mb-6 md:mb-8 ${alignment === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <div className="flex flex-col">
        {subtitle && (
          <span className="font-cormorant italic text-[#8a7d65] text-base md:text-lg mb-1 block">
            {subtitle}
          </span>
        )}

        {/* `!` overrides the unlayered h2 font-size rules in styles.css */}
        <h2 className="font-cinzel text-2xl! md:text-3xl! font-bold text-[#382f21] relative inline-block">
          {title}
          <span className="block h-0.5 w-12 bg-[#d4af37] mt-2 mx-auto"></span>
        </h2>

        {ctaText && ctaLink && (
          <div className="w-full flex justify-end mt-4">
            <Link
              href={ctaLink}
              className="inline-flex items-center font-montserrat text-sm uppercase tracking-wider text-[#8a7d65] hover:text-[#382f21] transition-colors"
            >
              {ctaText} <FaLongArrowAltRight className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
