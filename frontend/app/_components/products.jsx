"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Star,
  Plus,
  Minus,
  Filter,
  X,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import useProductStore from "../_store/useProductStore";
import useAuthStore from "../_store/authStore";
import useWishlistStore from "../_store/wishlist";
import useCartStore from "../_store/useCartStore";

const ProductsList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading, error, fetchProducts, deleteProduct } =
    useProductStore();
  const { updateWishlist, fetchWishlist, wishlistItems, deleteFromWishlist } =
    useWishlistStore();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    fetchCart,
  } = useCartStore();
  const { role: stateRole } = useAuthStore();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [updatingCart, setUpdatingCart] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    brand: null,
    subcategory: null,
  });

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

  // Extract filters from URL params
  useEffect(() => {
    const brand = searchParams.get("brand");
    const subcategory = searchParams.get("subcategory");

    setActiveFilters({
      brand: brand || null,
      subcategory: subcategory || null,
    });
  }, [searchParams]);

  // Filter products based on active filters
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = products;

    // Filter by brand
    if (activeFilters.brand) {
      filtered = filtered.filter((product) => {
        const productBrand = product.brand?.name || product.brand;
        return productBrand
          ?.toLowerCase()
          .includes(activeFilters.brand.toLowerCase());
      });
    }

    // Filter by subcategory
    if (activeFilters.subcategory) {
      filtered = filtered.filter((product) => {
        const productSubcategory =
          product.subcategory?.name || product.subcategory;
        return productSubcategory
          ?.toLowerCase()
          .includes(activeFilters.subcategory.toLowerCase());
      });
    }

    setFilteredProducts(filtered);
  }, [products, activeFilters]);

  useEffect(() => {
    const role = getRoleFromToken();
    const isUserAdmin = role === "admin" && stateRole === "admin";
    const CheckIsUser = role === "user" && stateRole === "user";
    setIsAdmin(isUserAdmin);
    setIsUser(CheckIsUser);
    fetchProducts();
    if (CheckIsUser) {
      fetchWishlist();
      fetchCart();
    }
  }, [fetchProducts, fetchWishlist, fetchCart, stateRole]);

  const clearFilter = (filterType) => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterType);

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.push(newUrl);
  };

  const clearAllFilters = () => {
    router.push(window.location.pathname);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    const success = await deleteProduct(id);
    if (success) {
      fetchProducts();
    }
  };

  const toggleFavorite = async (productId, e) => {
    e.stopPropagation();
    const isCurrentlyFavorite = wishlistItems?.some(
      (item) => item._id === productId
    );
    if (isCurrentlyFavorite) {
      await deleteFromWishlist(productId);
    } else {
      await updateWishlist(productId);
    }
  };

  const addProductToCart = async (productId, e) => {
    e.stopPropagation();
    setUpdatingCart((prev) => ({ ...prev, [productId]: true }));

    try {
      const success = await addToCart(productId);
      if (success) {
        await fetchCart();
        console.log("Product added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setUpdatingCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  console.log(cartItems);

  const getCartItemDetails = (productId) => {
    if (!cartItems || !Array.isArray(cartItems)) return null;

    const cartItem = cartItems.find((item) => {
      if (typeof item.product === "object" && item.product?._id) {
        return item.product._id === productId;
      }
      if (typeof item.product === "string") {
        return item.product === productId;
      }
      return false;
    });

    return cartItem
      ? {
          cartItemId: cartItem._id,
          quantity: cartItem.quantity,
          price: cartItem.price,
        }
      : null;
  };

  const updateProductQuantity = async (cartItemId, quantity, e) => {
    e.stopPropagation();

    if (quantity < 0) return;

    setUpdatingCart((prev) => ({ ...prev, [cartItemId]: true }));

    try {
      if (quantity === 0) {
        const success = await removeFromCart(cartItemId);
        if (success) {
          await fetchCart();
          console.log("Product removed from cart successfully");
        }
      } else {
        const success = await updateCartItemQuantity(cartItemId, quantity);
        if (success) {
          await fetchCart();
          console.log(`Product quantity updated to ${quantity}`);
        }
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
    } finally {
      setUpdatingCart((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  // Increment quantity using cart item ID
  const incrementQuantity = async (cartItemId, currentQuantity, e) => {
    const newQuantity = currentQuantity + 1;
    await updateProductQuantity(cartItemId, newQuantity, e);
  };

  // Decrement quantity using cart item ID
  const decrementQuantity = async (cartItemId, currentQuantity, e) => {
    const newQuantity = Math.max(0, currentQuantity - 1);
    await updateProductQuantity(cartItemId, newQuantity, e);
  };

  const getCartItemQuantity = (productId) => {
    const cartItemDetails = getCartItemDetails(productId);
    return cartItemDetails ? cartItemDetails.quantity : 0;
  };

  const isProductInCart = (productId) => {
    return getCartItemQuantity(productId) > 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!discountPrice || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Use filtered products instead of all products
  const displayProducts = filteredProducts;

  if (loading && !products.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-[#16a34a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                Products
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
              Browse and manage all available products in your store (
              {displayProducts.length} of {products.length} products)
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => router.push("/products/addProduct")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Add New Product
            </button>
          )}
        </div>

        {/* Active Filters */}
        {(activeFilters.brand || activeFilters.subcategory) && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Active Filters:
                </span>

                {activeFilters.brand && (
                  <div className="flex items-center gap-1 bg-[#16a34a] text-white px-3 py-1 rounded-full text-sm">
                    <span>Brand</span>
                    <button
                      onClick={() => clearFilter("brand")}
                      className="ml-1 hover:bg-[#65a30d] rounded-full p-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {activeFilters.subcategory && (
                  <div className="flex items-center gap-1 bg-[#16a34a] text-white px-3 py-1 rounded-full text-sm">
                    <span> subCategory</span>
                    <button
                      onClick={() => clearFilter("subcategory")}
                      className="ml-1 hover:bg-[#65a30d] rounded-full p-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {displayProducts.length > 0 ? (
          <div className="p-6">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts?.map((product) => {
                const discountPercent = calculateDiscount(
                  product.price,
                  product.priceAfterDiscount
                );

                const isFavorite =
                  wishlistItems?.some((item) => item._id === product._id) ||
                  false;

                // Get cart item details
                const cartItemDetails = getCartItemDetails(product._id);
                const cartQuantity = cartItemDetails
                  ? cartItemDetails.quantity
                  : 0;
                const inCart = cartQuantity > 0;
                const cartItemId = cartItemDetails?.cartItemId;
                const isUpdating = cartItemId
                  ? updatingCart[cartItemId]
                  : updatingCart[product._id];

                return (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    onClick={() =>
                      router.push(`/products/productDetails/${product._id}`)
                    }
                  >
                    {discountPercent > 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        -{discountPercent}%
                      </div>
                    )}

                    {/* Favorite Button */}
                    {isUser ? (
                      <button
                        onClick={(e) => toggleFavorite(product._id, e)}
                        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                          isFavorite
                            ? "bg-red-100 text-red-600 hover:bg-red-200 shadow-md"
                            : "bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500 backdrop-blur-sm"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-200 ${
                            isFavorite
                              ? "fill-current transform scale-110"
                              : "hover:scale-110"
                          }`}
                        />
                      </button>
                    ) : (
                      ""
                    )}

                    {/* Cart Badge */}
                    {inCart && (
                      <div className="absolute top-2 right-12 z-10 bg-[#16a34a] text-white text-xs font-bold px-2 py-1 rounded-full">
                        {cartQuantity}
                      </div>
                    )}

                    {/* Loading Overlay */}
                    {isUpdating && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#16a34a]"></div>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                      {product.imgCover?.startsWith("http") ? (
                        <Image
                          src={product.imgCover}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : product.images?.[0]?.startsWith("http") ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="h-16 w-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize truncate mb-2">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Rating */}
                      {product.myReviews && product.myReviews.length > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          {renderStars(4.5)}{" "}
                          {/* You can calculate actual rating here */}
                          <span className="text-sm text-gray-500 ml-1">
                            ({product.myReviews.length})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {product.priceAfterDiscount &&
                        product.priceAfterDiscount < product.price ? (
                          <>
                            <span className="text-lg font-bold text-[#16a34a]">
                              {formatPrice(product.priceAfterDiscount)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              (product.quantity || 0) > 10
                                ? "bg-green-500"
                                : (product.quantity || 0) > 0
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-sm text-gray-600">
                            {(product.quantity || 0) > 0
                              ? `${product.quantity} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                        {product.sold > 0 && (
                          <span className="text-xs text-gray-500">
                            {product.sold} sold
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/products/productDetails/${product._id}`
                            );
                          }}
                          className="flex-1 bg-[#16a34a] hover:bg-[#65a30d] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>

                        {/* Cart Actions for Users */}
                        {isUser && (product.quantity || 0) > 0 && (
                          <div className="flex gap-1">
                            {!inCart ? (
                              <button
                                onClick={(e) =>
                                  addProductToCart(product._id, e)
                                }
                                disabled={isUpdating}
                                className="px-3 py-2 border border-[#16a34a] text-[#16a34a] hover:bg-[#16a34a] hover:text-white rounded-md transition-colors disabled:opacity-50"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    if (cartItemId) {
                                      decrementQuantity(
                                        cartItemId,
                                        cartQuantity,
                                        e
                                      );
                                    }
                                  }}
                                  disabled={isUpdating || !cartItemId}
                                  className="px-2 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
                                  title="Decrease Quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium min-w-[32px] text-center">
                                  {cartQuantity}
                                </span>
                                <button
                                  onClick={(e) => {
                                    if (cartItemId) {
                                      incrementQuantity(
                                        cartItemId,
                                        cartQuantity,
                                        e
                                      );
                                    }
                                  }}
                                  disabled={isUpdating || !cartItemId}
                                  className="px-2 py-2 bg-[#16a34a] text-white hover:bg-[#65a30d] rounded-md transition-colors disabled:opacity-50"
                                  title="Increase Quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/products/editProduct/${product._id}`
                              );
                            }}
                            className="flex-1 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => handleDelete(product._id, e)}
                            className="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {activeFilters.brand || activeFilters.subcategory
                ? "No products match your filters"
                : "No products found"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilters.brand || activeFilters.subcategory
                ? "Try adjusting your filters or browse all products."
                : "Get started by creating a new product."}
            </p>

            {(activeFilters.brand || activeFilters.subcategory) && (
              <div className="mt-4">
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {isAdmin && !(activeFilters.brand || activeFilters.subcategory) && (
              <div className="mt-6">
                <button
                  onClick={() => router.push("/products/addProduct")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Product
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   Heart,
//   ShoppingCart,
//   Eye,
//   Edit,
//   Trash2,
//   Star,
//   Plus,
//   Minus,
// } from "lucide-react";
// import { jwtDecode } from "jwt-decode";
// import useProductStore from "../_store/useProductStore";
// import useAuthStore from "../_store/authStore";
// import useWishlistStore from "../_store/wishlist";
// import useCartStore from "../_store/useCartStore";

// const ProductsList = () => {
//   const router = useRouter();
//   const { products, loading, error, fetchProducts, deleteProduct } =
//     useProductStore();
//   const { updateWishlist, fetchWishlist, wishlistItems, deleteFromWishlist } =
//     useWishlistStore();
//   const {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateCartItemQuantity,
//     fetchCart,
//   } = useCartStore();
//   const { role: stateRole } = useAuthStore();

//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isUser, setIsUser] = useState(false);
//   const [updatingCart, setUpdatingCart] = useState({});

//   const getRoleFromToken = () => {
//     try {
//       const authStorage = localStorage.getItem("auth-storage");
//       if (!authStorage) return null;

//       const { token } = JSON.parse(authStorage)?.state || {};
//       if (!token) return null;

//       const decoded = jwtDecode(token);
//       return decoded?.role || null;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const role = getRoleFromToken();
//     const isUserAdmin = role === "admin" && stateRole === "admin";
//     const CheckIsUser = role === "user" && stateRole === "user";
//     setIsAdmin(isUserAdmin);
//     setIsUser(CheckIsUser);
//     fetchProducts();
//     if (CheckIsUser) {
//       fetchWishlist();
//       fetchCart();
//     }
//   }, [fetchProducts, fetchWishlist, fetchCart, stateRole]);

//   const handleDelete = async (id, e) => {
//     e.stopPropagation();
//     if (!window.confirm("Are you sure you want to delete this product?"))
//       return;
//     const success = await deleteProduct(id);
//     if (success) {
//       fetchProducts();
//     }
//   };

//   const toggleFavorite = async (productId, e) => {
//     e.stopPropagation();
//     const isCurrentlyFavorite = wishlistItems?.some(
//       (item) => item._id === productId
//     );
//     if (isCurrentlyFavorite) {
//       await deleteFromWishlist(productId);
//     } else {
//       await updateWishlist(productId);
//     }
//   };

//   const addProductToCart = async (productId, e) => {
//     e.stopPropagation();
//     setUpdatingCart((prev) => ({ ...prev, [productId]: true }));

//     try {
//       const success = await addToCart(productId);
//       if (success) {
//         await fetchCart();
//         console.log("Product added to cart successfully");
//       }
//     } catch (error) {
//       console.error("Error adding product to cart:", error);
//     } finally {
//       setUpdatingCart((prev) => ({ ...prev, [productId]: false }));
//     }
//   };

//   console.log(cartItems);

//   const getCartItemDetails = (productId) => {
//     if (!cartItems || !Array.isArray(cartItems)) return null;

//     const cartItem = cartItems.find((item) => {
//       if (typeof item.product === "object" && item.product?._id) {
//         return item.product._id === productId;
//       }
//       if (typeof item.product === "string") {
//         return item.product === productId;
//       }
//       return false;
//     });

//     return cartItem
//       ? {
//           cartItemId: cartItem._id,
//           quantity: cartItem.quantity,
//           price: cartItem.price,
//         }
//       : null;
//   };

//   const updateProductQuantity = async (cartItemId, quantity, e) => {
//     e.stopPropagation();

//     if (quantity < 0) return;

//     setUpdatingCart((prev) => ({ ...prev, [cartItemId]: true }));

//     try {
//       if (quantity === 0) {
//         const success = await removeFromCart(cartItemId);
//         if (success) {
//           await fetchCart();
//           console.log("Product removed from cart successfully");
//         }
//       } else {
//         const success = await updateCartItemQuantity(cartItemId, quantity);
//         if (success) {
//           await fetchCart();
//           console.log(`Product quantity updated to ${quantity}`);
//         }
//       }
//     } catch (error) {
//       console.error("Error updating product quantity:", error);
//     } finally {
//       setUpdatingCart((prev) => ({ ...prev, [cartItemId]: false }));
//     }
//   };

//   // Increment quantity using cart item ID
//   const incrementQuantity = async (cartItemId, currentQuantity, e) => {
//     const newQuantity = currentQuantity + 1;
//     await updateProductQuantity(cartItemId, newQuantity, e);
//   };

//   // Decrement quantity using cart item ID
//   const decrementQuantity = async (cartItemId, currentQuantity, e) => {
//     const newQuantity = Math.max(0, currentQuantity - 1);
//     await updateProductQuantity(cartItemId, newQuantity, e);
//   };

//   const getCartItemQuantity = (productId) => {
//     const cartItemDetails = getCartItemDetails(productId);
//     return cartItemDetails ? cartItemDetails.quantity : 0;
//   };

//   const isProductInCart = (productId) => {
//     return getCartItemQuantity(productId) > 0;
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(price);
//   };

//   const calculateDiscount = (originalPrice, discountPrice) => {
//     if (!discountPrice || discountPrice >= originalPrice) return 0;
//     return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
//   };

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => (
//       <Star
//         key={index}
//         className={`w-4 h-4 ${
//           index < Math.floor(rating)
//             ? "text-yellow-400 fill-current"
//             : "text-gray-300"
//         }`}
//       />
//     ));
//   };

//   if (loading && !products.length) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <svg
//               className="h-5 w-5 text-red-500"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         {/* Header */}
//         <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
//           <div>
//             <div className="flex items-center gap-3">
//               <svg
//                 className="w-6 h-6 text-[#16a34a]"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                 />
//               </svg>
//               <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
//                 Products
//               </h3>
//             </div>
//             <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
//               Browse and manage all available products in your store (
//               {products.length} products)
//             </p>
//           </div>
//           {isAdmin && (
//             <button
//               onClick={() => router.push("/products/addProduct")}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
//             >
//               Add New Product
//             </button>
//           )}
//         </div>

//         {products.length > 0 ? (
//           <div className="p-6">
//             {/* Products Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {products?.map((product) => {
//                 const discountPercent = calculateDiscount(
//                   product.price,
//                   product.priceAfterDiscount
//                 );

//                 const isFavorite =
//                   wishlistItems?.some((item) => item._id === product._id) ||
//                   false;

//                 // Get cart item details
//                 const cartItemDetails = getCartItemDetails(product._id);
//                 const cartQuantity = cartItemDetails
//                   ? cartItemDetails.quantity
//                   : 0;
//                 const inCart = cartQuantity > 0;
//                 const cartItemId = cartItemDetails?.cartItemId;
//                 const isUpdating = cartItemId
//                   ? updatingCart[cartItemId]
//                   : updatingCart[product._id];

//                 return (
//                   <div
//                     key={product._id}
//                     className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
//                     onClick={() =>
//                       router.push(`/products/productDetails/${product._id}`)
//                     }
//                   >
//                     {discountPercent > 0 && (
//                       <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
//                         -{discountPercent}%
//                       </div>
//                     )}

//                     {/* Favorite Button */}
//                     {isUser ? (
//                       <button
//                         onClick={(e) => toggleFavorite(product._id, e)}
//                         className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
//                           isFavorite
//                             ? "bg-red-100 text-red-600 hover:bg-red-200 shadow-md"
//                             : "bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500 backdrop-blur-sm"
//                         }`}
//                       >
//                         <Heart
//                           className={`w-5 h-5 transition-all duration-200 ${
//                             isFavorite
//                               ? "fill-current transform scale-110"
//                               : "hover:scale-110"
//                           }`}
//                         />
//                       </button>
//                     ) : (
//                       ""
//                     )}

//                     {/* Cart Badge */}
//                     {inCart && (
//                       <div className="absolute top-2 right-12 z-10 bg-[#16a34a] text-white text-xs font-bold px-2 py-1 rounded-full">
//                         {cartQuantity}
//                       </div>
//                     )}

//                     {/* Loading Overlay */}
//                     {isUpdating && (
//                       <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
//                         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#16a34a]"></div>
//                       </div>
//                     )}

//                     {/* Product Image */}
//                     <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
//                       {product.imgCover?.startsWith("http") ? (
//                         <Image
//                           src={product.imgCover}
//                           alt={product.title}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                       ) : product.images?.[0]?.startsWith("http") ? (
//                         <Image
//                           src={product.images[0]}
//                           alt={product.title}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <svg
//                             className="h-16 w-16 text-gray-400"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                             />
//                           </svg>
//                         </div>
//                       )}
//                     </div>

//                     {/* Product Info */}
//                     <div className="p-4">
//                       <h3 className="text-lg font-semibold text-gray-900 capitalize truncate mb-2">
//                         {product.title}
//                       </h3>

//                       {product.description && (
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                           {product.description}
//                         </p>
//                       )}

//                       {/* Rating */}
//                       {product.myReviews && product.myReviews.length > 0 && (
//                         <div className="flex items-center gap-1 mb-3">
//                           {renderStars(4.5)}{" "}
//                           {/* You can calculate actual rating here */}
//                           <span className="text-sm text-gray-500 ml-1">
//                             ({product.myReviews.length})
//                           </span>
//                         </div>
//                       )}

//                       {/* Price */}
//                       <div className="flex items-center gap-2 mb-3">
//                         {product.priceAfterDiscount &&
//                         product.priceAfterDiscount < product.price ? (
//                           <>
//                             <span className="text-lg font-bold text-[#16a34a]">
//                               {formatPrice(product.priceAfterDiscount)}
//                             </span>
//                             <span className="text-sm text-gray-500 line-through">
//                               {formatPrice(product.price)}
//                             </span>
//                           </>
//                         ) : (
//                           <span className="text-lg font-bold text-gray-900">
//                             {formatPrice(product.price)}
//                           </span>
//                         )}
//                       </div>

//                       {/* Stock Status */}
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center gap-2">
//                           <div
//                             className={`w-2 h-2 rounded-full ${
//                               (product.quantity || 0) > 10
//                                 ? "bg-green-500"
//                                 : (product.quantity || 0) > 0
//                                 ? "bg-yellow-500"
//                                 : "bg-red-500"
//                             }`}
//                           ></div>
//                           <span className="text-sm text-gray-600">
//                             {(product.quantity || 0) > 0
//                               ? `${product.quantity} in stock`
//                               : "Out of stock"}
//                           </span>
//                         </div>
//                         {product.sold > 0 && (
//                           <span className="text-xs text-gray-500">
//                             {product.sold} sold
//                           </span>
//                         )}
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             router.push(
//                               `/products/productDetails/${product._id}`
//                             );
//                           }}
//                           className="flex-1 bg-[#16a34a] hover:bg-[#65a30d] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                         >
//                           <Eye className="w-4 h-4" />
//                           View
//                         </button>

//                         {/* Cart Actions for Users */}
//                         {isUser && (product.quantity || 0) > 0 && (
//                           <div className="flex gap-1">
//                             {!inCart ? (
//                               <button
//                                 onClick={(e) =>
//                                   addProductToCart(product._id, e)
//                                 }
//                                 disabled={isUpdating}
//                                 className="px-3 py-2 border border-[#16a34a] text-[#16a34a] hover:bg-[#16a34a] hover:text-white rounded-md transition-colors disabled:opacity-50"
//                                 title="Add to Cart"
//                               >
//                                 <ShoppingCart className="w-4 h-4" />
//                               </button>
//                             ) : (
//                               <div className="flex items-center gap-1">
//                                 <button
//                                   onClick={(e) => {
//                                     if (cartItemId) {
//                                       decrementQuantity(
//                                         cartItemId,
//                                         cartQuantity,
//                                         e
//                                       );
//                                     }
//                                   }}
//                                   disabled={isUpdating || !cartItemId}
//                                   className="px-2 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
//                                   title="Decrease Quantity"
//                                 >
//                                   <Minus className="w-3 h-3" />
//                                 </button>
//                                 <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium min-w-[32px] text-center">
//                                   {cartQuantity}
//                                 </span>
//                                 <button
//                                   onClick={(e) => {
//                                     if (cartItemId) {
//                                       incrementQuantity(
//                                         cartItemId,
//                                         cartQuantity,
//                                         e
//                                       );
//                                     }
//                                   }}
//                                   disabled={isUpdating || !cartItemId}
//                                   className="px-2 py-2 bg-[#16a34a] text-white hover:bg-[#65a30d] rounded-md transition-colors disabled:opacity-50"
//                                   title="Increase Quantity"
//                                 >
//                                   <Plus className="w-3 h-3" />
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* Admin Actions */}
//                       {isAdmin && (
//                         <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               router.push(
//                                 `/products/editProduct/${product._id}`
//                               );
//                             }}
//                             className="flex-1 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                           >
//                             <Edit className="w-4 h-4" />
//                             Edit
//                           </button>
//                           <button
//                             onClick={(e) => handleDelete(product._id, e)}
//                             className="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <svg
//               className="mx-auto h-12 w-12 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//               ></path>
//             </svg>
//             <h3 className="mt-2 text-sm font-medium text-gray-900">
//               No products found
//             </h3>
//             <p className="mt-1 text-sm text-gray-500">
//               Get started by creating a new product.
//             </p>
//             {isAdmin && (
//               <div className="mt-6">
//                 <button
//                   onClick={() => router.push("/products/addProduct")}
//                   className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
//                 >
//                   <svg
//                     className="-ml-1 mr-2 h-5 w-5"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   New Product
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductsList;
