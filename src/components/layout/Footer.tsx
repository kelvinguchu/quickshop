import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="hidden md:block bg-[#382f21] text-[#f9f6f2] pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="font-cinzel text-xl font-bold text-[#f9f6f2]">
              QuickShop
            </Link>
            <p className="font-montserrat text-sm text-[#e6ded0] mt-4">
              Premium clothing store featuring Qamis and Abaya collections with custom measurements.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-[#e6ded0] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#e6ded0] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#e6ded0] hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@quickshop.com"
                className="text-[#e6ded0] hover:text-white transition-colors"
                aria-label="Email"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-cinzel text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link href="/about" className="text-[#e6ded0] hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#e6ded0] hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#e6ded0] hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-cinzel text-lg font-semibold mb-4">Collections</h3>
            <ul className="space-y-2 font-montserrat text-sm">
              <li>
                <Link
                  href="/collections/abaya"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  Abayas
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/qamis"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  Qamis
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/abaya/hijabs"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  Hijabs
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/accessories"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/new-arrivals"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-cinzel text-lg font-semibold mb-4">Contact Us</h3>
            <address className="font-montserrat text-sm text-[#e6ded0] not-italic space-y-2">
              <p>123 Fashion Street</p>
              <p>Dubai, UAE</p>
              <p className="pt-2">
                <a
                  href="tel:+9715XXXXXXXX"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  +971 5XX XXX XXX
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@quickshop.com"
                  className="text-[#e6ded0] hover:text-white transition-colors"
                >
                  info@quickshop.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-[#4e4538] mt-8 pt-6">
          <p className="text-center text-sm font-montserrat text-[#e6ded0]">
            © {currentYear} QuickShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
