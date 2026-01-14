// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

// Reuse same countries fetch
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

const fetchDeveloper = async (id) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/developer/${id}`
  );
  return data.developer;
};

const updateDeveloper = async ({ id, data }) => {
  const { data: response } = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/developer/${id}`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return response;
};

const Profile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [accountType, setAccountType] = useState("individual");
  const [selectedDialCode, setSelectedDialCode] = useState("+880");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      fullName: "",
      country: "",
      whatsapp: "",
      website: "",
    },
  });

  // Countries (global, cached forever)
  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: Infinity,
  });

  // Developer profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["developer", user?._id || user?.id],
    queryFn: () => fetchDeveloper(user?._id || user?.id),
    enabled: !!(user?._id || user?.id),
  });

  // Populate form once BOTH profile + countries are ready
  useEffect(() => {
    if (!profile || !countries.length) return;

    // Prepare values
    const formValues = {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      companyName: profile.companyName || "",
      fullName: profile.fullName || "",
      country: profile.country || "",
      website: profile.website || "",
      whatsapp: "", // we'll set partial below
    };

    reset(formValues, { keepDefaultValues: false });

    // Account type
    const accType = profile.accountType || "individual";
    setAccountType(accType);

    // WhatsApp split
    if (profile.whatsapp) {
      const codeMatch = profile.whatsapp.match(/^\+\d+/);
      const code = codeMatch ? codeMatch[0] : "+880";
      const numberPart = profile.whatsapp.replace(code, "").trim();

      setSelectedDialCode(code);
      setValue("whatsapp", numberPart, { shouldValidate: true });
    }

    // Country + flag
    const foundCountry = countries.find((c) => c.name === profile.country);
    if (foundCountry) {
      setSelectedCountry(foundCountry);
      setSelectedDialCode(foundCountry.dialCode); // sync dial if changed
    }
  }, [profile, countries, reset, setValue]);

  // Keep accountType in sync (just in case)
  useEffect(() => {
    if (profile?.accountType) {
      setAccountType(profile.accountType);
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateDeveloper,
    onSuccess: (updatedData) => {
      toast.success("Profile updated successfully! 🎉", {
        position: "top-right",
        autoClose: 4000,
      });

      // Update cache → triggers useQuery → triggers useEffect → form gets fresh data
      queryClient.setQueryData(
        ["developer", user?._id || user?.id],
        updatedData.developer
      );

      // Optional: or just invalidate (refetch)
      // queryClient.invalidateQueries(["developer", user?._id || user?.id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile", {
        position: "top-right",
      });
    },
  });

  const onSubmit = (formData) => {
    if (!isDirty) {
      toast.info("No changes detected", { autoClose: 3000 });
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      accountType,
      companyName: accountType === "company" ? formData.companyName : "",
      fullName: accountType === "individual" ? formData.fullName : "",
      country: formData.country,
      whatsapp: selectedDialCode + (formData.whatsapp || ""),
      website: formData.website || "",
    };

    mutation.mutate({ id: user?._id || user?.id, data: payload });
  };

  const handleCountryChange = (e) => {
    const selectedName = e.target.value;
    setValue("country", selectedName);

    const country = countries.find((c) => c.name === selectedName);
    if (country) {
      setSelectedDialCode(country.dialCode);
      setSelectedCountry(country);
    } else {
      setSelectedDialCode("+880");
      setSelectedCountry(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-orange-400">
        Please login first
      </div>
    );
  }

  if (profileLoading || countriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-300">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-black to-orange-950">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-800/40 w-full max-w-3xl p-8 md:p-12 text-gray-100"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-3">
            Update Your Profile
          </h2>
          <p className="text-gray-400 text-lg">
            Keep your information up to date
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <input
              {...register("firstName", { required: "First Name is required" })}
              placeholder="First Name"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition"
            />
            {errors.firstName && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("lastName", { required: "Last Name is required" })}
              placeholder="Last Name"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition"
            />
            {errors.lastName && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid Email",
                },
              })}
              type="email"
              placeholder="Email Address"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition"
            />
            {errors.email && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition cursor-pointer"
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
          </div>

          {accountType === "company" ? (
            <div className="md:col-span-2">
              <input
                {...register("companyName", {
                  required:
                    accountType === "company" && "Company Name is required",
                })}
                placeholder="Company Name"
                className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition"
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
                {...register("fullName", {
                  required:
                    accountType === "individual" && "Full Name is required",
                })}
                placeholder="Your Full Name"
                className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition"
              />
              {errors.fullName && (
                <p className="text-orange-400 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

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
                {...register("country", {
                  required: "Please select a country",
                })}
                onChange={handleCountryChange}
                disabled={countriesLoading}
                className="flex-1 px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition cursor-pointer"
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              WhatsApp Number
            </label>
            <div className="flex gap-3">
              <input
                value={selectedDialCode}
                disabled
                className="w-32 px-4 py-4 bg-gray-800/80 border border-gray-700 rounded-xl text-center font-bold text-orange-400"
              />
              <input
                {...register("whatsapp", {
                  required: "WhatsApp number is required",
                })}
                type="tel"
                placeholder="Enter remaining digits"
                className="flex-1 px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition"
              />
            </div>
            {errors.whatsapp && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.whatsapp.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <input
              {...register("website", {
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
                  message: "Invalid URL",
                },
              })}
              type="url"
              placeholder="Website (Optional)"
              className="w-full px-5 py-4 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition"
            />
            {errors.website && (
              <p className="text-orange-400 text-sm mt-1">
                {errors.website.message}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={mutation.isPending || !isDirty}
            className="md:col-span-2 cursor-pointer w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-orange-900/50 hover:shadow-orange-900/70 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
          >
            {mutation.isPending
              ? "Updating..."
              : isDirty
              ? "Save Changes"
              : "No Changes"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
