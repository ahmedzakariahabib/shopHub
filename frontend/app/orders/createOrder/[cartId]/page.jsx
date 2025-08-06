"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Building,
  CreditCard,
  Truck,
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import useOrderStore from "@/app/_store/useOrderStore";
import useCartStore from "@/app/_store/useCartStore";
import useAuthStore from "@/app/_store/authStore";
import { jwtDecode } from "jwt-decode";

const CreateOrder = () => {
  const router = useRouter();
  const { cartId } = useParams();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const {
    cartItems,
    fetchCart,
    loading: cartLoading,
    getCartTotal,
  } = useCartStore();
  const { role: stateRole } = useAuthStore();

  const totalPriceAfterDiscount = getCartTotal();
  const [isUser, setIsUser] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const CheckIsUser = role === "user" && stateRole === "user";
    setIsUser(CheckIsUser);

    if (!CheckIsUser) {
      router.push("/dashboard");
      return;
    }

    // Fetch cart items to show order summary
    fetchCart();
  }, [stateRole, router, fetchCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCartTotal = () => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      const price =
        item.product?.priceAfterDiscount ||
        item.product?.price ||
        item.price ||
        0;
      return total + price * item.quantity;
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        cartId: cartId,
        shippingAddress: {
          city: formData.city.trim(),
          street: formData.street.trim(),
          phone: formData.phone.trim(),
        },
      };

      const result = await createOrder(orderData, cartId);

      if (result) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Please login to create an order</p>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-[#16a34a]" />
              <h3 className="text-xl font-bold text-gray-800">Create Order</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9">
              Complete your order by providing shipping information
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <button
            onClick={() => router.push("/orders/order")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm bg-[#16a34a] text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            See My Order
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information Form */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Information
              </h4>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* City Field */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Building className="w-4 h-4 inline mr-1" />
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-colors ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                {/* Street Field */}
                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Street Address *
                  </label>
                  <textarea
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-colors resize-none ${
                      errors.street ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your complete street address"
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-colors ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || orderLoading}
                  className="w-full bg-[#16a34a] hover:bg-[#65a30d] text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || orderLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Order Summary
              </h4>

              <div className="bg-gray-50 rounded-lg p-6">
                {/* Cart Items */}
                {cartItems && cartItems.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center py-2"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 capitalize">
                            {item.product?.title || "Product"}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} ×{" "}
                            {formatCurrency(
                              item.product?.priceAfterDiscount ||
                                item.product?.price ||
                                item.price ||
                                0
                            )}
                          </p>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(
                            (item.product?.priceAfterDiscount ||
                              item.product?.price ||
                              item.price ||
                              0) * item.quantity
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No items in cart</p>
                  </div>
                )}

                {/* Order Total */}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(calculateCartTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  {totalPriceAfterDiscount ? (
                    <div className="flex justify-between items-center text-lg font-bold border-t border-gray-300 pt-2">
                      <span>Total After Discount:</span>
                      <span className="text-[#16a34a]">
                        {formatCurrency(totalPriceAfterDiscount)}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* Payment Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Truck className="w-5 h-5" />
                    <span className="font-medium">Payment Method</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Cash on Delivery (COD)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
