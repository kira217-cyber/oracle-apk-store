import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const { login } = useAuth(); // From your AuthContext
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // TanStack Query Mutation for Login
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`, // Adjust API URL
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        login(data.user); // Save to AuthContext & localStorage
        toast.success("Login successful!");
        navigate("/")

        // Redirect to dashboard (use navigate from react-router)
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-black to-[#1e293b]/90" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-900/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8] p-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              APK STORE ADMIN
            </h1>
            <p className="text-blue-200 text-sm md:text-base mt-3 opacity-90">
              System Administrator Login
            </p>
          </div>

          {/* Form */}
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              {/* Email Input */}
              <div>
                <label className="block text-blue-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  autoFocus
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-md border border-blue-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/20 transition-all duration-300 cursor-text"
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input with Toggle */}
              <div>
                <label className="block text-blue-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full px-5 py-4 pr-14 bg-white/10 backdrop-blur-md border border-blue-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/20 transition-all duration-300 cursor-text"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-[#60a5fa] transition-colors duration-200 cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-xl" />
                    ) : (
                      <FaEye className="text-xl" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isLoading}
                className="w-full mt-10 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#2563eb] text-white font-bold py-4.5 px-6 rounded-xl shadow-lg hover:shadow-blue-600/60 transform hover:scale-105 transition-all duration-300 text-lg cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>
                  {loginMutation.isLoading ? "Signing In..." : "Sign In"}
                </span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </button>
            </form>

            {/* Footer Text */}
            <div className="mt-10 text-center">
              <p className="text-blue-400 text-sm">
                Secured Access • Admin Portal Only
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center mt-10">
          <p className="text-blue-400/60 text-sm">
            © 2026 APK Store • All Rights Reserved
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
