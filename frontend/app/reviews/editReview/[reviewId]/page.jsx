"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useReviewStore from "@/app/_store/useReviewStore";

const UpdateReviewForm = ({ params }) => {
  const router = useRouter();
  const { reviewId } = use(params);
  const [text, setText] = useState("");
  const [rate, setRate] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const { loading, currentReview, fetchReview, updateReview } =
    useReviewStore();

  console.log(reviewId);
  useEffect(() => {
    if (reviewId) {
      fetchReview(reviewId);
    }
  }, [reviewId, fetchReview]);

  useEffect(() => {
    if (currentReview) {
      setText(currentReview.text || "");
      setRate(currentReview.rate?.toString() || "");
    }
  }, [currentReview]);

  const handleRatingClick = (rating) => {
    setRate(rating.toString());
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Review text is required");
      return;
    }

    if (!rate || rate < 1 || rate > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    if (text.trim().length < 10) {
      toast.error("Review text must be at least 10 characters long");
      return;
    }

    if (text.trim().length > 1000) {
      toast.error("Review text must be less than 1000 characters");
      return;
    }

    const success = await updateReview(reviewId, {
      text: text.trim(),
      rate: parseInt(rate, 10),
    });

    if (success) {
      router.back();
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = hoverRating || parseInt(rate) || 0;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => handleRatingHover(i)}
          onMouseLeave={handleRatingLeave}
          className={`w-8 h-8 transition-colors duration-200 ${
            i <= currentRating
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-gray-300 hover:text-yellow-300"
          }`}
          disabled={loading}
        >
          <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      );
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
                  disabled={loading}
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
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                      Update Review
                    </h1>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
                    Modify your review and rating below
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info Section (if available) */}
          {currentReview?.product && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-10 h-10 text-gray-400"
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
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Reviewing Product
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentReview.product?.name || "Product Name"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">{renderStars()}</div>
                  <span className="ml-3 text-sm text-gray-600">
                    {rate ? `${rate} out of 5 stars` : "Click to rate"}
                  </span>
                </div>
                {rate && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-yellow-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm font-medium text-yellow-800">
                        {rate === "1" && "Poor - Not satisfied"}
                        {rate === "2" && "Fair - Below expectations"}
                        {rate === "3" && "Good - Meets expectations"}
                        {rate === "4" && "Very Good - Exceeds expectations"}
                        {rate === "5" && "Excellent - Outstanding!"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Review Text Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Review Text <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm resize-none"
                    placeholder="Share your experience with this product... (minimum 10 characters)"
                    required
                    disabled={loading}
                    maxLength={1000}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {text.length}/1000
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {text.length < 10
                      ? `${10 - text.length} more characters needed`
                      : "✓ Minimum length met"}
                  </span>
                  <span className={text.length > 950 ? "text-orange-500" : ""}>
                    {1000 - text.length} characters remaining
                  </span>
                </div>
              </div>

              {/* Review Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Tips for a helpful review:
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Be specific about what you liked or disliked</li>
                      <li>• Mention how the product met your expectations</li>
                      <li>
                        • Include details about quality, value, and usability
                      </li>
                      <li>• Keep it honest and constructive</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    loading || !text.trim() || !rate || text.length < 10
                  }
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating Review...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Update Review
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateReviewForm;
