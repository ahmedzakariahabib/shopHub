"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useCategoryStore from "@/app/_store/useCategoryStore";
import useAuthStore from "@/app/_store/authStore";
import { jwtDecode } from "jwt-decode";

const CategoryDetail = ({ params }) => {
  const router = useRouter();
  const { categoryId } = use(params);
  const { loading, currentCategory, fetchCategory, deleteCategory } =
    useCategoryStore();

  const [isAdmin, setIsAdmin] = useState(false);
  const { role: stateRole } = useAuthStore();

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
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory, stateRole]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await deleteCategory(categoryId);
      if (success) {
        router.push("/dashboard");
      }
    }
  };

  if (loading && !currentCategory) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Category not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The category you're looking for doesn't exist.
            </p>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Back to Categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">
                Category Details
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9">
              Detailed information about {currentCategory.name}
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
                  router.push(`/categories/editCategory/${categoryId}`)
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

        <div className="px-6 py-5">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              {currentCategory.image ? (
                <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={currentCategory.image}
                    alt={currentCategory.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 w-full rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg
                    className="h-20 w-20 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>

            <div className="w-full md:w-2/3">
              <div className="mb-6">
                <h2 className="text-2xl text-center mt-20 font-bold text-gray-800">
                  {currentCategory.name}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
