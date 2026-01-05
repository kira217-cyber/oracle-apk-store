import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify"; // Using react-toastify

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

      // Append authenticated user ID
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

      setTimeout(() => {
        navigate("/");
      }, 1500);
    },
    onError: (err) => {
      toast.dismiss("upload-loading");
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Upload failed. Please try again.";

      toast.error(`Upload Failed: ${errorMessage}`, {
        autoClose: 5000,
      });
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Step 2 – Data Safety & Developer Declaration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Full About This App */}
        <div>
          <label className="block text-xl font-semibold mb-3">
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
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition resize-none"
              />
            )}
          />
          {errors.fullAbout && (
            <p className="text-red-400 mt-2">{errors.fullAbout.message}</p>
          )}
        </div>

        {/* Data Collection Questions */}
        <div className="space-y-10">
          <h3 className="text-2xl font-bold text-purple-300">
            📊 Data Collection
          </h3>
          {[
            {
              name: "collectsUserData",
              label: "Does your app collect any user data?",
            },
            {
              name: "bettingOrGambling",
              label: "Your app Betting or Gambling?",
            },
            { name: "earningOrAds", label: "Your app Earning or Ads Views?" },
            {
              name: "mobileBanking",
              label: "Your app Mobile Banking or Financial?",
            },
            { name: "government", label: "Your Government?" },
            {
              name: "sharesDataWithThirdParties",
              label: "Is any user data shared with third parties?",
            },
            { name: "showsAds", label: "Does your app show ads?" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-lg font-medium mb-5">{label}</label>
              <Controller
                name={name}
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <div className="flex gap-12">
                    <label className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-6 py-4 rounded-2xl transition">
                      <input
                        type="radio"
                        {...field}
                        value="Yes"
                        checked={field.value === "Yes"}
                        className="w-6 h-6 accent-purple-500 cursor-pointer"
                      />
                      <span className="text-lg font-medium">Yes</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-6 py-4 rounded-2xl transition">
                      <input
                        type="radio"
                        {...field}
                        value="No"
                        checked={field.value === "No"}
                        className="w-6 h-6 accent-purple-500 cursor-pointer"
                      />
                      <span className="text-lg font-medium">No</span>
                    </label>
                  </div>
                )}
              />
              {errors[name] && (
                <p className="text-red-400 mt-3">{errors[name].message}</p>
              )}
            </div>
          ))}
        </div>

        {/* Children’s Data */}
        <div>
          <label className="block text-lg font-medium mb-5">
            Is your app intended for children under 13?
          </label>
          <Controller
            name="intendedForChildren"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <div className="flex gap-12">
                <label className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-6 py-4 rounded-2xl transition">
                  <input
                    type="radio"
                    {...field}
                    value="Yes"
                    checked={field.value === "Yes"}
                    className="w-6 h-6 accent-purple-500 cursor-pointer"
                  />
                  <span className="text-lg font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-6 py-4 rounded-2xl transition">
                  <input
                    type="radio"
                    {...field}
                    value="No"
                    checked={field.value === "No"}
                    className="w-6 h-6 accent-purple-500 cursor-pointer"
                  />
                  <span className="text-lg font-medium">No</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-6 py-4 rounded-2xl transition">
                  <input
                    type="radio"
                    {...field}
                    value="Both"
                    checked={field.value === "Both"}
                    className="w-6 h-6 accent-purple-500 cursor-pointer"
                  />
                  <span className="text-lg font-medium">Both</span>
                </label>
              </div>
            )}
          />
        </div>

        {/* Child Data Types */}
        {intendedForChildren === "Yes" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <label className="block text-lg font-medium">
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
                      className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition"
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
                        className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                      />
                      <span className="text-base">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Purpose of Data Collection */}
        <div>
          <label className="block text-lg font-medium mb-5">
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
                    className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition"
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
                      className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Data Shared With */}
        {sharesDataWithThirdParties === "Yes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block text-lg font-medium mb-5">
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
                      className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition"
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
                        className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Data Protection */}
        <div>
          <label className="block text-lg font-medium mb-5">
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
                    className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition"
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
                      className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Data Retention */}
        <div>
          <label className="block text-lg font-medium mb-5">
            Data retention period:
          </label>
          <Controller
            name="dataRetention"
            control={control}
            render={({ field }) => (
              <div className="space-y-5">
                <label className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition">
                  <input
                    type="checkbox"
                    value="Until account deletion"
                    checked={field.value.includes("Until account deletion")}
                    onChange={(e) => {
                      const newVal = e.target.checked
                        ? [...field.value, "Until account deletion"]
                        : field.value.filter(
                            (v) => v !== "Until account deletion"
                          );
                      field.onChange(newVal);
                    }}
                    className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                  />
                  <span>Until account deletion</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition">
                  <input
                    type="checkbox"
                    value="Fixed period (Specify duration)"
                    checked={field.value.includes(
                      "Fixed period (Specify duration)"
                    )}
                    onChange={(e) => {
                      const newVal = e.target.checked
                        ? [...field.value, "Fixed period (Specify duration)"]
                        : field.value.filter(
                            (v) => v !== "Fixed period (Specify duration)"
                          );
                      field.onChange(newVal);
                    }}
                    className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                  />
                  <span>Fixed period (Specify duration)</span>
                </label>
              </div>
            )}
          />
        </div>

        {/* User Controls */}
        <div>
          <label className="block text-lg font-medium mb-5">
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
                    className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition"
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
                      className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Child Compliance */}
        {intendedForChildren === "Yes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block text-lg font-medium mb-5">
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
                      className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition"
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
                        className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Sensitive Permissions */}
        <div>
          <label className="block text-lg font-medium mb-5">
            Does your app access sensitive permissions?
          </label>
          <Controller
            name="sensitivePermissions"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
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
                    className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition"
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
                      className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          />

          {sensitivePermissions.length > 0 && (
            <>
              <label className="block text-lg font-medium mb-3">
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
                    rows={5}
                    placeholder="Explain why your app needs these permissions..."
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 transition resize-none"
                  />
                )}
              />
              {errors.permissionReason && (
                <p className="text-red-400 mt-3">
                  {errors.permissionReason.message}
                </p>
              )}
            </>
          )}
        </div>

        {/* Advertising Details */}
        {showsAds === "Yes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block text-lg font-medium mb-5">
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
                      className="flex items-center gap-4 cursor-pointer hover:bg-white/5 px-5 py-4 rounded-2xl transition"
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
                        className="w-6 h-6 accent-purple-500 rounded cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Support Contact */}
        <div>
          <label className="block text-lg font-medium mb-3">
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
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 transition"
              />
            )}
          />
          {errors.supportContact && (
            <p className="text-red-400 mt-3">{errors.supportContact.message}</p>
          )}
        </div>

        {/* Developer Declaration */}
        <div>
          <label className="block text-2xl font-bold mb-6 text-purple-300">
            🔒 Developer Declaration
          </label>
          <p className="text-gray-300 mb-8 leading-relaxed">
            I confirm that the information provided above is accurate and that
            my app complies with all applicable data protection laws, including
            GDPR, CCPA, and marketplace policies.
          </p>
          <Controller
            name="declarations"
            control={control}
            rules={{
              validate: (v) =>
                v.length === 4 || "You must agree to all declarations",
            }}
            render={({ field }) => (
              <div className="space-y-6">
                {[
                  "This App all info correct",
                  "Trams & Conditions",
                  "Refund Policy",
                  "Data Safety correct",
                ].map((text) => (
                  <label
                    key={text}
                    className="flex items-center gap-5 cursor-pointer hover:bg-white/5 px-6 py-5 rounded-2xl transition text-lg"
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
                      className="w-7 h-7 accent-purple-500 rounded cursor-pointer"
                    />
                    <span className="font-medium">{text}</span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.declarations && (
            <p className="text-red-400 mt-4">{errors.declarations.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-12">
          <button
            type="button"
            onClick={onBack}
            className="px-12 py-6 bg-gray-700/60 hover:bg-gray-600 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
          >
            ← Back to Step 1
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="relative px-16 py-7 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-purple-600/60 transition transform hover:scale-105 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <>
                <span className="opacity-0">Publish APK</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <span className="absolute inset-0 flex items-center justify-center text-white">
                  Publishing...
                </span>
              </>
            ) : (
              "🚀 Publish APK"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Step2Form;
