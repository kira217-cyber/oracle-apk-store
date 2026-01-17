import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Load current user data
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (formValues) => {
      const payload = {
        name: formValues.name.trim(),
        email: formValues.email.trim().toLowerCase(),
        currentEmail: user.email, // 🔥 KEY PART
      };

      if (formValues.password) {
        payload.password = formValues.password;
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        payload
      );

      return res.data;
    },

    onSuccess: (data) => {
      // update localStorage + UI instantly
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("🎉 Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      reset({
        name: data.user.name,
        email: data.user.email,
        password: "",
        confirmPassword: "",
      });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile", {
        position: "top-center",
      });
    },
  });

  const onSubmit = (values) => {
    if (values.password && values.password !== values.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    updateProfileMutation.mutate(values);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-600 text-xl">
        Loading your profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Please login first
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Profile
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Update your account information
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Full Name"
              className="w-full px-5 py-4 rounded-xl border focus:ring-4 focus:ring-indigo-200"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email",
                },
              })}
              type="email"
              placeholder="Email Address"
              className="w-full px-5 py-4 rounded-xl border focus:ring-4 focus:ring-indigo-200"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full px-5 py-4 rounded-xl border pr-12 focus:ring-4 focus:ring-indigo-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="w-full px-5 py-4 rounded-xl border pr-12 focus:ring-4 focus:ring-indigo-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? (
                <HiEyeOff size={22} />
              ) : (
                <HiEye size={22} />
              )}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl"
          >
            {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
