// src/components/UploadForm/Step2Form.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Step2Form = ({ formData, onBack }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullAbout: formData.fullAbout || "",
      collectsUserData: formData.collectsUserData || null,
      bettingOrGambling: formData.bettingOrGambling || null,
      earningOrAds: formData.earningOrAds || null,
      mobileBanking: formData.mobileBanking || null,
      government: formData.government || null,
      sharesDataWithThirdParties: formData.sharesDataWithThirdParties || null,
      intendedForChildren: formData.intendedForChildren || null,
      childDataTypes: formData.childDataTypes || [],
      purposeOfDataCollection: formData.purposeOfDataCollection || [],
      dataSharedWith: formData.dataSharedWith || [],
      dataProtection: formData.dataProtection || [],
      dataRetention: formData.dataRetention || [],
      userControls: formData.userControls || [],
      childCompliance: formData.childCompliance || [],
      sensitivePermissions: formData.sensitivePermissions || [],
      permissionReason: formData.permissionReason || "",
      showsAds: formData.showsAds || null,
      adDetails: formData.adDetails || [],
      supportContact: formData.supportContact || "",
      declarations: formData.declarations || [],
    },
  });

  const intendedForChildren = watch("intendedForChildren");
  const sharesDataWithThirdParties = watch("sharesDataWithThirdParties");
  const showsAds = watch("showsAds");
  const sensitivePermissions = watch("sensitivePermissions") || [];

  const mutation = useMutation({
    mutationFn: async (finalData) => {
      const formDataToSend = new FormData();

      Object.keys(finalData).forEach((key) => {
        if (key === "screenshots") {
          finalData.screenshots.forEach((file) =>
            formDataToSend.append("screenshots", file)
          );
        } else if (
          ["apkLogo", "apkFile", "uploadVideo"].includes(key) &&
          finalData[key]
        ) {
          formDataToSend.append(key, finalData[key]);
        } else if (Array.isArray(finalData[key])) {
          formDataToSend.append(key, JSON.stringify(finalData[key]));
        } else {
          formDataToSend.append(key, finalData[key] || "");
        }
      });

      if (userId) {
        formDataToSend.append("user", userId);
      }

      return axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-apk`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    onMutate: () => {
      toast.info("Uploading your APK...", {
        toastId: "upload-loading",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
    },
    onSuccess: () => {
      toast.dismiss("upload-loading");
      toast.success("APK Published Successfully!", {
        icon: "🚀",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/"), 1500);
    },
    onError: (err) => {
      toast.dismiss("upload-loading");
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Upload failed. Please try again.";
      toast.error(`Upload Failed: ${errorMessage}`, { autoClose: 5000 });
    },
  });

  const onSubmit = (data) => {
    if (!userId) {
      toast.error("You must be logged in to publish an APK!", {
        autoClose: 4000,
      });
      return;
    }

    const fullData = { ...formData, ...data };
    mutation.mutate(fullData);
  };

  // Group questions in pairs for 2-per-row layout
  const dataCollectionQuestions = [
    [
      {
        name: "collectsUserData",
        label: "Does your app collect any user data?",
      },
      { name: "bettingOrGambling", label: "Your app Betting or Gambling?" },
    ],
    [
      { name: "earningOrAds", label: "Your app Earning or Ads Views?" },
      { name: "mobileBanking", label: "Your app Mobile Banking or Financial?" },
    ],
    [
      { name: "government", label: "Your Government?" },
      {
        name: "sharesDataWithThirdParties",
        label: "Is any user data shared with third parties?",
      },
    ],
    [
      { name: "showsAds", label: "Does your app show ads?" },
      null, // Empty slot to balance layout
    ],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-orange-800/40"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
        Step 2 – Data Safety & Developer Declaration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Full About This App */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-4">
            Full About This App
          </label>
          <Controller
            name="fullAbout"
            control={control}
            rules={{ required: "Full description is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                rows={8}
                placeholder="Provide a detailed description of your app..."
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200 resize-none"
              />
            )}
          />
          {errors.fullAbout && (
            <p className="text-orange-400 mt-3 text-sm">
              {errors.fullAbout.message}
            </p>
          )}
        </div>

        {/* Data Collection Questions – 2 per row */}
        <div className="space-y-10">
          <h3 className="text-2xl font-bold text-orange-300 flex items-center gap-3">
            📊 Data Collection
          </h3>

          {dataCollectionQuestions.map((pair, pairIndex) => (
            <div
              key={pairIndex}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {pair.map((question) =>
                question ? (
                  <div key={question.name}>
                    <label className="block text-lg font-medium text-gray-200 mb-5">
                      {question.label}
                    </label>
                    <Controller
                      name={question.name}
                      control={control}
                      rules={{ required: "This field is required" }}
                      render={({ field }) => (
                        <div className="flex gap-8">
                          {["Yes", "No"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-2 py-5 rounded-2xl transition flex-1"
                            >
                              <input
                                type="radio"
                                {...field}
                                value={option}
                                checked={field.value === option}
                                className="w-7 h-7 accent-orange-500 cursor-pointer"
                              />
                              <span className="text-lg font-medium text-gray-100">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors[question.name] && (
                      <p className="text-orange-400 mt-3 text-sm">
                        {errors[question.name].message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div key="empty" /> // Empty column for balance
                )
              )}
            </div>
          ))}
        </div>

        {/* Intended for Children */}
        <div>
          <label className="block text-lg font-medium text-gray-200 mb-5">
            Is your app intended for children under 13?
          </label>
          <Controller
            name="intendedForChildren"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <div className="flex flex-wrap gap-8">
                {["Yes", "No", "Both"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-8 py-5 rounded-2xl transition"
                  >
                    <input
                      type="radio"
                      {...field}
                      value={option}
                      checked={field.value === option}
                      className="w-7 h-7 accent-orange-500 cursor-pointer"
                    />
                    <span className="text-lg font-medium text-gray-100">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Child Data Types */}
        {intendedForChildren === "Yes" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <label className="block text-lg font-medium text-orange-300">
              If Yes, please select all that apply:
            </label>
            <Controller
              name="childDataTypes"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    "Personal Information (Name, Email, Phone Number, Address)",
                    "Financial Information (Payment info, Bank details, Crypto wallets)",
                    "Location (Precise / Approximate)",
                    "Device Information (Device ID, IP address, OS version)",
                    "App Activity (Pages visited, taps, in-app actions)",
                    "Messages (SMS, chat content, emails)",
                    "Media (Photos, videos, audio files)",
                    "Contacts",
                    "Browsing / Usage History",
                    "Other (Please specify)",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={field.value.includes(item)}
                        onChange={(e) => {
                          const newVal = e.target.checked
                            ? [...field.value, item]
                            : field.value.filter((v) => v !== item);
                          field.onChange(newVal);
                        }}
                        className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                      />
                      <span className="text-base text-gray-200">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Purpose of Data Collection */}
        <div>
          <label className="block text-lg font-medium text-orange-300 mb-5">
            Why do you collect this data? (Select all that apply)
          </label>
          <Controller
            name="purposeOfDataCollection"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  "App functionality",
                  "Account creation & login",
                  "Payments & transactions",
                  "Customer support",
                  "Analytics & performance tracking",
                  "Advertising / marketing",
                  "Fraud prevention & security",
                  "Personalization",
                  "Legal compliance",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      checked={field.value.includes(item)}
                      onChange={(e) => {
                        const newVal = e.target.checked
                          ? [...field.value, item]
                          : field.value.filter((v) => v !== item);
                        field.onChange(newVal);
                      }}
                      className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                    />
                    <span className="text-gray-200">{item}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Data Shared With */}
        {sharesDataWithThirdParties === "Yes" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-lg font-medium text-orange-300 mb-5">
              If Yes, data may be shared with:
            </label>
            <Controller
              name="dataSharedWith"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    "Advertising partners",
                    "Analytics providers",
                    "Payment processors",
                    "Cloud service providers",
                    "Government / legal authorities",
                    "Other third parties (Specify)",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={field.value.includes(item)}
                        onChange={(e) => {
                          const newVal = e.target.checked
                            ? [...field.value, item]
                            : field.value.filter((v) => v !== item);
                          field.onChange(newVal);
                        }}
                        className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                      />
                      <span className="text-gray-200">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Data Protection */}
        <div>
          <label className="block text-lg font-medium text-orange-300 mb-5">
            How is user data protected?
          </label>
          <Controller
            name="dataProtection"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  "Data is encrypted in transit (HTTPS / SSL)",
                  "Data is encrypted at rest",
                  "Secure servers & firewalls",
                  "Access control & authentication",
                  "Regular security audits",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      checked={field.value.includes(item)}
                      onChange={(e) => {
                        const newVal = e.target.checked
                          ? [...field.value, item]
                          : field.value.filter((v) => v !== item);
                        field.onChange(newVal);
                      }}
                      className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                    />
                    <span className="text-gray-200">{item}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Data Retention */}
        <div>
          <label className="block text-lg font-medium text-orange-300 mb-5">
            Data retention period:
          </label>
          <Controller
            name="dataRetention"
            control={control}
            render={({ field }) => (
              <div className="space-y-6">
                {[
                  "Until account deletion",
                  "Fixed period (Specify duration)",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      checked={field.value.includes(item)}
                      onChange={(e) => {
                        const newVal = e.target.checked
                          ? [...field.value, item]
                          : field.value.filter((v) => v !== item);
                        field.onChange(newVal);
                      }}
                      className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                    />
                    <span className="text-gray-200">{item}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* User Controls */}
        <div>
          <label className="block text-lg font-medium text-orange-300 mb-5">
            Does your app allow users to:
          </label>
          <Controller
            name="userControls"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  "Access their data",
                  "Edit or update their data",
                  "Delete their account & data",
                  "Withdraw consent",
                  "Request data export",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      checked={field.value.includes(item)}
                      onChange={(e) => {
                        const newVal = e.target.checked
                          ? [...field.value, item]
                          : field.value.filter((v) => v !== item);
                        field.onChange(newVal);
                      }}
                      className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                    />
                    <span className="text-gray-200">{item}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Child Compliance */}
        {intendedForChildren === "Yes" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-lg font-medium text-orange-300 mb-5">
              If Yes (COPPA compliance):
            </label>
            <Controller
              name="childCompliance"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    "COPPA compliant",
                    "No targeted advertising",
                    "Parental consent required",
                    "Limited data collection",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={field.value.includes(item)}
                        onChange={(e) => {
                          const newVal = e.target.checked
                            ? [...field.value, item]
                            : field.value.filter((v) => v !== item);
                          field.onChange(newVal);
                        }}
                        className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                      />
                      <span className="text-gray-200">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Sensitive Permissions */}
        <div>
          <label className="block text-lg font-medium text-orange-300 mb-5">
            Does your app access sensitive permissions?
          </label>
          <Controller
            name="sensitivePermissions"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {[
                  "Location (foreground)",
                  "Location (background)",
                  "Camera",
                  "Microphone",
                  "Storage",
                  "Contacts",
                  "SMS / Call logs",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      checked={field.value.includes(item)}
                      onChange={(e) => {
                        const newVal = e.target.checked
                          ? [...field.value, item]
                          : field.value.filter((v) => v !== item);
                        field.onChange(newVal);
                      }}
                      className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                    />
                    <span className="text-gray-200">{item}</span>
                  </label>
                ))}
              </div>
            )}
          />

          {sensitivePermissions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <label className="block text-lg font-medium text-orange-300 mb-3">
                Reason for access (required):
              </label>
              <Controller
                name="permissionReason"
                control={control}
                rules={{
                  required:
                    sensitivePermissions.length > 0
                      ? "Reason is required"
                      : false,
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={6}
                    placeholder="Explain why your app needs these permissions..."
                    className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200 resize-none"
                  />
                )}
              />
              {errors.permissionReason && (
                <p className="text-orange-400 mt-3 text-sm">
                  {errors.permissionReason.message}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Advertising Details */}
        {showsAds === "Yes" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-lg font-medium text-orange-300 mb-5">
              Advertising & Tracking:
            </label>
            <Controller
              name="adDetails"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    "Uses Ad ID",
                    "Tracks user behavior",
                    "Offers opt-out of personalized ads",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-4 cursor-pointer hover:bg-orange-900/30 px-6 py-5 rounded-2xl transition"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={field.value.includes(item)}
                        onChange={(e) => {
                          const newVal = e.target.checked
                            ? [...field.value, item]
                            : field.value.filter((v) => v !== item);
                          field.onChange(newVal);
                        }}
                        className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                      />
                      <span className="text-gray-200">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Support Contact */}
        <div>
          <label className="block text-lg font-medium text-orange-300 mb-3">
            Support Email / Contact
          </label>
          <Controller
            name="supportContact"
            control={control}
            rules={{ required: "Support contact is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="support@yourapp.com"
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
              />
            )}
          />
          {errors.supportContact && (
            <p className="text-orange-400 mt-3 text-sm">
              {errors.supportContact.message}
            </p>
          )}
        </div>

        {/* Developer Declaration – Shortened */}
        <div>
          <label className="block text-2xl font-bold text-orange-300 mb-6">
            🔒 Developer Declaration
          </label>
          <p className="text-gray-300 mb-8 leading-relaxed text-base">
            I confirm that the information provided is accurate and my app
            complies with all applicable laws and policies.
          </p>
          <Controller
            name="declarations"
            control={control}
            rules={{
              validate: (v) =>
                v.length === 4 || "You must agree to all declarations",
            }}
            render={({ field }) => (
              <div className="space-y-5">
                {[
                  "All information is correct",
                  "I agree to Terms & Conditions",
                  "I agree to Refund Policy",
                  "Data safety information is accurate",
                ].map((text) => (
                  <label
                    key={text}
                    className="flex items-center gap-5 cursor-pointer hover:bg-orange-900/30 px-8 py-5 rounded-2xl transition text-base"
                  >
                    <input
                      type="checkbox"
                      value={text}
                      checked={field.value.includes(text)}
                      onChange={(e) => {
                        const newVal = e.target.checked
                          ? [...field.value, text]
                          : field.value.filter((v) => v !== text);
                        field.onChange(newVal);
                      }}
                      className="w-7 h-7 accent-orange-500 rounded cursor-pointer"
                    />
                    <span className="font-medium text-gray-100">{text}</span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.declarations && (
            <p className="text-orange-400 mt-5 text-sm">
              {errors.declarations.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onBack}
            className="px-14 py-6 bg-gray-800/70 hover:bg-gray-700 rounded-2xl font-bold text-xl shadow-xl hover:shadow-orange-900/40 transition cursor-pointer"
          >
            ← Back to Step 1
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={mutation.isPending}
            className="relative px-20 py-7 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-2xl rounded-2xl shadow-2xl shadow-orange-900/60 hover:shadow-orange-900/80 transition duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <>
                <span className="opacity-0">Publish APK</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <span className="absolute inset-0 flex items-center justify-center">
                  Publishing...
                </span>
              </>
            ) : (
              "🚀 Publish APK"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default Step2Form;
