"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import useCouponStore from "@/app/_store/useCouponStore";

const EditCouponForm = () => {
  const router = useRouter();
  const { couponId: id } = useParams();
  const [code, setCode] = useState("");
  const [expires, setExpires] = useState("");
  const [discount, setDiscount] = useState("");

  const { loading, currentCoupon, fetchCoupon, updateCoupon } =
    useCouponStore();

  useEffect(() => {
    if (id) {
      fetchCoupon(id);
    }
  }, [id, fetchCoupon]);

  useEffect(() => {
    if (currentCoupon) {
      setCode(currentCoupon.code);
      // Convert ISO date string to YYYY-MM-DD format for date input
      if (currentCoupon.expires) {
        const date = new Date(currentCoupon.expires);
        const formattedDate = date.toISOString().split("T")[0];
        setExpires(formattedDate);
      }
      setDiscount(currentCoupon.discount.toString());
    }
  }, [currentCoupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    if (!expires) {
      toast.error("Expiry date is required");
      return;
    }

    if (!discount || discount <= 0) {
      toast.error("Discount amount must be greater than 0");
      return;
    }

    const success = await updateCoupon(id, {
      code: code.trim().toUpperCase(),
      expires,
      discount: parseInt(discount),
    });

    if (success) {
      router.push("/coupons");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    return date < today;
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
                      Update Coupon
                    </h1>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
                    Modify the coupon details and settings below
                  </p>
                </div>
              </div>
              {/* Status Badge */}
              {expires && (
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isExpired(expires)
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {isExpired(expires) ? "Expired" : "Active"}
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Coupon Code Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm font-mono"
                    placeholder="Enter coupon code"
                    required
                    disabled={loading}
                    maxLength={20}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expiry Date Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date <span className="text-red-500">*</span>
                  {expires && (
                    <span
                      className={`text-xs ml-2 ${
                        isExpired(expires) ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      ({isExpired(expires) ? "Expired on" : "Expires on"}{" "}
                      {formatExpiryDate(expires)})
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={expires}
                    onChange={(e) => setExpires(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm ${
                      isExpired(expires) ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                    disabled={loading}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className={`h-5 w-5 ${
                        isExpired(expires) ? "text-red-400" : "text-gray-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                {isExpired(expires) && (
                  <p className="text-sm text-red-600">
                    ⚠️ This coupon has expired. Please set a future date to
                    reactivate it.
                  </p>
                )}
              </div>

              {/* Discount Amount Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Discount Amount <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    (in currency units)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm"
                    placeholder="Enter discount amount"
                    required
                    disabled={loading}
                    min="1"
                    step="1"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Current Coupon Preview */}
              {currentCoupon && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Current Coupon:
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-blue-300">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800 font-mono">
                        {currentCoupon.code}
                      </div>
                      <div
                        className={`text-sm mt-1 ${
                          isExpired(currentCoupon.expires)
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        Expires: {formatExpiryDate(currentCoupon.expires)}
                        {isExpired(currentCoupon.expires) && " (EXPIRED)"}
                      </div>
                      <div className="text-sm text-blue-600 font-medium mt-1">
                        Discount: {currentCoupon.discount} units
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Updated Coupon Preview */}
              {(code !== currentCoupon?.code ||
                expires !== currentCoupon?.expires ||
                discount !== currentCoupon?.discount?.toString()) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Updated Preview:
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-green-300">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800 font-mono">
                        {code || "COUPON_CODE"}
                      </div>
                      <div
                        className={`text-sm mt-1 ${
                          isExpired(expires) ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        Expires: {formatExpiryDate(expires)}
                        {isExpired(expires) && " (EXPIRED)"}
                      </div>
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Discount: {discount || "0"} units
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/coupons")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
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
                      Updating Coupon...
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
                      Update Coupon
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

export default EditCouponForm;
