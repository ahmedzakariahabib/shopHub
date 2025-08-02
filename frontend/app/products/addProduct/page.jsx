"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, DollarSign, Package, Tag, ImageIcon } from "lucide-react";

import useCategoryStore from "@/app/_store/useCategoryStore";
import useSubcategoryStore from "@/app/_store/useSubCategoryStore";
import useBrandStore from "@/app/_store/useBrandStore";
import useProductStore from "@/app/_store/useProductStore";

const AddProduct = () => {
  const router = useRouter();
  const { createProduct, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { subcategories, fetchSubcategories } = useSubcategoryStore();
  const { brands, fetchBrands } = useBrandStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    priceAfterDiscount: "",
    brand: "",
    category: "",
    subcategory: "",
  });

  const [imgCover, setImgCover] = useState(null);
  const [images, setImages] = useState([]);
  const [imgCoverPreview, setImgCoverPreview] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category.toString());
    }
  }, [fetchSubcategories, formData.category]);

  console.log(subcategories);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImgCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          imgCover: "Image size should be less than 5MB",
        }));
        return;
      }

      setImgCover(file);
      setImgCoverPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, imgCover: "" }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setErrors((prev) => ({ ...prev, images: "Maximum 5 images allowed" }));
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: "Each image should be less than 5MB",
        }));
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagesPreview((prev) => [...prev, ...newPreviews]);
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImgCover = () => {
    setImgCover(null);
    setImgCoverPreview("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (formData.price && formData.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory)
      newErrors.subcategory = "Subcategory is required";

    if (formData.priceAfterDiscount) {
      if (formData.priceAfterDiscount <= 0) {
        newErrors.priceAfterDiscount = "Discount price must be greater than 0";
      } else if (
        parseFloat(formData.priceAfterDiscount) >= parseFloat(formData.price)
      ) {
        newErrors.priceAfterDiscount =
          "Discount price must be less than regular price";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      priceAfterDiscount: formData.priceAfterDiscount
        ? parseFloat(formData.priceAfterDiscount)
        : null,
    };

    const result = await createProduct(productData, images, imgCover);

    if (result) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-[#16a34a]" />
            <h3 className="text-xl font-bold text-gray-800">Add New Product</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600 pl-9">
            Create a new product for your store
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brand *
              </label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] ${
                  errors.brand ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subcategory *
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                disabled={!formData.category}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.subcategory ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subcategory}
                </p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price * ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="priceAfterDiscount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sale Price ($)
                <span className="text-gray-500 text-xs ml-1">(optional)</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  id="priceAfterDiscount"
                  name="priceAfterDiscount"
                  min="0"
                  step="0.01"
                  value={formData.priceAfterDiscount}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] ${
                    errors.priceAfterDiscount
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.priceAfterDiscount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.priceAfterDiscount}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
                <span className="text-gray-500 text-xs ml-1">
                  (recommended)
                </span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#16a34a] transition-colors">
                <div className="space-y-1 text-center">
                  {imgCoverPreview ? (
                    <div className="relative">
                      <Image
                        src={imgCoverPreview}
                        alt="Cover preview"
                        width={200}
                        height={200}
                        className="mx-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removeImgCover}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="imgCover"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#16a34a] hover:text-[#65a30d] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#16a34a]"
                        >
                          <span>Upload cover image</span>
                          <input
                            id="imgCover"
                            name="imgCover"
                            type="file"
                            accept="image/*"
                            onChange={handleImgCoverChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              {errors.imgCover && (
                <p className="mt-1 text-sm text-red-600">{errors.imgCover}</p>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images
                <span className="text-gray-500 text-xs ml-1">
                  (max 5 images)
                </span>
              </label>

              {imagesPreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {imagesPreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#16a34a] transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#16a34a] hover:text-[#65a30d] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#16a34a]"
                    >
                      <span>Upload additional images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
