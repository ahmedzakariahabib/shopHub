"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "../_store/authStore";
import useUserStore from "../_store/useUserStore";

const UsersList = () => {
  const router = useRouter();
  const { users, loading, error, fetchUsers, deleteUser, updateUserStatus } =
    useUserStore();
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
    fetchUsers();
  }, [fetchUsers, stateRole]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const success = await deleteUser(id);
    if (success) {
      fetchUsers();
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      case "moderator":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && !users.length) {
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                Users Management
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
              Browse and manage all registered users in your system
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => router.push("/users/addUser")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Add New User
            </button>
          )}
        </div>

        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Avatar
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td
                      className="px-6 justify-center flex py-4 whitespace-nowrap"
                      onClick={() =>
                        router.push(`/users/userDetails/${user._id}`)
                      }
                    >
                      {user.avatar?.startsWith("http") ? (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() =>
                        router.push(`/users/userDetails/${user._id}`)
                      }
                    >
                      <div className="text-sm text-center font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() =>
                        router.push(`/users/userDetails/${user._id}`)
                      }
                    >
                      <div className="text-sm text-center text-gray-600">
                        {user.email}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-center"
                      onClick={() =>
                        router.push(`/users/userDetails/${user._id}`)
                      }
                    >
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-center"
                      onClick={() =>
                        router.push(`/users/userDetails/${user._id}`)
                      }
                    >
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          user.status || "active"
                        )}`}
                      >
                        {user.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/users/userDetails/${user._id}`);
                          }}
                          className="text-[#16a34a] hover:text-[#65a30d] transition-colors"
                        >
                          Details
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/users/editUser/${user._id}`);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user._id);
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              Delete
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new user.
            </p>
            {isAdmin && (
              <div className="mt-6">
                <button
                  onClick={() => router.push("/users/addUser")}
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
                  New User
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
