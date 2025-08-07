"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import useCategoryStore from "@/app/_store/useCategoryStore";

const CreateCategoryForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const imageInputRef = useRef(null);
  const { loading, createCategory } = useCategoryStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageFile = imageInputRef.current?.files?.[0];

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const success = await createCategory(name, imageFile);
    // if (success) {
    //   router.push("/dashboard");
    // }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto px-4   sm:px-6 lg:px-8 py-8">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                      Create New Category
                    </h1>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
                    Add a new category to organize your products in the store
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Name Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm"
                    placeholder="Enter category name"
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Category Image
                  <span className="text-xs text-gray-500 ml-2">
                    (Optional - Max 2MB)
                  </span>
                </label>

                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-[#16a34a] transition-colors group">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={loading}
                    />
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 text-gray-400 group-hover:text-[#16a34a] transition-colors mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-[#16a34a] transition-colors">
                          {imagePreview ? "Change image" : "Upload an image"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 2MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Preview:
                    </p>
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                        <Image
                          src={imagePreview}
                          alt="Category preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
                  disabled={loading}
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
                      Creating Category...
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Category
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

export default CreateCategoryForm;
