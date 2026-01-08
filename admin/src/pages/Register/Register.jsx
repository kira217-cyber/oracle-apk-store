// src/pages/Register/Register.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

// Icons
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

// Fetch countries with flag PNG
const fetchCountries = async () => {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags"
  );
  if (!res.ok) throw new Error("Failed to fetch countries");
  const data = await res.json();
  return data
    .map((c) => ({
      name: c.name?.common || "",
      code: c.cca2 || "",
      dialCode:
        c.idd?.root && c.idd?.suffixes?.[0]
          ? c.idd.root + c.idd.suffixes[0]
          : "",
      flagPng: c.flags?.png || "",
    }))
    .filter((c) => c.name && c.code && c.dialCode && c.flagPng)
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Register API
const registerDeveloper = async (formData) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/developer/register`,
    formData,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

const Register = () => {
  // Removed login from useAuth since we don't auto-login anymore
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("individual");
  const [selectedDialCode, setSelectedDialCode] = useState("+1");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const {
    register: formRegister,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch countries
  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: Infinity,
  });

  // Registration mutation - UPDATED FUNCTIONALITY
  const mutation = useMutation({
    mutationFn: registerDeveloper,
    onSuccess: (data) => {
      // DO NOT auto-login or navigate
      toast.success(
        "🎉 Registration Successful! Login Now!",
        {
          autoClose: 9000,
          position: "top-center",
        }
      );
      // Optional: You can redirect to login page after a delay if desired
      setTimeout(() => navigate("/login"), 1000);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration Failed");
    },
  });

  const onSubmit = (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      accountType,
      companyName: accountType === "company" ? data.companyName : "",
      fullName: accountType === "individual" ? data.fullName : "",
      country: data.country,
      whatsapp: selectedDialCode + data.whatsapp,
      website: data.website || "",
      password: data.password,
    };
    mutation.mutate(payload);
  };

  const handleCountryChange = (e) => {
    const selectedName = e.target.value;
    setValue("country", selectedName);
    const country = countries.find((c) => c.name === selectedName);
    if (country) {
      setSelectedDialCode(country.dialCode);
      setSelectedCountry(country);
    } else {
      setSelectedDialCode("");
      setSelectedCountry(null);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-black to-orange-950">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-800/40 w-full max-w-3xl p-8 md:p-12 text-gray-100"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-3">
            Developer Register
          </h2>
          <p className="text-gray-400 text-lg">
            Create your account and join APK Store
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* First & Last Name */}
          <div>
            <input
              {...formRegister("firstName", {
                required: "First Name is required",
              })}
              placeholder="First Name"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
            />
            {errors.firstName && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...formRegister("lastName", {
                required: "Last Name is required",
              })}
              placeholder="Last Name"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
            />
            {errors.lastName && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <input
              {...formRegister("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid Email",
                },
              })}
              type="email"
              placeholder="Email Address"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
            />
            {errors.email && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div className="md:col-span-2">
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200 cursor-pointer"
            >
              <option value="individual" className="bg-gray-800">
                Individual
              </option>
              <option value="company" className="bg-gray-800">
                Company
              </option>
            </select>
          </div>

          {/* Conditional Name Field */}
          {accountType === "company" ? (
            <div className="md:col-span-2">
              <input
                {...formRegister("companyName", {
                  required: "Company Name is required",
                })}
                placeholder="Company Name"
                className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
              />
              {errors.companyName && (
                <p className="text-orange-400 text-sm mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          ) : (
            <div className="md:col-span-2">
              <input
                {...formRegister("fullName", {
                  required: "Your Name is required",
                })}
                placeholder="Your Full Name"
                className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
              />
              {errors.fullName && (
                <p className="text-orange-400 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          {/* Country Selection with Flag */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Country
            </label>
            <div className="flex items-center gap-4">
              {selectedCountry ? (
                <img
                  src={selectedCountry.flagPng}
                  alt={`${selectedCountry.name} flag`}
                  className="w-14 h-10 object-cover rounded-lg shadow-lg border border-gray-600"
                />
              ) : (
                <div className="w-14 h-10 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg" />
              )}
              <select
                {...formRegister("country", {
                  required: "Please select a country",
                })}
                onChange={handleCountryChange}
                disabled={countriesLoading}
                className="flex-1 px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200 cursor-pointer"
              >
                <option value="">
                  {countriesLoading
                    ? "Loading countries..."
                    : "Select your country"}
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name} className="bg-gray-800">
                    {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
            </div>
            {errors.country && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* WhatsApp Number */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              WhatsApp Number
            </label>
            <div className="flex gap-3">
              <input
                value={selectedDialCode || ""}
                disabled
                className="w-32 px-4 py-4 bg-gray-800/80 border border-gray-700 rounded-xl text-center font-bold text-orange-400"
              />
              <input
                {...formRegister("whatsapp", {
                  required: "WhatsApp number is required",
                })}
                type="tel"
                placeholder="Enter remaining digits"
                className="flex-1 px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
              />
            </div>
            {errors.whatsapp && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.whatsapp.message}
              </p>
            )}
          </div>

          {/* Website (Optional) */}
          <div className="md:col-span-2">
            <input
              {...formRegister("website")}
              type="url"
              placeholder="Website (Optional)"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              {...formRegister("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-5 py-4 pr-12 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition cursor-pointer"
            >
              {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
            </button>
            {errors.password && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              {...formRegister("confirmPassword", {
                required: "Please confirm password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-5 py-4 pr-12 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition cursor-pointer"
            >
              {showConfirmPassword ? (
                <HiEyeOff size={24} />
              ) : (
                <HiEye size={24} />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...formRegister("terms", {
                  required: "You must agree to the terms",
                })}
                className="w-6 h-6 rounded border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900 cursor-pointer"
              />
              <span className="text-gray-300">
                I agree to{" "}
                <span className="text-orange-400 underline hover:text-orange-300 transition">
                  Terms of Service
                </span>{" "}
                &{" "}
                <span className="text-orange-400 underline hover:text-orange-300 transition">
                  Privacy Policy
                </span>
              </span>
            </label>
            {errors.terms && (
              <p className="text-orange-400 text-sm mt-2">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={mutation.isPending || countriesLoading}
            className="md:col-span-2 w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-orange-900/50 hover:shadow-orange-900/70 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-lg"
          >
            {mutation.isPending ? "Creating Account..." : "Register Now"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-10">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-6 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Google Sign In */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-gray-800/70 border border-gray-700 text-gray-200 font-medium py-5 rounded-xl hover:bg-gray-800 hover:border-orange-600/50 transition duration-200 cursor-pointer"
        >
          <FcGoogle size={28} />
          Continue with Google
        </motion.button>

        {/* Login Link */}
        <p className="text-center mt-10 text-gray-400 text-lg">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-400 font-bold hover:underline transition cursor-pointer"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
