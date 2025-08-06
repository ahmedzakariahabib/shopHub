"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import useCategoryStore from "../_store/useCategoryStore";
import useAuthStore from "../_store/authStore";
import { Edit, Eye, Trash2 } from "lucide-react";

const CategoriesList = () => {
  const router = useRouter();
  const { categories, loading, error, fetchCategories, deleteCategory } =
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
    fetchCategories();
  }, [fetchCategories, stateRole]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    const success = await deleteCategory(id);
    if (success) {
      fetchCategories();
    }
  };

  if (loading && !categories.length) {
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
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                Product Categories
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
              Browse and manage all available product categories in your store
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => router.push("/categories/addCategory")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Add New Category
            </button>
          )}
        </div>

        {categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td
                      className="px-6 justify-center flex  py-4 whitespace-nowrap"
                      onClick={() =>
                        router.push(`/subcategories/${category._id}`)
                      }
                    >
                      {category.image?.startsWith("http") ? (
                        <div className="relative  h-10 w-10 rounded-md overflow-hidden">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-gray-400"
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
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() =>
                        router.push(`/subcategories/${category._id}`)
                      }
                    >
                      <div className="text-sm text-center font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4  items-center justify-center   ">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/categories/categoriesDetails/${category._id}`
                            );
                          }}
                          className="text-[#16a34a] flex gap-2 items-center  hover:text-[#65a30d] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <h2>Details</h2>
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/categories/editCategory/${category._id}`
                                );
                              }}
                              className="text-blue-600  flex gap-2 items-center hover:text-blue-800 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              <h2> Edit</h2>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(category._id);
                              }}
                              className="text-red-600 flex gap-2 items-center hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" /> <h2>Delete</h2>
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
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No categories found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new category.
            </p>
            {isAdmin && (
              <div className="mt-6">
                <button
                  onClick={() => router.push("/categories/addCategory")}
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
                  New Category
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;
