"use client";
import { useState } from "react";
import useAuthStore from "@/app/_store/authStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/_store/useUserStore";

// Eye icons for password visibility
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

// User Plus Icon for admin operations
const UserPlusIcon = () => (
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
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
);

export default function AddUserForm({ onClose, onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const { createUser, loading } = useUserStore();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    const userData = {
      name,
      email,
      password,
      rePassword,
      role,
    };

    const success = await createUser(userData);
    if (success) {
      setName("");
      setEmail("");
      setPassword("");
      setRePassword("");
      setRole("");

      router.push("/users");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#dcfce7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#16a34a] rounded-full mb-3">
            <UserPlusIcon />
          </div>
          <h1 className="text-2xl font-bold text-[#052e16] mb-1">
            Add New User
          </h1>
          <p className="text-sm text-[#365314]">
            Create a new user account for the system
          </p>
        </div>

        {/* Add User Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#dcfce7] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#1a2e05] mb-2"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-[#1a2e05] bg-white border border-[#bbf7d0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all duration-200 placeholder-[#84cc16]"
                placeholder="Enter user's full name"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1a2e05] mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-[#1a2e05] bg-white border border-[#bbf7d0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all duration-200 placeholder-[#84cc16]"
                placeholder="Enter user's email address"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-[#1a2e05] mb-2"
              >
                User Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-[#1a2e05] bg-white border border-[#bbf7d0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all duration-200"
                required
              >
                <option>Select User Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1a2e05] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-[#1a2e05] bg-white border border-[#bbf7d0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all duration-200 placeholder-[#84cc16]"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#84cc16] hover:text-[#65a30d] transition-colors"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="rePassword"
                className="block text-sm font-medium text-[#1a2e05] mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="rePassword"
                  type={showRePassword ? "text" : "password"}
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-[#1a2e05] bg-white border border-[#bbf7d0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all duration-200 placeholder-[#84cc16]"
                  placeholder="Confirm the password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRePassword(!showRePassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#84cc16] hover:text-[#65a30d] transition-colors"
                >
                  {showRePassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating user...
                  </div>
                ) : (
                  "Create User"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
