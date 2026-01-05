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

const loginUser = async (credentials) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/users/login`, // আপনার লগইন রুট
    credentials
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
    mutationFn: loginUser,
    onSuccess: (data) => {
      // data থেকে token এবং user পাবেন
      login(data.token, data.user);
      toast.success("🎉 Login Successful! Welcome back!", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/"); // হোমে যাবে
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid email or password", {
        position: "top-center",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ email: data.email, password: data.password });
  };

 const handleGoogleLogin = () =>{
  toast.info("Google Login Coming Soon!")
 }

  return (
    <div className="min-h-screen flex items-center justify-center px-2 md:px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md px-4 py-8 md:p-10"
      >
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2"
        >
          Welcome Back
        </motion.h2>
        <p className="text-center text-gray-600 mb-8">
          Login to your APK Store account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Email Address"
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
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
              placeholder="Password"
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2  -translate-y-1/2 text-gray-500 hover:text-indigo-600 cursor-pointer"
            >
              {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1">
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition duration-300 disabled:opacity-70"
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm bg-white">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login (Demo) */}
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 cursor-pointer font-medium py-4 rounded-xl hover:bg-gray-50 transition">
          <FcGoogle size={24} />
          Continue with Google
        </button>

        {/* Register Link */}
        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 cursor-pointer font-bold hover:underline transition"
          >
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
