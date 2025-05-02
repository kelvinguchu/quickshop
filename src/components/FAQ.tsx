'use client'

import { useState } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  faqs: FAQItem[]
}

export default function FAQ({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-[#e6ded0] last:border-b-0">
          <button
            className="flex w-full items-center justify-between py-4 text-left font-cinzel text-[#382f21] hover:text-[#8a7d65] transition-colors"
            onClick={() => toggleQuestion(index)}
            aria-expanded={openIndex === index}
          >
            <h3 className="text-lg font-medium">{faq.question}</h3>
            <span className="ml-4 flex-shrink-0">
              {openIndex === index ? (
                <FaMinus className="h-4 w-4" />
              ) : (
                <FaPlus className="h-4 w-4" />
              )}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pb-6 font-montserrat text-[#5c5243] leading-relaxed">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
