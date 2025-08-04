"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

import {
  Edit,
  Trash2,
  Percent,
  Calendar,
  Gift,
  X,
  Save,
  Copy,
  Check,
  Clock,
  AlertCircle,
  ArrowLeft,
  ShoppingCart,
  Users,
  Eye,
} from "lucide-react";
import useCouponStore from "@/app/_store/useCouponStore";
import useAuthStore from "@/app/_store/authStore";

const CouponDetails = () => {
  const router = useRouter();
  const { couponId } = useParams();

  const {
    currentCoupon,
    loading,
    error,
    fetchCoupon,
    updateCoupon,
    deleteCoupon,
    clearCurrentCoupon,
  } = useCouponStore();

  const [isAdmin, setIsAdmin] = useState(false);
  const { role: stateRole } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expires: "",
    type: "percentage",
    minOrderAmount: "",
    usageLimit: "",
    description: "",
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

  useEffect(() => {
    const role = getRoleFromToken();
    const isUserAdmin = role === "admin" && stateRole === "admin";
    setIsAdmin(isUserAdmin);
  }, [stateRole]);

  // Fetch coupon data when component mounts or couponId changes
  useEffect(() => {
    if (couponId) {
      fetchCoupon(couponId);
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentCoupon();
    };
  }, [couponId, fetchCoupon, clearCurrentCoupon]);

  // Populate form when currentCoupon changes
  useEffect(() => {
    if (currentCoupon) {
      setFormData({
        code: currentCoupon.code || "",
        discount: currentCoupon.discount || "",
        expires: currentCoupon.expires
          ? new Date(currentCoupon.expires).toISOString().split("T")[0]
          : "",
        type: currentCoupon.discount <= 100 ? "percentage" : "fixed",
        minOrderAmount: currentCoupon.minOrderAmount || "",
        usageLimit: currentCoupon.usageLimit || "",
        description: currentCoupon.description || "",
      });
    }
  }, [currentCoupon]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discount: parseFloat(formData.discount),
        expires: new Date(formData.expires).toISOString(),
        minOrderAmount: formData.minOrderAmount
          ? parseFloat(formData.minOrderAmount)
          : undefined,
        usageLimit: formData.usageLimit
          ? parseInt(formData.usageLimit)
          : undefined,
        description: formData.description,
      };

      const updatedCoupon = await updateCoupon(couponId, couponData);
      if (updatedCoupon) {
        setIsEditing(false);
        toast.success("Coupon updated successfully");
        // Refresh the coupon data
        fetchCoupon(couponId);
      }
    } catch (error) {
      toast.error("Failed to update coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete coupon "${currentCoupon?.code}"?`
      )
    )
      return;

    const success = await deleteCoupon(couponId);
    if (success) {
      router.push("/coupons"); // Redirect to coupons list
    }
  };

  const handleCancel = () => {
    if (currentCoupon) {
      setFormData({
        code: currentCoupon.code || "",
        discount: currentCoupon.discount || "",
        expires: currentCoupon.expires
          ? new Date(currentCoupon.expires).toISOString().split("T")[0]
          : "",
        type: currentCoupon.discount <= 100 ? "percentage" : "fixed",
        minOrderAmount: currentCoupon.minOrderAmount || "",
        usageLimit: currentCoupon.usageLimit || "",
        description: currentCoupon.description || "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const getDiscountDisplay = (discount) => {
    if (discount <= 100) {
      return `${discount}%`;
    }
    return `$${discount}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Coupon code copied to clipboard!");
  };

  const getStatusInfo = () => {
    if (!currentCoupon) return null;

    const expired = isExpired(currentCoupon.expires);
    const expiresIn = Math.ceil(
      (new Date(currentCoupon.expires) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (expired) {
      return {
        status: "Expired",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <AlertCircle className="w-5 h-5" />,
        message: "This coupon has expired and can no longer be used",
      };
    } else if (expiresIn <= 7) {
      return {
        status: "Expiring Soon",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="w-5 h-5" />,
        message: `This coupon expires in ${expiresIn} day${
          expiresIn === 1 ? "" : "s"
        }`,
      };
    } else {
      return {
        status: "Active",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <Check className="w-5 h-5" />,
        message: `This coupon is active and expires in ${expiresIn} days`,
      };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => router.push("/coupons")}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Back to Coupons
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No coupon found
  if (!currentCoupon) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Gift className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Coupon not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The coupon you're looking for doesn't exist or has been deleted.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/coupons")}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              <ArrowLeft className="-ml-1 mr-2 h-5 w-5" />
              Back to Coupons
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/coupons")}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Coupon Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage coupon information
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      router.push(`/coupons/editCoupon/${couponId}`)
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Coupon
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Coupon Header */}
        <div className="bg-gradient-to-r from-[#16a34a] to-[#65a30d] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Gift className="w-8 h-8 text-white" />
              {isEditing ? (
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg font-mono font-bold text-2xl tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Coupon Code"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <h2 className="text-white font-mono font-bold text-3xl tracking-wider">
                    {currentCoupon.code}
                  </h2>
                  <button
                    onClick={() => copyToClipboard(currentCoupon.code)}
                    className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
                    title="Copy coupon code"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {statusInfo && (
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusInfo.color}`}
              >
                {statusInfo.icon}
                <span className="ml-2">{statusInfo.status}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Status Message */}
          {statusInfo && (
            <div className={`p-4 rounded-lg border mb-8 ${statusInfo.color}`}>
              <div className="flex items-center">
                {statusInfo.icon}
                <p className="ml-3 text-sm font-medium">{statusInfo.message}</p>
              </div>
            </div>
          )}

          {/* Main Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Discount */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Discount Value
              </label>
              {isEditing ? (
                <div className="flex">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent text-lg"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent text-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
              ) : (
                <div className="flex items-center text-4xl font-bold text-gray-900">
                  <Percent className="w-8 h-8 mr-3 text-[#16a34a]" />
                  {getDiscountDisplay(currentCoupon.discount)}
                </div>
              )}
            </div>

            {/* Expiration */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Expiration Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="expires"
                  value={formData.expires}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent text-lg"
                />
              ) : (
                <div className="flex items-center text-xl text-gray-900">
                  <Calendar className="w-6 h-6 mr-3 text-gray-500" />
                  {formatDate(currentCoupon.expires)}
                </div>
              )}
            </div>

            {/* Min Order Amount */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Minimum Order Amount
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent text-lg"
                  placeholder="No minimum"
                  min="0"
                  step="0.01"
                />
              ) : (
                <div className="flex items-center text-xl text-gray-900">
                  <ShoppingCart className="w-6 h-6 mr-3 text-gray-500" />
                  {currentCoupon.minOrderAmount
                    ? `$${currentCoupon.minOrderAmount}`
                    : "No minimum required"}
                </div>
              )}
            </div>

            {/* Usage Limit */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Usage Limit
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent text-lg"
                  placeholder="Unlimited"
                  min="1"
                />
              ) : (
                <div className="flex items-center text-xl text-gray-900">
                  <Users className="w-6 h-6 mr-3 text-gray-500" />
                  {currentCoupon.usageLimit
                    ? `${currentCoupon.usageLimit} uses maximum`
                    : "Unlimited uses"}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {(isEditing || currentCoupon.description) && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Description
              </label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent text-lg"
                  placeholder="Optional description or terms and conditions"
                />
              ) : (
                <div className="text-lg text-gray-700">
                  {currentCoupon.description || "No description provided"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponDetails;
