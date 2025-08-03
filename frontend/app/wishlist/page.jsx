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
  Plus,
  Minus,
} from "lucide-react";
import useWishlistStore from "../_store/wishlist";
import useCartStore from "../_store/useCartStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

const WishlistComponent = () => {
  const { wishlistItems, loading, error, fetchWishlist, deleteFromWishlist } =
    useWishlistStore();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    fetchCart,
  } = useCartStore();
  const router = useRouter();

  const [removingId, setRemovingId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [updatingCartItems, setUpdatingCartItems] = useState(new Set());
  const [movingAllToCart, setMovingAllToCart] = useState(false);

  useEffect(() => {
    fetchWishlist();
    fetchCart();
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

  // Cart functionality
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

  const getCartItemQuantity = (productId) => {
    const cartItemDetails = getCartItemDetails(productId);
    return cartItemDetails ? cartItemDetails.quantity : 0;
  };

  const isProductInCart = (productId) => {
    return getCartItemQuantity(productId) > 0;
  };

  const addProductToCart = async (productId) => {
    setUpdatingCartItems((prev) => new Set([...prev, productId]));
    try {
      const success = await addToCart(productId);
      if (success) {
        await fetchCart();
        console.log("Product added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setUpdatingCartItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const updateProductQuantity = async (cartItemId, newQuantity, productId) => {
    if (newQuantity < 0) return;

    setUpdatingCartItems((prev) => new Set([...prev, productId]));
    try {
      if (newQuantity === 0) {
        const success = await removeFromCart(cartItemId);
        if (success) {
          await fetchCart();
          console.log("Product removed from cart successfully");
        }
      } else {
        const success = await updateCartItemQuantity(cartItemId, newQuantity);
        if (success) {
          await fetchCart();
          console.log(`Product quantity updated to ${newQuantity}`);
        }
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
    } finally {
      setUpdatingCartItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const moveAllToCart = async () => {
    setMovingAllToCart(true);
    const availableItems = wishlistItems.filter((item) => item.quantity > 0);

    try {
      for (const item of availableItems) {
        if (!isProductInCart(item._id)) {
          await addToCart(item._id);
        }
      }
      await fetchCart();
      console.log("All available items moved to cart successfully");
    } catch (error) {
      console.error("Error moving items to cart:", error);
    } finally {
      setMovingAllToCart(false);
    }
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
            <Heart className="w-8 h-8 text-[#16a34a] fill-current" />
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
            <button
              className="bg-[#16a34a] text-white px-8 py-3 rounded-lg hover:bg-[#65a30d] transition-colors"
              onClick={() => router.push("/dashboard")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const allImages = getAllImages(item);
              const hasMultipleImages = allImages.length > 1;
              const cartItemDetails = getCartItemDetails(item._id);
              const cartQuantity = cartItemDetails
                ? cartItemDetails.quantity
                : 0;
              const inCart = cartQuantity > 0;
              const cartItemId = cartItemDetails?.cartItemId;
              const isUpdating = updatingCartItems.has(item._id);

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

                    {/* Cart Badge */}
                    {inCart && (
                      <div className="absolute bottom-2 right-2 bg-[#16a34a] text-white text-xs font-bold px-2 py-1 rounded-full">
                        In Cart: {cartQuantity}
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

                    {/* Cart Actions */}
                    {item.quantity > 0 ? (
                      !inCart ? (
                        <button
                          onClick={() => addProductToCart(item._id)}
                          disabled={isUpdating}
                          className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2 bg-gray-50 p-2 rounded-lg">
                            <button
                              onClick={() =>
                                updateProductQuantity(
                                  cartItemId,
                                  cartQuantity - 1,
                                  item._id
                                )
                              }
                              disabled={isUpdating || cartQuantity < 1}
                              className="p-1 bg-red-500 text-white hover:bg-red-600 rounded transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 bg-white border rounded text-sm font-medium min-w-[40px] text-center">
                              {isUpdating ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-[#16a34a] mx-auto"></div>
                              ) : (
                                cartQuantity
                              )}
                            </span>
                            <button
                              onClick={() =>
                                updateProductQuantity(
                                  cartItemId,
                                  cartQuantity + 1,
                                  item._id
                                )
                              }
                              disabled={
                                isUpdating || cartQuantity >= item.quantity
                              }
                              className="p-1 bg-[#16a34a] text-white hover:bg-[#65a30d] rounded transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-center text-gray-500">
                            In Cart
                          </p>
                        </div>
                      )
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Out of Stock
                      </button>
                    )}
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
                <span className="text-sm text-gray-500">
                  ({wishlistItems.filter((item) => item.quantity > 0).length}{" "}
                  available)
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#65a30d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() => router.push("/carts")}
                >
                  {" "}
                  View Cart
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
