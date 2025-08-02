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
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import useProductStore from "@/app/_store/useProductStore";
import useAuthStore from "@/app/_store/authStore";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = useParams();
  const { currentProduct, loading, fetchProduct, deleteProduct } =
    useProductStore();

  const [isAdmin, setIsAdmin] = useState(false);
  const { role: stateRole } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    setIsAdmin(isUserAdmin);
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct, stateRole]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const success = await deleteProduct(productId);
      if (success) {
        router.push("/dashboard");
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

              {/* Quantity Selector and Actions */}
              {(currentProduct.quantity || 0) > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="quantity"
                      className="text-sm font-medium text-gray-700"
                    >
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        max={currentProduct.quantity || 1}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(
                              1,
                              Math.min(
                                currentProduct.quantity || 1,
                                parseInt(e.target.value) || 1
                              )
                            )
                          )
                        }
                        className="w-16 px-2 py-2 text-center border-x border-gray-300 focus:outline-none"
                      />
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(currentProduct.quantity || 1, quantity + 1)
                          )
                        }
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#16a34a] hover:bg-[#65a30d] text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`px-4 py-3 rounded-md border transition-colors ${
                        isWishlisted
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button className="px-4 py-3 rounded-md bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {currentProduct.myReviews && currentProduct.myReviews.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Customer Reviews
              </h3>
              <div className="space-y-6">
                {currentProduct.myReviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
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
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
