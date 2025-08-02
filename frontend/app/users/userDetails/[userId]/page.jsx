"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Calendar,
  Shield,
  MapPin,
  Phone,
  Edit,
  Trash2,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import useUserStore from "@/app/_store/useUserStore";
import useAuthStore from "@/app/_store/authStore";

const UserDetails = () => {
  const router = useRouter();
  const { userId } = useParams();
  const { currentUser, loading, fetchUser, deleteUser, updateUserStatus } =
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
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser, stateRole]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const success = await deleteUser(userId);
      if (success) {
        router.push("/users");
      }
    }
  };

  if (loading && !currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              User not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The user you're looking for doesn't exist.
            </p>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button
              onClick={() => router.push("/users")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "user":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "moderator":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (isActive, isBlocked) => {
    if (isBlocked) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (isActive) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = (isActive, isBlocked) => {
    if (isBlocked) return "Blocked";
    if (isActive) return "Active";
    return "Inactive";
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "moderator":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">User Details</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9">
              Detailed information about {currentUser.name}
            </p>
          </div>
          {isAdmin ? (
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/users")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => router.push(`/users/editUser/${userId}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/users")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Back
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Avatar and Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                {/* Avatar */}
                <div className="mb-6">
                  {currentUser.profileImage?.startsWith("http") ? (
                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={currentUser.profileImage}
                        alt={currentUser.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Name and Status */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                  {currentUser.name}
                </h2>

                {/* Status Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                      currentUser.isActive,
                      currentUser.isBlocked
                    )}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        currentUser.isBlocked
                          ? "bg-red-500"
                          : currentUser.isActive
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    {getStatusText(currentUser.isActive, currentUser.isBlocked)}
                  </span>
                </div>

                {/* Role Badge */}
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                      currentUser.role
                    )}`}
                  >
                    {getRoleIcon(currentUser.role)}
                    <span className="ml-2 capitalize">{currentUser.role}</span>
                  </span>
                </div>

                {/* Join Date */}
                <div className="text-sm text-gray-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Joined {formatDate(currentUser.createdAt)}
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  User Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </label>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {currentUser.email}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Full Name
                    </label>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md capitalize">
                      {currentUser.name}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      User Role
                    </label>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getRoleBadgeColor(
                          currentUser.role
                        )}`}
                      >
                        {getRoleIcon(currentUser.role)}
                        <span className="ml-2 capitalize">
                          {currentUser.role}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Account Status
                    </label>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getStatusBadgeColor(
                          currentUser.isActive,
                          currentUser.isBlocked
                        )}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            currentUser.isBlocked
                              ? "bg-red-500"
                              : currentUser.isActive
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        {getStatusText(
                          currentUser.isActive,
                          currentUser.isBlocked
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Email Verification */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Verified
                    </label>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                          currentUser.confirmEmail
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            currentUser.confirmEmail
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        {currentUser.confirmEmail ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>

                  {/* Blocked Status */}
                  {currentUser.isBlocked && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 flex items-center">
                        <UserX className="w-4 h-4 mr-2" />
                        Account Blocked
                      </label>
                      <div className="text-gray-900 bg-red-50 p-3 rounded-md border border-red-200">
                        <span className="text-red-800 font-medium">
                          This account has been blocked
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Password Last Changed */}
                  {currentUser.passwordChangedAt && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Password Last Changed
                      </label>
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {formatDate(currentUser.passwordChangedAt)}
                      </div>
                    </div>
                  )}

                  {/* Wishlist Count */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Wishlist Items
                    </label>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {currentUser.wishlist?.length || 0} items
                    </div>
                  </div>

                  {/* Addresses Count */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Saved Addresses
                    </label>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {currentUser.addresses?.length || 0} addresses
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Account Created
                    </label>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {formatDate(currentUser.createdAt)}
                    </div>
                  </div>

                  {/* Last Updated */}
                  {currentUser.updatedAt && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Last Updated
                      </label>
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {formatDate(currentUser.updatedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {currentUser.wishlist?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Statistics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentUser.wishlist?.length || 0}
                      </div>
                      <div className="text-sm text-blue-800">
                        Wishlist Items
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {currentUser.addresses?.length || 0}
                      </div>
                      <div className="text-sm text-green-800">
                        Saved Addresses
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {currentUser.confirmEmail ? "✓" : "✗"}
                      </div>
                      <div className="text-sm text-purple-800">
                        Email Verified
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
