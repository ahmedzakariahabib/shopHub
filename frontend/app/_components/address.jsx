"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import useAddressStore from "../_store/useAddressStore";
import useAuthStore from "../_store/authStore";
import useUserStore from "../_store/useUserStore";

const AddressList = ({ userId }) => {
  const router = useRouter();
  const { addresses, loading, error, fetchAddresses, deleteAddress } =
    useAddressStore();
  const { fetchUser } = useUserStore();
  const [isUser, setIsUser] = useState(false);
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
    const checkIsUser = role === "user" && stateRole === "user";
    setIsUser(checkIsUser);
    fetchAddresses();
  }, [fetchAddresses, stateRole]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    const success = await deleteAddress(id);
    if (success) {
      fetchAddresses();
      if (userId) {
        fetchUser(userId);
      }
    }
  };

  // Add debugging to check address data
  useEffect(() => {
    console.log("Addresses data:", addresses);
    if (addresses?.length > 0) {
      console.log(
        "Address IDs:",
        addresses.map((addr) => addr._id)
      );
    }
  }, [addresses]);

  if (loading && !addresses?.length) {
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

  // Ensure addresses is an array and filter out any invalid entries
  const validAddresses = Array.isArray(addresses)
    ? addresses.filter((address) => address && (address._id || address.id))
    : [];

  return (
    <div className=" md:w-[600px] px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {validAddresses.length > 0 ? (
          <div className="px-6 py-5 border-b gap-4 border-gray-200 flex justify-between items-center">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                  User Addresses
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
                Browse and manage all user addresses in the system
              </p>
            </div>
            {isUser && (
              <button
                onClick={() => router.push("/address")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
              >
                Add New Address
              </button>
            )}
          </div>
        ) : (
          ""
        )}

        {validAddresses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Street
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validAddresses.map((address, index) => {
                  // Use _id if available, otherwise fall back to id or index
                  const uniqueKey =
                    address._id || address.id || `address-${index}`;
                  const addressId = address._id || address.id;

                  return (
                    <tr
                      key={uniqueKey}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {address.street || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {address.city || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {address.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4 justify-center">
                          {addressId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(addressId);
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">
                No addresses found
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500 leading-relaxed">
                Get started by creating a new address.
              </p>
              {isUser && (
                <div className="mt-6 sm:mt-8">
                  <button
                    onClick={() => router.push("/address")}
                    className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent shadow-sm text-sm sm:text-base font-medium rounded-md text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
                  >
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5"
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
                    <span className="whitespace-nowrap">New Address</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressList;
