"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../_store/authStore";
import { jwtDecode } from "jwt-decode";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import useCartStore from "../_store/useCartStore";
import useWishlistStore from "../_store/wishlist";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(null);
  const [isUser, setIsUser] = useState(null);
  const { role: stateRole, logout, name } = useAuthStore();

  const { wishlistItems } = useWishlistStore();
  const { cartItems } = useCartStore();

  // Get actual counts from stores
  const wishlistCount = wishlistItems?.length || 0;
  const cartCount = cartItems?.length || 0;

  const router = useRouter();
  const getRoleFromToken = () => {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) return null;

      const { token } = JSON.parse(authStorage)?.state || {};
      if (!token) return null;

      const decoded = jwtDecode(token);

      return decoded?.role || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const role = getRoleFromToken();
    const isUserAdmin = role === "admin" && stateRole === "admin";
    const checkUserRole = role === "user" && stateRole === "user";
    setIsAdmin(isUserAdmin);
    setIsUser(checkUserRole);
  }, [stateRole]);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/dashboard"
                className="text-2xl font-bold hover:text-[#65a30d] text-[#16a34a] me-10 transition-colors"
              >
                ShopHub
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-[#65a30d] font-medium transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-[#65a30d] font-medium transition-colors relative group"
              >
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-[#65a30d] font-medium transition-colors relative group"
              >
                brands
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-[#65a30d] font-medium transition-colors relative group"
              >
                products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] transition-all group-hover:w-full"></span>
              </Link>

              {isAdmin ? (
                <>
                  <Link
                    href="/users"
                    className="text-gray-700 hover:text-[#65a30d] font-medium transition-colors relative group"
                  >
                    users
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] transition-all group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/coupons"
                    className="text-gray-700 hover:text-[#65a30d] font-medium transition-colors relative group"
                  >
                    coupons
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] transition-all group-hover:w-full"></span>
                  </Link>
                </>
              ) : (
                ""
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue- [#16a34a] focus:border-transparent transition-all"
                  placeholder="Search products..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {isUser ? (
                <>
                  {/* Wishlist Button with Count */}
                  <button
                    className="p-2 text-gray-600 hover:text-[#65a30d] transition-colors relative"
                    onClick={() => router.push("/wishlist")}
                  >
                    <HeartIcon className="h-6 w-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* Cart Button with Count */}
                  <button
                    className="p-2 text-gray-600 hover:text-[#65a30d] transition-colors relative"
                    onClick={() => router.push("/carts")}
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#16a34a] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                ""
              )}
              {isAdmin || isUser ? (
                <button className="p-2 text-gray-600 hover:text-[#16a34a] transition-colors">
                  <UserIcon
                    className="h-6 w-6"
                    onClick={() => router.push("/settings")}
                  />
                </button>
              ) : (
                ""
              )}

              {name ? (
                <>
                  <div className="gap-2 flex">
                    <h2>{name}</h2>
                    <LogOut
                      onClick={() => {
                        logout();
                        router.push("/auth/signin");
                      }}
                    />
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/signup"
                  className="hidden sm:block bg-[#16a34a] text-white px-4 py-2 rounded-md font-medium hover:bg-[#65a30d] transition-colors"
                >
                  Sign Up
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-[#65a30d]  transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-700 hover:text-[#65a30d] font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/categories"
                  className="block px-3 py-2 text-gray-700 hover:text-[#65a30d] font-medium"
                >
                  Categories
                </Link>
                <Link
                  href="/deals"
                  className="block px-3 py-2 text-gray-700 hover:text-[#65a30d] font-medium"
                >
                  Brands
                </Link>
                <Link
                  href="/products"
                  className="block px-3 py-2 text-gray-700 hover:text-[#65a30d] font-medium"
                >
                  products
                </Link>
                {isAdmin ? (
                  <Link
                    href="/"
                    className="block px-3 py-2 text-gray-700 hover:text-[#65a30d] font-medium"
                  >
                    users
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
