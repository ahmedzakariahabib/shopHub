"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/_store/authStore";
import toast from "react-hot-toast";

// Eye icons for password visibility (same as register form)
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

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password, rememberMe);
    if (success) {
      const raw = localStorage.getItem("auth-storage");
      const name = raw ? JSON.parse(raw)?.state?.name : null;
      toast.success(`Welcome back, ${name || "shopper"}! 🛍️`);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#dcfce7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand - Matches register form */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#16a34a] rounded-full mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold text-[#052e16] mb-2">
            Welcome back
          </h1>
          <p className="text-[#365314]">Sign in to your ShopHub account</p>
        </div>

        {/* Login Form - Same styling as register form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-[#dcfce7] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-3 text-[#1a2e05] bg-white border border-[#bbf7d0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all duration-200 placeholder-[#84cc16]"
                placeholder="Enter your email"
                required
              />
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
                  className="w-full px-4 py-3 pr-12 text-[#1a2e05] bg-white border border-[#bbf7d0] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all duration-200 placeholder-[#84cc16]"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#84cc16] hover:text-[#65a30d] transition-colors"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#16a34a] bg-white border-[#bbf7d0] rounded focus:ring-[#16a34a] focus:ring-2"
                />
                <span className="ml-2 text-sm text-[#365314]">Remember me</span>
              </label>
              <a
                // href="/forgot-password"
                className="text-sm text-[#16a34a] hover:text-[#15803d] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button - Same as register */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign up link - Matches register's sign in link */}
          <div className="mt-6 text-center">
            <p className="text-[#365314]">
              Don't have an account?{" "}
              <a
                href="/auth/signup"
                className="text-[#16a34a] hover:text-[#15803d] font-medium transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
