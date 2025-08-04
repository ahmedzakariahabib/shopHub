"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import useProductStore from "@/app/_store/useProductStore";
import useAuthStore from "@/app/_store/authStore";
import useWishlistStore from "@/app/_store/wishlist";
import useCartStore from "@/app/_store/useCartStore";
import useReviewStore from "@/app/_store/useReviewStore";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = useParams();
  const { currentProduct, loading, fetchProduct, deleteProduct } =
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

  const { deleteReview } = useReviewStore();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const { role: stateRole } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [updatingCart, setUpdatingCart] = useState(false);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);

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

  const getId = () => {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) return null;

      const { token } = JSON.parse(authStorage)?.state || {};
      if (!token) return null; // fix: check for absence of token

      const decoded = jwtDecode(token);
      return decoded?.userId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  console.log(currentProduct);

  useEffect(() => {
    const role = getRoleFromToken();
    const isUserAdmin = role === "admin" && stateRole === "admin";
    const CheckIsUser = role === "user" && stateRole === "user";
    setIsAdmin(isUserAdmin);
    setIsUser(CheckIsUser);

    if (productId) {
      fetchProduct(productId);
    }

    if (CheckIsUser) {
      fetchWishlist();
      fetchCart();
    }
  }, [productId, fetchProduct, stateRole]);

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

  const addProductToCart = async () => {
    if (!currentProduct?._id) return;

    setUpdatingCart(true);
    try {
      const success = await addToCart(currentProduct._id);
      if (success) {
        await fetchCart();
        console.log("Product added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setUpdatingCart(false);
    }
  };

  const updateProductQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 0) return;

    setUpdatingCart(true);
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
      setUpdatingCart(false);
    }
  };

  // Wishlist functionality
  const isProductInWishlist = () => {
    return (
      wishlistItems?.some((item) => item._id === currentProduct?._id) || false
    );
  };

  const toggleFavorite = async () => {
    if (!currentProduct?._id) return;

    setUpdatingWishlist(true);
    try {
      const isCurrentlyFavorite = isProductInWishlist();
      if (isCurrentlyFavorite) {
        await deleteFromWishlist(currentProduct._id);
      } else {
        await updateWishlist(currentProduct._id);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setUpdatingWishlist(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const success = await deleteProduct(productId);
      if (success) {
        router.push("/dashboard");
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      let success = await deleteReview(reviewId);
      if (success) {
        fetchProduct(productId);
      }
    }
  };

  if (loading && !currentProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Product not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The product you're looking for doesn't exist.
            </p>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button
              onClick={() => router.push("/products")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All images including cover
  const allImages = currentProduct.imgCover
    ? [currentProduct.imgCover, ...(currentProduct.images || [])]
    : currentProduct.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const calculateAverageRating = () => {
    if (!currentProduct.myReviews || currentProduct.myReviews.length === 0)
      return 0;
    const total = currentProduct.myReviews.reduce(
      (sum, review) => sum + review.rate,
      0
    );
    return (total / currentProduct.myReviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : index < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const discountPercentage =
    currentProduct.price > 0
      ? Math.round(
          ((currentProduct.price - currentProduct.priceAfterDiscount) /
            currentProduct.price) *
            100
        )
      : 0;

  // Get current cart item details
  const cartItemDetails = getCartItemDetails(currentProduct._id);
  const cartQuantity = cartItemDetails ? cartItemDetails.quantity : 0;
  const inCart = cartQuantity > 0;
  const cartItemId = cartItemDetails?.cartItemId;
  const isWishlisted = isProductInWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
              <h3 className="text-xl font-bold text-gray-800">
                Product Details
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9">
              Detailed information about {currentProduct.title}
            </p>
          </div>
          {isAdmin ? (
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() =>
                  router.push(`/products/editProduct/${productId}`)
                }
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Back
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {allImages.length > 0 ? (
                    <Image
                      src={allImages[currentImageIndex]}
                      alt={currentProduct.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="h-20 w-20 text-gray-400"
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

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </>
                )}

                {/* Cart Badge */}
                {inCart && (
                  <div className="absolute top-4 right-4 bg-[#16a34a] text-white text-xs font-bold px-3 py-1 rounded-full">
                    In Cart: {cartQuantity}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-[#16a34a]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${currentProduct.title} ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Product Title and Rating */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 capitalize mb-2">
                  {currentProduct.title}
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(calculateAverageRating())}
                    <span className="text-sm text-gray-600 ml-1">
                      ({calculateAverageRating()})
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {currentProduct.myReviews
                      ? currentProduct.myReviews.length
                      : 0}{" "}
                    review
                    {(currentProduct.myReviews?.length || 0) !== 1 ? "s" : ""}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentProduct.sold || 0} sold
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#16a34a]">
                  ${currentProduct.priceAfterDiscount}
                </span>
                {currentProduct.price > currentProduct.priceAfterDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${currentProduct.price}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    (currentProduct.quantity || 0) > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`font-medium ${
                    (currentProduct.quantity || 0) > 0
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {(currentProduct.quantity || 0) > 0
                    ? `In Stock (${currentProduct.quantity} available)`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 capitalize">
                  {currentProduct.description || "No description available"}
                </p>
              </div>

              {/* User Actions */}
              {isUser && (currentProduct.quantity || 0) > 0 && (
                <div className="space-y-4">
                  {/* Cart Actions */}
                  <div className="space-y-3">
                    {!inCart ? (
                      <button
                        onClick={addProductToCart}
                        disabled={updatingCart}
                        className="w-full bg-[#16a34a] hover:bg-[#65a30d] text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updatingCart ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3 bg-gray-50 p-3 rounded-md">
                          <button
                            onClick={() =>
                              updateProductQuantity(
                                cartItemId,
                                cartQuantity - 1
                              )
                            }
                            disabled={updatingCart || cartQuantity < 1}
                            className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 bg-white border rounded-md font-medium min-w-[60px] text-center">
                            {updatingCart ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#16a34a] mx-auto"></div>
                            ) : (
                              cartQuantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              updateProductQuantity(
                                cartItemId,
                                cartQuantity + 1
                              )
                            }
                            disabled={
                              updatingCart ||
                              cartQuantity >= currentProduct.quantity
                            }
                            className="p-2 bg-[#16a34a] text-white hover:bg-[#65a30d] rounded-md transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-center text-gray-600">
                          Item in cart - Adjust quantity above
                        </p>
                      </div>
                    )}

                    {/* Wishlist and Share Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={toggleFavorite}
                        disabled={updatingWishlist}
                        className={`flex-1 px-4 py-3 rounded-md border transition-colors flex items-center justify-center gap-2 ${
                          isWishlisted
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        } disabled:opacity-50`}
                      >
                        {updatingWishlist ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                        ) : (
                          <>
                            <Heart
                              className={`w-5 h-5 ${
                                isWishlisted ? "fill-current" : ""
                              }`}
                            />
                            {isWishlisted
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"}
                          </>
                        )}
                      </button>
                      <button className="px-4 py-3 rounded-md bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold mt-6 text-gray-900">
              Customer Reviews ({currentProduct.myReviews.length})
            </h3>
            {isUser ? (
              <button
                onClick={() => router.push(`/reviews/addReview/${productId}`)}
                className="bg-[#16a34a] hover:bg-[#65a30d] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Review
              </button>
            ) : (
              ""
            )}
          </div>
          {currentProduct.myReviews && currentProduct.myReviews.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="space-y-6">
                {currentProduct.myReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 rounded-lg p-4 relative group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {review.user.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rate)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>

                      {/* Action buttons - show on hover or always visible on mobile */}

                      {getId() === review?.user?._id && isUser ? (
                        <div
                          className="flex items-center gap-
                      2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:opacity-100"
                        >
                          <button
                            onClick={() =>
                              router.push(`/reviews/editReview/${review._id}`)
                            }
                            className="text-[#16a34a] mt-10  hover:text-[#65a30d] p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
                            title="Edit review"
                          >
                            <svg
                              className="w-6 h-10 "
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 mt-10 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                            title="Delete review"
                          >
                            <svg
                              className="w-6 h-10"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a-2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        ""
                      )}

                      {isAdmin ? (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 mt-10 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                          title="Delete review"
                        >
                          <svg
                            className="w-6 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a-2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>

                    <p className="text-gray-700">{review.text}</p>

                    {/* Edit indicator */}
                    {review.isEdited && (
                      <p className="text-xs text-gray-400 mt-2 italic">
                        Last edited: {formatDate(review.updatedAt)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Review Section - Show when no reviews or when adding */}
          {(!currentProduct.myReviews ||
            currentProduct.myReviews.length === 0) && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="text-center py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  No Reviews Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Be the first to share your thoughts about this product.
                </p>
                {isUser ? (
                  <button
                    onClick={() =>
                      router.push(`/reviews/addReview/${productId}`)
                    }
                    className="bg-[#16a34a]  hover:bg-[#65a30d] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Write a Review
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
