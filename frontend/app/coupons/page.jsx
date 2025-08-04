"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import useCouponStore from "../_store/useCouponStore";
import useAuthStore from "../_store/authStore";
import { Edit, Eye, Trash2, Percent, Calendar, Gift } from "lucide-react";

const CouponsList = () => {
  const router = useRouter();
  const { coupons, loading, error, fetchCoupons, deleteCoupon } =
    useCouponStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const { role: stateRole } = useAuthStore();

  console.log(coupons);

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
    fetchCoupons();
  }, [fetchCoupons, stateRole]);

  const handleDelete = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const success = await deleteCoupon(couponId);
      if (success) {
        fetchCoupons();
      }
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const getDiscountDisplay = (discount) => {
    // Assuming discount is percentage if <= 100, otherwise fixed amount
    if (discount <= 100) {
      return `${discount}%`;
    }
    return `$${discount}`;
  };

  if (loading && !coupons.length) {
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
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-[#16a34a]" />
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                Coupons
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
              Manage discount coupons and promotional codes
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => router.push("/coupons/addCoupon")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Add New Coupon
            </button>
          )}
        </div>

        {coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="bg-gradient-to-r from-[#16a34a] to-[#65a30d] text-white px-3 py-1 rounded-md font-mono font-semibold text-sm tracking-wider">
                          {coupon.code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center text-lg font-semibold text-gray-900">
                          <Percent className="w-4 h-4 mr-1 text-[#16a34a]" />
                          {getDiscountDisplay(coupon.discount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                          {formatDate(coupon.expires)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {isExpired(coupon.expires) ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4 justify-center">
                        <button
                          onClick={() =>
                            router.push(`/coupons/couponDetails/${coupon._id}`)
                          }
                          className="text-[#16a34a] hover:text-[#65a30d] transition-colors flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() =>
                                router.push(`/coupons/editCoupon/${coupon._id}`)
                              }
                              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(coupon._id)}
                              className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Gift className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No coupons found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new coupon.
            </p>
            {isAdmin && (
              <div className="mt-6">
                <button
                  onClick={() => router.push("/coupons/addCoupon")}
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
                  New Coupon
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsList;
