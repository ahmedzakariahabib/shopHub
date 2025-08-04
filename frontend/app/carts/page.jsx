"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useCartStore from "../_store/useCartStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CartComponent = () => {
  const {
    cartItems,
    cartSummary,
    loading,
    error,
    appliedCoupon,
    fetchCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    applyCoupon,
    cartId,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [imageErrors, setImageErrors] = useState(new Set());
  const [productDataCache, setProductDataCache] = useState({});
  const router = useRouter();
  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const cache = {};
    cartItems.forEach((item) => {
      if (typeof item.product === "object" && item.product !== null) {
        cache[item.product._id] = item.product;
      }
    });
    setProductDataCache((prevCache) => ({ ...prevCache, ...cache }));
  }, [cartItems]);

  const getProductData = (item) => {
    if (typeof item.product === "object" && item.product !== null) {
      return item.product;
    }

    if (typeof item.product === "string" && productDataCache[item.product]) {
      return productDataCache[item.product];
    }
    return null;
  };

  const getAllImages = (item) => {
    const allImages = [];
    const productData = getProductData(item);

    if (productData?.imgCover && productData.imgCover.trim()) {
      allImages.push(productData.imgCover);
    }

    if (productData?.images && Array.isArray(productData.images)) {
      const validImages = productData.images.filter((img) => img && img.trim());
      allImages.push(...validImages);
    }

    return allImages.length > 0 ? allImages : [];
  };

  const hasValidImages = (item) => {
    const allImages = getAllImages(item);
    return allImages.length > 1 && allImages.some((img) => img && img.trim());
  };

  const handleQuantityChange = useCallback(
    async (itemId, newQuantity) => {
      if (newQuantity < 1) return;

      setUpdatingItems((prev) => new Set([...prev, itemId]));

      try {
        await updateCartItemQuantity(itemId, newQuantity);
      } finally {
        setUpdatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    },
    [updateCartItemQuantity]
  );

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?"))
      return;
    await clearCart();
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    await applyCoupon(couponCode.trim());
    setCouponCode("");
  };

  const getImageUrl = useCallback(
    (item) => {
      const allImages = getAllImages(item);
      if (allImages.length === 0) {
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
      }

      const currentIndex = currentImageIndex[item._id] || 0;
      const image = allImages[currentIndex];

      if (
        !image ||
        typeof image !== "string" ||
        image.trim() === "" ||
        imageErrors.has(`${item._id}-${currentIndex}`)
      ) {
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
      }

      return image;
    },
    [currentImageIndex, imageErrors, productDataCache]
  );

  const handleImageNavigation = useCallback(
    (itemId, direction) => {
      const item = cartItems.find((item) => item._id === itemId);
      if (!item) return;

      const allImages = getAllImages(item);
      if (allImages.length <= 1) return;

      const currentIndex = currentImageIndex[itemId] || 0;
      let newIndex;

      if (direction === "next") {
        newIndex = (currentIndex + 1) % allImages.length;
      } else {
        newIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
      }

      setCurrentImageIndex((prev) => ({
        ...prev,
        [itemId]: newIndex,
      }));
    },
    [cartItems, currentImageIndex, productDataCache]
  );

  const handleImageClick = useCallback(
    (itemId) => {
      handleImageNavigation(itemId, "next");
    },
    [handleImageNavigation]
  );

  const handleImageError = useCallback((itemId, imageIndex) => {
    setImageErrors((prev) => new Set([...prev, `${itemId}-${imageIndex}`]));
  }, []);

  const getCartSummary = () => {
    return {
      numOfCartItems: cartItems?.length || 0,
      totalCartPrice:
        cartSummary?.totalCartPrice || cartSummary?.totalPrice || 0,
      totalPriceAfterDiscount: cartSummary?.totalPriceAfterDiscount || null,
    };
  };

  const summary = getCartSummary();

  if (loading && !cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length < 1) {
    <p>not found</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[#16a34a]" />
            Shopping Cart
            <span className="text-lg font-normal text-gray-500">
              ({summary.numOfCartItems} items)
            </span>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding some products to your cart
            </p>
            <button
              className="bg-[#16a34a] text-white px-8 py-3 rounded-lg hover:bg-[#65a30d] transition-colors"
              onClick={() => router.push("/dashboard")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Cart Items Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cartItems.map((item, index) => {
                  const productData = getProductData(item);
                  const allImages = getAllImages(item);
                  const hasMultipleImages = hasValidImages(item);
                  const currentImage = getImageUrl(item);
                  const currentIndex = currentImageIndex[item._id] || 0;

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={currentImage}
                          alt={productData?.title || "Product"}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() =>
                            hasMultipleImages && handleImageClick(item._id)
                          }
                          onError={() =>
                            handleImageError(item._id, currentIndex)
                          }
                        />

                        {/* Image Navigation Arrows */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageNavigation(item._id, "prev");
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageNavigation(item._id, "next");
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Image Indicators */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {allImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  setCurrentImageIndex((prev) => ({
                                    ...prev,
                                    [item._id]: index,
                                  }))
                                }
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  currentIndex === index
                                    ? "bg-white"
                                    : "bg-white bg-opacity-50"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Remove Button */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={loading}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        {/* Multiple Images Indicator */}
                        {hasMultipleImages && (
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                            {currentIndex + 1}/{allImages.length}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 capitalize">
                          {productData?.title || "Product"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {productData?.description || ""}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold text-[#65a30d]">
                            ${item.price}
                          </span>
                          {productData?.price &&
                            productData.price !== item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${productData.price}
                              </span>
                            )}
                          {productData?.priceAfterDiscount &&
                            productData.priceAfterDiscount !== item.price && (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                Save $
                                {(
                                  productData.price -
                                  productData.priceAfterDiscount
                                ).toFixed(2)}
                              </span>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Quantity:
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                updatingItems.has(item._id) ||
                                loading
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="w-8 text-center font-semibold">
                              {updatingItems.has(item._id) ? (
                                <div className="w-4 h-4 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin mx-auto"></div>
                              ) : (
                                item.quantity
                              )}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={updatingItems.has(item._id) || loading}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stock Info */}
                        {productData?.quantity && (
                          <div className="mt-2 text-xs text-gray-500">
                            {productData.quantity > 10 ? (
                              <span className="text-green-600">In Stock</span>
                            ) : productData.quantity > 0 ? (
                              <span className="text-yellow-600">
                                Only {productData.quantity} left
                              </span>
                            ) : (
                              <span className="text-red-600">Out of Stock</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart Button */}
              {cartItems.length > 0 && (
                <div className="text-center pt-8">
                  <button
                    onClick={handleClearCart}
                    disabled={loading}
                    className="bg-[#16a34a] p-5 px-8 rounded-2xl text-white   text-sm font-medium disabled:opacity-50"
                  >
                    Clear entire cart
                  </button>
                </div>
              )}
            </div>

            {/* Cart Summary - Fixed Sidebar */}
            <div className="space-y-6">
              {/* Coupon Section */}
              <button
                onClick={() => router.push(`orders/createOrder/${cartId}`)}
                className="w-full mt-6 bg-[#16a34a] text-white py-3 rounded-lg hover:bg-[#65a30d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Create Order
              </button>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-green-500" />
                  Coupon Code
                </h3>

                <div className="grid gap-2 mb-4 grid-cols-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>

                {/* Order Summary */}
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${summary.totalCartPrice.toFixed(2)}
                    </span>
                  </div>

                  {appliedCoupon &&
                    summary.totalPriceAfterDiscount &&
                    summary.totalPriceAfterDiscount <
                      summary.totalCartPrice && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>
                          -$
                          {(
                            summary.totalCartPrice -
                            summary.totalPriceAfterDiscount
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-[#65a30d]">
                        $
                        {(
                          summary.totalPriceAfterDiscount ||
                          summary.totalCartPrice
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading || cartItems.length === 0}
                  className="w-full mt-6 bg-[#16a34a] text-white py-3 rounded-lg hover:bg-[#65a30d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartComponent;
