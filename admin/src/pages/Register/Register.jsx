// src/pages/Register/Register.jsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router"; // Fixed import
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
      flagPng: c.flags?.png || "", // High-quality PNG flag
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
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("individual");
  const [selectedDialCode, setSelectedDialCode] = useState("+1");
  const [selectedCountry, setSelectedCountry] = useState(null); // Full country object

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

  // Registration mutation
  const mutation = useMutation({
    mutationFn: registerDeveloper,
    onSuccess: (data) => {
      login(data.user);
      toast.success("🎉 Registration Successful!");
      navigate("/");
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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-r from-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 md:p-10 text-gray-800"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2"
        >
          Developer Register
        </motion.h2>
        <p className="text-center text-gray-500 mb-8">
          Create your account and join APK Store
        </p>

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
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
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
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
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
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div className="md:col-span-2">
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
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
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">
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
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          {/* Country Selection with Flag Preview */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <div className="flex items-center gap-4">
              {/* Selected Flag */}
              {selectedCountry ? (
                <img
                  src={selectedCountry.flagPng}
                  alt={`${selectedCountry.name} flag`}
                  className="w-12 h-9 object-cover rounded-md shadow-md border border-gray-200"
                />
              ) : (
                <div className="w-12 h-9 bg-gray-200 border-2 border-dashed border-gray-400 rounded-md" />
              )}

              {/* Country Dropdown */}
              <select
                {...formRegister("country", {
                  required: "Please select a country",
                })}
                onChange={handleCountryChange}
                disabled={countriesLoading}
                className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">
                  {countriesLoading
                    ? "Loading countries..."
                    : "Select your country"}
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
            </div>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* WhatsApp Number */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <div className="flex gap-3">
              <input
                value={selectedDialCode || ""}
                disabled
                className="w-28 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-center font-semibold text-gray-700"
              />
              <input
                {...formRegister("whatsapp", {
                  required: "WhatsApp number is required",
                })}
                type="tel"
                placeholder="Enter remaining digits"
                className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">
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
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
              className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
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
              {...formRegister("confirmPassword", {
                required: "Please confirm password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
              <p className="text-red-500 text-sm mt-1">
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
                className="w-5 h-5 cursor-pointer text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700">
                I agree to Terms of Service & Privacy Policy
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={mutation.isLoading || countriesLoading}
            className="md:col-span-2 cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? "Creating Account..." : "Register Now"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        {/* Login Link */}
        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-bold hover:underline"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
