"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  Star,
  DollarSign,
  Eye,
  Search,
} from "lucide-react";

// Import your actual stores
import useCategoryStore from "../_store/useCategoryStore";
import useBrandStore from "../_store/useBrandStore";
import useProductStore from "../_store/useProductStore";

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Use your actual store hooks
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategoryStore();

  const { brands, loading: brandsLoading, fetchBrands } = useBrandStore();

  const {
    products,
    loading: productsLoading,
    fetchProducts,
  } = useProductStore?.() || {
    products: [],
    loading: false,
    fetchProducts: () => {},
  };

  // Fetch all data when component mounts
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    if (fetchProducts) {
      fetchProducts();
    }
  }, [fetchCategories, fetchBrands, fetchProducts]);

  // Calculate metrics from real API data
  const getMetrics = () => {
    if (!products?.length) {
      return {
        totalProducts: 0,
        totalSold: 0,
        totalStock: 0,
        avgPrice: "0.00",
      };
    }

    const totalProducts = products.length;
    const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
    const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const avgPrice = products.length
      ? products.reduce(
          (sum, p) => sum + (p.priceAfterDiscount || p.price || 0),
          0
        ) / products.length
      : 0;

    return {
      totalProducts,
      totalSold,
      totalStock,
      avgPrice: avgPrice.toFixed(2),
    };
  };

  // Get best selling products from real API data
  const getBestSellers = () => {
    if (!products?.length) return [];

    return products
      .filter((p) => (p.sold || 0) > 0)
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5)
      .map((product) => {
        const category = categories?.find((c) => c._id === product.category);
        return {
          ...product,
          categoryName: category?.name || "Unknown Category",
        };
      });
  };

  // Get low stock items from real API data
  const getLowStock = () => {
    if (!products?.length) return [];

    return products
      .filter((p) => (p.quantity || 0) > 0 && (p.quantity || 0) < 50) // Products with less than 50 in stock
      .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
      .slice(0, 5)
      .map((product) => {
        const category = categories?.find((c) => c._id === product.category);
        return {
          ...product,
          categoryName: category?.name || "Unknown Category",
        };
      });
  };

  // Filter products based on search from real API data
  const getFilteredProducts = () => {
    if (!products?.length) return [];

    let filtered = products;

    if (searchTerm.trim()) {
      filtered = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.slice(0, 8).map((product) => {
      const category = categories?.find((c) => c._id === product.category);
      const brand = brands?.find((b) => b._id === product.brand);
      return {
        ...product,
        categoryName: category?.name || "Unknown Category",
        brandName: brand?.name || "Unknown Brand",
      };
    });
  };

  // Get out of stock count
  const getOutOfStockCount = () => {
    if (!products?.length) return 0;
    return products.filter((p) => (p.quantity || 0) === 0).length;
  };

  // Get on sale count
  const getOnSaleCount = () => {
    if (!products?.length) return 0;
    return products.filter(
      (p) => p.priceAfterDiscount && p.priceAfterDiscount < p.price
    ).length;
  };

  // Get most expensive product price
  const getMostExpensive = () => {
    if (!products?.length) return 0;
    return Math.max(...products.map((p) => p.price || 0));
  };

  const metrics = getMetrics();
  const bestSellers = getBestSellers();
  const lowStock = getLowStock();
  const filteredProducts = getFilteredProducts();
  const outOfStockCount = getOutOfStockCount();
  const onSaleCount = getOnSaleCount();
  const mostExpensive = getMostExpensive();

  // Check if any data is still loading
  const isLoading = categoriesLoading || brandsLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ShopHub Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your store.
            {products?.length > 0 &&
              ` Managing ${products.length} products across ${
                categories?.length || 0
              } categories.`}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalSold}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalStock}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${metrics.avgPrice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Products Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {searchTerm
                ? `Search Results (${filteredProducts.length})`
                : `All Products (${filteredProducts.length})`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1 capitalize">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.categoryName} • {product.brandName}
                      </p>
                    </div>
                    {product.priceAfterDiscount &&
                      product.priceAfterDiscount < product.price && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          Sale
                        </span>
                      )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        {product.priceAfterDiscount &&
                        product.priceAfterDiscount < product.price ? (
                          <>
                            <span className="text-lg font-bold text-gray-900">
                              ${product.priceAfterDiscount}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Stock: {product.quantity || 0} | Sold:{" "}
                        {product.sold || 0}
                      </p>
                    </div>

                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"></button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm
                    ? "No products found matching your search"
                    : "No products available"}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Best Sellers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Best Sellers
                </h3>
              </div>

              <div className="space-y-3">
                {bestSellers.length > 0 ? (
                  bestSellers.map((product, index) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-semibold text-sm mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.categoryName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">
                          {product.sold} sold
                        </p>
                        <p className="text-xs text-gray-500">
                          ${product.priceAfterDiscount || product.price}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No sales data available
                  </p>
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Low Stock Alert
                </h3>
              </div>

              <div className="space-y-3">
                {lowStock.length > 0 ? (
                  lowStock.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.categoryName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-600">
                          {product.quantity} left
                        </p>
                        <p className="text-xs text-gray-500">
                          ${product.priceAfterDiscount || product.price}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    All products well stocked
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Categories
                  </span>
                  <span className="font-semibold text-gray-900">
                    {categories?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Brands</span>
                  <span className="font-semibold text-gray-900">
                    {brands?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Out of Stock</span>
                  <span className="font-semibold text-red-600">
                    {outOfStockCount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">On Sale</span>
                  <span className="font-semibold text-green-600">
                    {onSaleCount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Most Expensive</span>
                  <span className="font-semibold text-gray-900">
                    ${mostExpensive}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
