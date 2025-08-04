"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Shield,
  MapPin,
  Edit,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import useUserStore from "@/app/_store/useUserStore";
import useAuthStore from "@/app/_store/authStore";
import AddressList from "../_components/address";

const UserSettings = () => {
  const router = useRouter();
  const { currentUser, loading, fetchUser } = useUserStore();
  const { changePassword, role: stateRole } = useAuthStore();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const [isUser, setIsUser] = useState(false);

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
  }, [stateRole]);

  const getDataFromToken = () => {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) return { role: null, userId: null };

      const { token } = JSON.parse(authStorage)?.state || {};
      if (!token) return { role: null, userId: null };

      const decoded = jwtDecode(token);
      return {
        role: decoded?.role || null,
        userId: decoded?.id || decoded?.userId || null,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return { role: null, userId: null };
    }
  };

  useEffect(() => {
    const { userId: tokenUserId } = getDataFromToken();
    setLoggedInUserId(tokenUserId);

    if (tokenUserId) {
      fetchUser(tokenUserId);
    }
  }, [fetchUser, stateRole]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    try {
      const success = await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (success) {
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
      default:
        return <User className="w-4 h-4" />;
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
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-[#16a34a]" />
              <h3 className="text-xl font-bold text-gray-800">My Profile</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 pl-9">
              Your account information
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
            >
              Back
            </button>

            {/* Change Password Button */}
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#65a30d]transition-colors"
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </button>
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="max-w-md mx-auto">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h4>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Old Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          oldPassword: e.target.value,
                        }))
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#16a34a] focus:border-[#16a34a] pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("old")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPasswords.old ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#16a34a] focus:border-[#16a34a] pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#16a34a] focus:border-[#16a34a] pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#16a34a] hover:bg-[#65a30d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setShowPasswords({
                        old: false,
                        new: false,
                        confirm: false,
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

                {/* Name */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
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
              </div>
            </div>

            {/* User Details */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Account Information
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
                      Account Role
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

                  {/* Account Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
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

                  {isUser ? (
                    <AddressList userId={getDataFromToken().userId} />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
