"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSubcategoryStore from "@/app/_store/useSubCategoryStore";

const EditSubcategory = () => {
  const router = useRouter();
  const { subcategoryId } = useParams();
  const { loading, updateSubcategory, fetchSubcategory, currentSubcategory } =
    useSubcategoryStore();

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (subcategoryId) {
      fetchSubcategory(subcategoryId);
    }
  }, [subcategoryId, fetchSubcategory]);

  useEffect(() => {
    if (currentSubcategory) {
      setFormData({
        name: currentSubcategory.name || "",
      });
    }
  }, [currentSubcategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Subcategory name is required");
      return;
    }

    try {
      const success = await updateSubcategory(subcategoryId, formData.name);
      if (success) {
        toast.success("Subcategory updated successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update subcategory");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
                  disabled={loading}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                      Update Subcategory
                    </h1>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
                    Modify the subcategory details and settings below
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            {/* Loading State */}
            {!currentSubcategory && !loading && (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Subcategory Name Input */}
              <div className="space-y-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm"
                    placeholder="Enter subcategory name"
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Choose a descriptive name that clearly identifies this
                  subcategory
                </p>
              </div>

              {/* Preview Section */}
              {formData.name && currentSubcategory && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Preview
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-[#16a34a] rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {formData.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentSubcategory.category
                            ? `Under "${currentSubcategory.category.name}" category`
                            : "Subcategory"}
                        </p>
                      </div>
                      {formData.name !== currentSubcategory.name && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Modified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !currentSubcategory}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating Subcategory...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Update Subcategory
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSubcategory;
