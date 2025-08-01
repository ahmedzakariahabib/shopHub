"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import useSubcategoryStore from "@/app/_store/useSubCategoryStore";

const SubcategoryPage = () => {
  const router = useRouter();
  const { subcategoryId } = useParams();
  const { currentSubcategory, loading, error, fetchSubcategory } =
    useSubcategoryStore();

  useEffect(() => {
    if (subcategoryId) {
      fetchSubcategory(subcategoryId);
    }
  }, [subcategoryId, fetchSubcategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h2 className="font-bold">Error loading subcategory</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push("/subcategories")}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to subcategories
          </button>
        </div>
      </div>
    );
  }

  if (!currentSubcategory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md">
          <h2 className="font-bold">Subcategory not found</h2>
          <p>The requested subcategory could not be found.</p>
          <Link
            href="/subcategories"
            className="mt-2 text-blue-600 hover:text-blue-800 block"
          >
            ← Back to subcategories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${currentSubcategory.name} | Your App Name`}</title>
        <meta
          name="description"
          content={`Details for ${currentSubcategory.name} subcategory`}
        />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/subcategories"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
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
            Back to subcategories
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">{currentSubcategory.name}</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">
                Subcategory Details
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">ID:</span>{" "}
                  {currentSubcategory._id}
                </p>
                <p>
                  <span className="font-medium">Slug:</span>{" "}
                  {currentSubcategory.slug}
                </p>
                <p>
                  <span className="font-medium">Category ID:</span>{" "}
                  {currentSubcategory.category}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Timestamps</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(currentSubcategory.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(currentSubcategory.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubcategoryPage;
