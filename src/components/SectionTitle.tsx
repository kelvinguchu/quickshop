import React from 'react'
import { FaLongArrowAltRight } from 'react-icons/fa'

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
    <div className={`mb-12 ${alignment === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <div className="relative">
        {subtitle && (
          <span className="font-cormorant italic text-[#8a7d65] text-lg md:text-xl mb-2 block">
            {subtitle}
          </span>
        )}

        <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-[#382f21] relative inline-block">
          {title}
          <span className="block h-[3px] w-1/4 bg-[#d4af37] mt-2 mx-auto"></span>
        </h2>

        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            className="inline-flex items-center mt-4 font-montserrat text-sm uppercase tracking-wider text-[#8a7d65] hover:text-[#382f21] transition-colors"
          >
            {ctaText} <FaLongArrowAltRight className="ml-2" />
          </a>
        )}
      </div>
    </div>
  )
}
