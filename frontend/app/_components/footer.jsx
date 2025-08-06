"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer
      className={`bg-gray-900 text-white ${pathname === "/" ? "mt-64" : ""}`}
    >
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
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#65a30d] transition-colors"
              >
                <span className="text-sm">📘</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#65a30d] transition-colors"
              >
                <span className="text-sm">🐦</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#65a30d] transition-colors"
              >
                <span className="text-sm">📷</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#65a30d] transition-colors"
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
                <span className="text-gray-300 text-sm cursor-default">
                  About Us
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Contact
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Careers
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Blog
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Press
                </span>
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
                <span className="text-gray-300 text-sm cursor-default">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Shipping Info
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Returns & Exchanges
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Size Guide
                </span>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Track Your Order
                </span>
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
              © 2025 ShopHub. All rights reserved. |
              <span className="ml-1 cursor-default">Privacy Policy</span> |
              <span className="ml-1 cursor-default">Terms of Service</span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400 mr-2">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-12 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-semibold">
                  CASH
                </div>
                <div className="w-14 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-semibold">
                  OFFLINE
                </div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-semibold">
                  VISA
                </div>
                <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-semibold">
                  MC
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
