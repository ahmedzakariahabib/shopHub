"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import useCategoryStore from "@/app/_store/useCategoryStore";

const CategoryDetail = ({ params }) => {
  const router = useRouter();
  const { categoryId } = use(params);
  console.log(categoryId);
  const { loading, currentCategory, fetchCategory, deleteCategory } =
    useCategoryStore();

  useEffect(() => {
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await deleteCategory(categoryId);
      if (success) {
        router.push("/categories");
      }
    }
  };

  if (loading && !currentCategory) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Category not found
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Category Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detailed information about the category
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/categories/edit/${categoryId}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            {currentCategory.image ? (
              <div className="relative h-64 w-full rounded-lg overflow-hidden border">
                <Image
                  src={currentCategory.image}
                  alt={currentCategory.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center">
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
              <h2 className="text-2xl font-bold text-gray-800">
                {currentCategory.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Created At
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(currentCategory.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Updated At
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(currentCategory.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
