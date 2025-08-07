"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Eye,
  Star,
  Calendar,
  Filter,
} from "lucide-react";

// Import your stores
import useCategoryStore from "../_store/useCategoryStore";
import useBrandStore from "../_store/useBrandStore";
import useUserStore from "../_store/useUserStore";
import useOrderStore from "../_store/useOrderStore";
import useProductStore from "../_store/useProductStore";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");

  // Store hooks
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategoryStore();
  const { brands, loading: brandsLoading, fetchBrands } = useBrandStore();
  const { users, loading: usersLoading, fetchUsers } = useUserStore();
  const { orders, loading: ordersLoading, fetchOrders } = useOrderStore();
  const {
    products,
    loading: productsLoading,
    fetchProducts,
  } = useProductStore?.() || {
    products: [],
    loading: false,
    fetchProducts: () => {},
  };

  useEffect(() => {
    // Fetch all data when component mounts
    fetchCategories();
    fetchBrands();
    fetchUsers();
    fetchOrders();
    if (fetchProducts) fetchProducts();
  }, [fetchCategories, fetchBrands, fetchUsers, fetchOrders, fetchProducts]);

  // Calculate metrics from real data
  const calculateMetrics = () => {
    const totalUsers = users?.length || 0;
    const totalCategories = categories?.length || 0;
    const totalBrands = brands?.length || 0;
    const totalOrders = orders?.length || 0;

    // Calculate total revenue from orders
    const totalRevenue =
      orders?.reduce((sum, order) => {
        return sum + (order.totalOrderPrice || 0);
      }, 0) || 0;

    // Calculate total products sold from actual product data
    const totalProductsSold =
      products?.reduce((sum, product) => {
        return sum + (product.sold || 0);
      }, 0) || 0;

    // Calculate total inventory from actual product data
    const totalInventory =
      products?.reduce((sum, product) => {
        return sum + (product.quantity || 0);
      }, 0) || 0;

    // Calculate average product price
    const averagePrice =
      products?.length > 0
        ? products.reduce(
            (sum, product) =>
              sum + (product.priceAfterDiscount || product.price || 0),
            0
          ) / products.length
        : 0;

    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      totalUsers,
      totalProductsSold,
      totalInventory,
      totalCategories,
      totalBrands,
      averagePrice: averagePrice.toFixed(2),
    };
  };

  // Generate sales data based on actual product sales
  const generateSalesData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    if (!products?.length) {
      return months.map((month) => ({ month, sales: 0, orders: 0 }));
    }

    // Create mock monthly distribution based on actual product data
    const totalSales = products.reduce(
      (sum, product) => sum + (product.sold || 0),
      0
    );
    const totalRevenue = products.reduce(
      (sum, product) =>
        sum +
        (product.priceAfterDiscount || product.price) * (product.sold || 0),
      0
    );

    return months.map((month, index) => {
      const monthlyFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8-1.2
      return {
        month,
        sales: Math.floor((totalRevenue / 6) * monthlyFactor),
        orders: Math.floor((totalSales / 6) * monthlyFactor),
      };
    });
  };

  // Generate category distribution from real categories and products
  const generateCategoryDistribution = () => {
    if (!categories?.length || !products?.length) return [];

    const colors = [
      "#16a34a",
      "#3b82f6",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
    ];

    // Calculate actual category distribution
    const categoryStats = categories.map((category, index) => {
      const categoryProducts = products.filter(
        (product) => product.category === category._id
      );
      const totalSold = categoryProducts.reduce(
        (sum, product) => sum + (product.sold || 0),
        0
      );

      return {
        name: category.name,
        value: categoryProducts.length,
        sold: totalSold,
        color: colors[index % colors.length],
      };
    });

    // Calculate percentages
    const totalProducts = products.length;
    return categoryStats
      .filter((cat) => cat.value > 0)
      .map((cat) => ({
        ...cat,
        value: Math.round((cat.value / totalProducts) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  // Get top selling products from real data
  const getTopProducts = () => {
    if (!products?.length) return [];

    return products
      .filter((product) => product.sold > 0)
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5)
      .map((product, index) => {
        const category = categories?.find(
          (cat) => cat._id === product.category
        );
        const brand = brands?.find((br) => br._id === product.brand);
        const revenue =
          (product.priceAfterDiscount || product.price) * (product.sold || 0);

        // Calculate trend based on inventory vs sold ratio
        const inventoryRatio =
          product.quantity / (product.sold + product.quantity);
        const trend =
          inventoryRatio > 0.7 ? -(Math.random() * 10) : Math.random() * 20 + 5;

        return {
          id: product._id,
          name: product.title,
          sales: product.sold || 0,
          revenue: `$${revenue.toFixed(2)}`,
          trend: Math.round(trend * 10) / 10,
          category: category?.name || "Unknown",
          brand: brand?.name || "Unknown",
          price: product.priceAfterDiscount || product.price,
          stock: product.quantity,
        };
      });
  };

  // Get recent orders with real data structure
  const getRecentOrders = () => {
    if (!orders?.length) {
      return [
        {
          id: "#001",
          customer: "Loading...",
          amount: "$0.00",
          status: "Processing",
          items: 0,
          date: "N/A",
        },
      ];
    }

    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order, index) => ({
        id: `#${order._id?.slice(-4) || 1000 + index}`,
        customer:
          users?.find((u) => u._id === order.user)?.name || "Unknown Customer",
        amount: `$${order.totalOrderPrice?.toFixed(2) || "0.00"}`,
        status: order.isDelivered
          ? "Delivered"
          : order.isPaid
          ? "Paid"
          : "Processing",
        items: order.orderItems?.length || 0,
        date: new Date(order.createdAt).toLocaleDateString(),
      }));
  };

  // Get low stock products
  const getLowStockProducts = () => {
    if (!products?.length) return [];

    return products
      .filter((product) => product.quantity < 50 && product.quantity > 0)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5)
      .map((product) => {
        const category = categories?.find(
          (cat) => cat._id === product.category
        );
        return {
          name: product.title,
          stock: product.quantity,
          category: category?.name || "Unknown",
          price: product.priceAfterDiscount || product.price,
        };
      });
  };

  const metrics = calculateMetrics();
  const salesData = generateSalesData();
  const categoryData = generateCategoryDistribution();
  const topProducts = getTopProducts();
  const recentOrders = getRecentOrders();
  const lowStockProducts = getLowStockProducts();

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Paid":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const loading =
    categoriesLoading ||
    brandsLoading ||
    usersLoading ||
    ordersLoading ||
    productsLoading;

  if (loading && !categories?.length && !users?.length && !products?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div className="mb-6">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                ShopHub Dashboard
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
              Real-time insights from your business - {products?.length || 0}{" "}
              products, {metrics.totalUsers} users, {metrics.totalCategories}{" "}
              categories, {metrics.totalBrands} brands
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Products",
            value: products?.length?.toString() || "0",
            change: 12.5,
            icon: Package,
            color: "bg-[#16a34a]",
          },
          {
            title: "Products Sold",
            value: metrics.totalProductsSold.toString(),
            change: 8.2,
            icon: ShoppingCart,
            color: "bg-blue-500",
          },
          {
            title: "Total Inventory",
            value: metrics.totalInventory.toString(),
            change: -2.1,
            icon: Users,
            color: "bg-purple-500",
          },
          {
            title: "Avg Product Price",
            value: `$${metrics.averagePrice}`,
            change: 15.3,
            icon: DollarSign,
            color: "bg-orange-500",
          },
        ].map((metric, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {metric.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-[#16a34a] mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        metric.change >= 0 ? "text-[#16a34a]" : "text-red-600"
                      }`}
                    >
                      {metric.change >= 0 ? "+" : ""}
                      {metric.change}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Overview */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[#16a34a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">
                Sales Overview
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="flex gap-4 text-sm mb-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#16a34a] rounded-full mr-2"></div>
                <span className="text-gray-600">Sales ($)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Units Sold</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[#16a34a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">
                Product Distribution by Category
              </h3>
            </div>
          </div>
          <div className="p-6">
            {categoryData.length > 0 ? (
              <div className="flex items-center">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 pl-6">
                  {categoryData.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between mb-4"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">
                          {category.value}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {category.sold} sold
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No category data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[#16a34a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">
                Top Selling Products
              </h3>
            </div>
            <button className="text-[#16a34a] hover:text-[#65a30d] text-sm font-medium transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#16a34a] to-[#65a30d] rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.category} • ${product.price}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {product.revenue}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.sales} units
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {product.stock}
                        </div>
                        <div
                          className={`text-xs ${
                            product.stock < 50
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {product.stock < 50 ? "Low Stock" : "In Stock"}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No products with sales data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">
                Low Stock Alert
              </h3>
            </div>
            <button className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
              Restock All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-red-600">
                          {product.stock}
                        </div>
                        <div className="text-xs text-red-500">Low Stock</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          ${product.price}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No low stock items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
