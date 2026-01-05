import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

// React Icons
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

const registerUser = async (formData) => {
  console.log("API URL:", import.meta.env.VITE_API_URL);

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/users/register`, // "users" (s আছে)
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success("🎉 Registration Successful! Welcome!", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration Failed", {
        position: "top-center",
      });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    mutation.mutate(payload);
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login Coming Soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 py-6 md:px-4 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
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
          Create Account
        </motion.h2>
        <p className="text-center text-gray-600 mb-8">Join APK Store today!</p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <input
              {...register("name", { required: "Full name is required" })}
              type="text"
              placeholder="Full Name"
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

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
              className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            >
              {showConfirmPassword ? (
                <HiEyeOff size={22} />
              ) : (
                <HiEye size={22} />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              {...register("terms", {
                required: "You must agree to the terms",
              })}
              className="mt-1 w-5 h-5 cursor-pointer text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label className="text-sm text-gray-700 leading-tight">
              I agree to the{" "}
              <span className="text-indigo-600 font-medium underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-indigo-600 font-medium underline cursor-pointer">
                Privacy Policy
              </span>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm -mt-3 ml-8">
              {errors.terms.message}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Creating Account..." : "Register"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm bg-white">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login (Demo) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-medium cursor-pointer py-4 rounded-xl hover:bg-gray-50 transition"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        {/* Login Link */}
        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 cursor-pointer font-bold hover:underline transition"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
