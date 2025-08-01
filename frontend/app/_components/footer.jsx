import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#16a34a]">ShopHub</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted online marketplace for quality products at amazing
              prices. We're committed to providing exceptional customer service
              and fast shipping.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#65a30d]transition-colors"
              >
                <span className="text-sm">📘</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#65a30d]transition-colors"
              >
                <span className="text-sm">🐦</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#65a30d]transition-colors"
              >
                <span className="text-sm">📷</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#65a30d]transition-colors"
              >
                <span className="text-sm">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#16a34a]">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#16a34a]">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-gray-300 hover:text-[#16a34a] transition-colors text-sm"
                >
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#16a34a]">
              Stay Updated
            </h3>
            <p className="text-gray-300 text-sm">
              Subscribe to get special offers, free giveaways, and exclusive
              deals.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 ShopHub. All rights reserved. |
              <Link
                href="/privacy"
                className="hover:text-[#16a34a] transition-colors ml-1"
              >
                Privacy Policy
              </Link>{" "}
              |
              <Link
                href="/terms"
                className="hover:text-[#16a34a] transition-colors ml-1"
              >
                Terms of Service
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400 mr-2">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-semibold">
                  VISA
                </div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-semibold">
                  MC
                </div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-semibold">
                  AMEX
                </div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-semibold">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
