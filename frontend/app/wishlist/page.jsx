"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useWishlistStore from "../_store/wishlist";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuthStore from "../_store/authStore";

const WishlistComponent = () => {
  const { wishlistItems, loading, error, fetchWishlist, deleteFromWishlist } =
    useWishlistStore();
  const router = useRouter();

  const [removingId, setRemovingId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingId(productId);
    await deleteFromWishlist(productId);
    setRemovingId(null);
  };

  const calculateDiscount = (price, priceAfterDiscount) => {
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  };

  // Get all images for a product (imgCover + images array)
  const getAllImages = (item) => {
    const allImages = [item?.imgCover];
    if (item?.images && item?.images.length > 0) {
      allImages.push(...item.images);
    }
    return allImages;
  };

  // Handle image navigation
  const handleImageNavigation = (productId, direction) => {
    const item = wishlistItems.find((item) => item._id === productId);
    if (!item) return;

    const allImages = getAllImages(item);
    const currentIndex = currentImageIndex[productId] || 0;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % allImages.length;
    } else {
      newIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
    }

    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: newIndex,
    }));
  };

  // Handle image click to cycle through
  const handleImageClick = (productId) => {
    handleImageNavigation(productId, "next");
  };

  // Get current image for display
  const getCurrentImage = (item) => {
    const allImages = getAllImages(item);
    const currentIndex = currentImageIndex[item._id] || 0;
    return allImages[currentIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
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
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            My Wishlist
            <span className="text-lg font-normal text-gray-500">
              ({wishlistItems.length} items)
            </span>
          </h1>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding items you love to your wishlist
            </p>
            <button className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const allImages = getAllImages(item);
              const hasMultipleImages = allImages.length > 1;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={getCurrentImage(item)}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() =>
                        hasMultipleImages && handleImageClick(item._id)
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
                              (currentImageIndex[item._id] || 0) === index
                                ? "bg-white"
                                : "bg-white bg-opacity-50"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Discount Badge */}
                    {item.priceAfterDiscount < item.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                        -
                        {calculateDiscount(item.price, item.priceAfterDiscount)}
                        %
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleRemoveFromWishlist(item._id)}
                        disabled={removingId === item._id}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {removingId === item._id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-500" />
                        )}
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Eye
                          className="w-4 h-4 text-gray-600"
                          onClick={() =>
                            router.push(`/products/productDetails/${item._id}`)
                          }
                        />
                      </button>
                    </div>

                    {/* Stock Status */}
                    {item.quantity === 0 && (
                      <div className="absolute bottom-8 left-3 bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-md text-sm">
                        Out of Stock
                      </div>
                    )}

                    {/* Multiple Images Indicator */}
                    {hasMultipleImages && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                        {(currentImageIndex[item._id] || 0) + 1}/
                        {allImages.length}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 capitalize">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Rating & Sales */}
                    <div className="flex items-center gap-4 mb-3">
                      {item.rateCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {item.rateCount}
                          </span>
                        </div>
                      )}
                      {item.sold > 0 && (
                        <span className="text-sm text-gray-500">
                          {item.sold} sold
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-red-500">
                        ${item.priceAfterDiscount}
                      </span>
                      {item.priceAfterDiscount < item.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.price}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      disabled={item.quantity === 0}
                      className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {item.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions Bar */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {wishlistItems.length} items in your wishlist
                </span>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Move All to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistComponent;
