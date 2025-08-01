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
  }, [subcategoryId]);

  useEffect(() => {
    if (currentSubcategory) {
      setFormData({
        name: currentSubcategory.name || "",
      });
    }
  }, [currentSubcategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSubcategory(subcategoryId, formData.name);
      toast.success("Subcategory updated successfully");
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Edit Subcategory
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Update the details of your subcategory
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Subcategory Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter subcategory name"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Update Subcategory"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubcategory;
