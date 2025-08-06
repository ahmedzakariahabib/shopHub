"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Eye,
  Filter,
  Search,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import useOrderStore from "@/app/_store/useOrderStore";
import useAuthStore from "@/app/_store/authStore";
import { jwtDecode } from "jwt-decode";

const AdminOrders = () => {
  const router = useRouter();
  const { orders, loading, fetchOrders, updateOrder } = useOrderStore();
  const { role: stateRole } = useAuthStore();

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [updatingOrder, setUpdatingOrder] = useState(null);

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

    // if (!isUserAdmin) {
    //   router.push("/auth/signin");
    //   return;
    // }

    fetchOrders();
  }, [stateRole, router, fetchOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
    if (status) return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const handleStatusUpdate = async (orderId, field, value) => {
    setUpdatingOrder(orderId);
    // try {
    //   const updateData = { [field]: value };
    //   await updateOrder(orderId, updateData);
    //   await fetchOrders(); // Refresh orders
    // } catch (error) {
    //   console.error("Error updating order:", error);
    // } finally {
    //   setUpdatingOrder(null);
    // }
  };

  const getFilteredAndSortedOrders = () => {
    if (!orders || !Array.isArray(orders)) return [];

    let filteredOrders = orders.filter((order) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.orderItems.some((item) =>
          item.product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "delivered" && order.isDelivered) ||
        (statusFilter === "pending" && !order.isDelivered);

      // Payment filter
      const matchesPayment =
        paymentFilter === "all" ||
        (paymentFilter === "paid" && order.isPaid) ||
        (paymentFilter === "unpaid" && !order.isPaid) ||
        paymentFilter === order.paymentType;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    // Sort orders
    filteredOrders.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return b.totalOrderPrice - a.totalOrderPrice;
        case "lowest":
          return a.totalOrderPrice - b.totalOrderPrice;
        default:
          return 0;
      }
    });

    return filteredOrders;
  };

  const getOrderStats = () => {
    if (!orders || !Array.isArray(orders))
      return {
        total: 0,
        delivered: 0,
        pending: 0,
        paid: 0,
        unpaid: 0,
        totalRevenue: 0,
      };

    return {
      total: orders.length,
      delivered: orders.filter((order) => order.isDelivered).length,
      pending: orders.filter((order) => !order.isDelivered).length,
      paid: orders.filter((order) => order.isPaid).length,
      unpaid: orders.filter((order) => !order.isPaid).length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + order.totalOrderPrice,
        0
      ),
    };
  };

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-600">
            Access denied. Admin privileges required.
          </p>
        </div>
      </div>
    );
  }

  if (loading && (!orders || orders.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  const filteredOrders = getFilteredAndSortedOrders();
  const stats = getOrderStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-[#16a34a]" />
                <h3 className="text-xl font-bold text-gray-800">
                  Order Management
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-600 pl-9">
                Manage and track all customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total Orders</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Delivered</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Paid</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">Unpaid</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.unpaid}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#16a34a]" />
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <p className="text-lg font-bold text-[#16a34a]">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No orders have been placed yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8)}
                        </h4>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.isDelivered
                          )}`}
                        >
                          {getStatusIcon(order.isDelivered)}
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.isPaid
                          )}`}
                        >
                          {getStatusIcon(order.isPaid)}
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {order.shippingAddress.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {order.shippingAddress.phone}
                        </span>
                        <span className="capitalize">
                          Payment: {order.paymentType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 lg:mt-0">
                      <span className="text-2xl font-bold text-[#16a34a]">
                        {formatCurrency(order.totalOrderPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-2 bg-white rounded-lg p-2 text-sm"
                        >
                          {item.product.imgCover && (
                            <Image
                              src={item.product.imgCover}
                              alt={item.product.title}
                              width={32}
                              height={32}
                              className="rounded object-cover"
                            />
                          )}
                          <span className="capitalize">
                            {item.product.title}
                          </span>
                          <span className="text-gray-500">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="flex items-center justify-center bg-white rounded-lg p-2 text-sm text-gray-500">
                          +{order.orderItems.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          order._id,
                          "isDelivered",
                          !order.isDelivered
                        )
                      }
                      disabled={updatingOrder === order._id}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        order.isDelivered
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      } disabled:opacity-50`}
                    >
                      {updatingOrder === order._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mx-auto"></div>
                      ) : order.isDelivered ? (
                        "Mark as Pending"
                      ) : (
                        "Mark as Delivered"
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(order._id, "isPaid", !order.isPaid)
                      }
                      disabled={updatingOrder === order._id}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        order.isPaid
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      } disabled:opacity-50`}
                    >
                      {updatingOrder === order._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mx-auto"></div>
                      ) : order.isPaid ? (
                        "Mark as Unpaid"
                      ) : (
                        "Mark as Paid"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
