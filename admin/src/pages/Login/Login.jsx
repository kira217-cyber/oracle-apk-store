// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../hooks/useAuth";

// Login API function
const loginDeveloper = async (credentials) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/developer/login`,
    credentials,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: loginDeveloper,
    onSuccess: (data) => {
      login(data.user);
      toast.success("🎉 Login Successful! Welcome back!", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/");
    },
    onError: (err) => {
      // Enhanced error handling for different account status messages
      const serverMessage = err.response?.data?.message;

      let displayMessage = "Invalid email or password";

      if (serverMessage) {
        if (
          serverMessage.includes("pending") ||
          serverMessage.includes("approval")
        ) {
          displayMessage =
            "⏳ Your account is pending admin approval. Please wait for approval.";
        } else if (serverMessage.includes("rejected")) {
          displayMessage =
            "❌ Your account has been rejected. Contact support for details.";
        } else if (
          serverMessage.includes("deactivated") ||
          serverMessage.includes("deactive")
        ) {
          displayMessage = "🔒 Your account is currently deactivated.";
        } else if (serverMessage.includes("not active")) {
          displayMessage =
            "🚫 Your account is not active. Please contact support.";
        } else {
          displayMessage = serverMessage;
        }
      }

      toast.error(displayMessage, {
        position: "top-center",
        autoClose: 6000,
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ email: data.email, password: data.password });
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-black to-orange-950">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-800/40 w-full max-w-md p-8 md:p-12"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-3">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-lg">
            Login to your Developer Account
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="you@example.com"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
            />
            {errors.email && (
              <p className="text-orange-400 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-5 py-4 pr-14 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition cursor-pointer"
              >
                {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-orange-400 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-orange-900/50 hover:shadow-orange-900/70 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-lg"
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-10">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-6 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Google Login */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-gray-800/70 border border-gray-700 text-gray-200 font-medium py-5 rounded-xl hover:bg-gray-800 hover:border-orange-600/50 transition duration-200 cursor-pointer"
        >
          <FcGoogle size={28} />
          Continue with Google
        </motion.button>

        {/* Register Link */}
        <p className="text-center mt-10 text-gray-400 text-lg">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-orange-400 font-bold hover:underline transition cursor-pointer"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
