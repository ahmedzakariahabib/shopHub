"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";

import { jwtDecode } from "jwt-decode";
import useAuthStore from "@/app/_store/authStore";
import useOrderStore from "@/app/_store/useOrderStore";

const OrderDetail = () => {
  const router = useRouter();

  const { currentOrder, loading, fetchOrder } = useOrderStore();
  const { role: stateRole } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  console.log(currentOrder);

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
    const CheckIsUser = role === "user" && stateRole === "user";
    setIsAdmin(isUserAdmin);
    setIsUser(CheckIsUser);

    fetchOrder();
  }, [fetchOrder, stateRole]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    if (status) return "text-green-600 bg-green-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusIcon = (status) => {
    if (status) return <CheckCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  const calculateItemTotal = (item) => {
    return item.quantity * item.price;
  };

  if (loading && !currentOrder) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Order not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The order you're looking for doesn't exist.
            </p>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button
              onClick={() => router.push("/orders")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-[#16a34a]" />
              <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9">
              Order ID: {currentOrder._id}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="p-6">
          {/* Order Status and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Order Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Status
              </h4>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  currentOrder.isDelivered
                )}`}
              >
                {getStatusIcon(currentOrder.isDelivered)}
                {currentOrder.isDelivered ? "Delivered" : "Pending Delivery"}
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Status
              </h4>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  currentOrder.isPaid
                )}`}
              >
                {getStatusIcon(currentOrder.isPaid)}
                {currentOrder.isPaid ? "Paid" : "Unpaid"}
              </div>
              <p className="text-sm text-gray-600 mt-2 capitalize">
                Payment Method: {currentOrder.paymentType}
              </p>
            </div>

            {/* Order Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Order Date
              </h4>
              <p className="text-gray-700">
                {formatDate(currentOrder.createdAt)}
              </p>
              {currentOrder.updatedAt !== currentOrder.createdAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Updated: {formatDate(currentOrder.updatedAt)}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Street Address</p>
                <p className="text-gray-900 font-medium">
                  {currentOrder.shippingAddress.street}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="text-gray-900 font-medium">
                  {currentOrder.shippingAddress.city}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </p>
                <p className="text-gray-900 font-medium">
                  {currentOrder.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Order Items ({currentOrder.orderItems.length})
            </h4>
            <div className="space-y-4">
              {currentOrder.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product.imgCover ? (
                          <Image
                            src={item.product.imgCover}
                            alt={item.product.title}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-lg font-medium text-gray-900 capitalize">
                            {item.product.title}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1 capitalize">
                            {item.product.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                              Quantity:{" "}
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </span>
                            <span className="text-sm text-gray-600">
                              Unit Price:{" "}
                              <span className="font-medium">
                                {formatCurrency(item.price)}
                              </span>
                            </span>
                            {item.product.priceAfterDiscount <
                              item.product.price && (
                              <span className="text-sm text-green-600">
                                Sale Price:{" "}
                                <span className="font-medium">
                                  {formatCurrency(
                                    item.product.priceAfterDiscount
                                  )}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#16a34a]">
                            {formatCurrency(calculateItemTotal(item))}
                          </p>
                          <p className="text-sm text-gray-500">Total</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Order Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Items Total:</span>
                <span className="font-medium">
                  {formatCurrency(
                    currentOrder.orderItems.reduce(
                      (total, item) => total + calculateItemTotal(item),
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-[#16a34a]">
                    {formatCurrency(currentOrder.totalOrderPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons for Admin */}
          {isAdmin && (
            <div className="mt-8 flex gap-4 justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Mark as Delivered
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Mark as Paid
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
