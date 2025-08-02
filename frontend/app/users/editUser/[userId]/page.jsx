"use client";
import { useState, useEffect } from "react";
import useAuthStore from "@/app/_store/authStore";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import useUserStore from "@/app/_store/useUserStore";

const EyeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeSlashIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

// User Edit Icon
const UserEditIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="w-8 h-8 border-4 border-[#bbf7d0] border-t-[#16a34a] rounded-full animate-spin"></div>
  </div>
);

export default function EditUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { updateUser, fetchUser, currentUser, loading } = useUserStore();
  const router = useRouter();
  const { userId } = useParams();

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setRole(currentUser.role || "user");

      setPassword(currentUser.password);
      setRePassword(currentUser.password);
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Validate password match if password is being changed
    if (password && password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    const userData = {
      name,
      email,
      role,
    };

    if (password) {
      userData.password = password;
      userData.rePassword = rePassword;
    }

    try {
      const success = await updateUser(userId, userData);
      if (success) {
        router.push("/users");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Show loading spinner while fetching data
  if (isLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Loading User Data...
                </h2>
                <LoadingSpinner />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user not found
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-8 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                User Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The requested user could not be found.
              </p>
              <button
                onClick={handleGoBack}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <UserEditIcon />
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                      Edit User
                    </h1>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 pl-9 border-l-2 border-[#16a34a]">
                    Update user account information and settings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm"
                    placeholder="Enter user's full name"
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm"
                    placeholder="Enter user's email address"
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
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  User Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm"
                  required
                  disabled={loading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password Input (optional for updates) */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                  <span className="text-xs text-gray-500 ml-2">
                    (Leave blank to keep current password)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input (only shown if password is being changed) */}
              {password && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRePassword ? "text" : "password"}
                      value={rePassword}
                      onChange={(e) => setRePassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors bg-white shadow-sm"
                      placeholder="Confirm new password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRePassword(!showRePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showRePassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/users")}
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
                      Updating User...
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
                      Update User
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
}
