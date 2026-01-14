// src/pages/UploadApk/UploadApk.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSyncAlt } from "react-icons/fa";
import Step1Form from "../../components/UploadForm/Step1Form";
import Step2Form from "../../components/UploadForm/Step2Form";

const UploadApk = () => {
  const { id } = useParams();
  const isUpdateMode = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loadingData, setLoadingData] = useState(isUpdateMode);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isUpdateMode && id) {
      const fetchApkData = async () => {
        try {
          setLoadingData(true);
          const res = await axios.get(`${API_BASE}/api/upload-apk/${id}`);
          const apk = res.data;

          // Prepare formData → keep file paths RELATIVE (no base URL prepend!)
          const preparedData = {
            // Step 1
            apkTitle: apk.apkTitle || "",
            appCategory: apk.appCategory || "",
            shortDescription: apk.shortDescription || "",
            apkLogo: apk.apkLogo || null,                  // ← relative path only
            requiresGoogleRestrictions: apk.requiresGoogleRestrictions || false,
            uploadVideo: apk.uploadVideo || null,          // ← relative path only
            appPlatform: apk.appPlatform || "",
            apkFile: apk.apkFile || null,                  // ← relative path only
            screenshots: apk.screenshots || [],            // ← array of relative paths
            websiteUrl: apk.websiteUrl || "",
            apkVersion: apk.apkVersion || "",
            tags: apk.tags || [],

            // Step 2
            fullAbout: apk.fullAbout || "",
            collectsUserData: apk.collectsUserData || "No",
            bettingOrGambling: apk.bettingOrGambling || "No",
            earningOrAds: apk.earningOrAds || "No",
            mobileBanking: apk.mobileBanking || "No",
            government: apk.government || "No",
            sharesDataWithThirdParties: apk.sharesDataWithThirdParties || "No",
            intendedForChildren: apk.intendedForChildren || "No",
            childDataTypes: apk.childDataTypes || [],
            purposeOfDataCollection: apk.purposeOfDataCollection || [],
            dataSharedWith: apk.dataSharedWith || [],
            dataProtection: apk.dataProtection || [],
            dataRetention: apk.dataRetention || [],
            userControls: apk.userControls || [],
            childCompliance: apk.childCompliance || [],
            sensitivePermissions: apk.sensitivePermissions || [],
            permissionReason: apk.permissionReason || "",
            showsAds: apk.showsAds || "No",
            adDetails: apk.adDetails || [],
            supportContact: apk.supportContact || "",
            declarations: apk.declarations || [],
          };

          setFormData(preparedData);
        } catch (err) {
          console.error("Failed to load APK:", err);
          toast.error("Failed to load app data");
          setError("Could not load app details.");
        } finally {
          setLoadingData(false);
        }
      };

      fetchApkData();
    }
  }, [id, isUpdateMode, API_BASE]);

  const handleNext = (step1Data) => {
    setFormData((prev) => ({ ...prev, ...step1Data }));
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const formProps = {
    formData,
    setFormData,
    isUpdate: isUpdateMode,
    apkId: id,
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-orange-500 text-6xl"
        >
          <FaSyncAlt />
        </motion.div>
        <p className="ml-6 text-xl text-gray-300">Loading app data...</p>
      </div>
    );
  }

  if (error && isUpdateMode) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="bg-red-900/40 p-10 rounded-2xl border border-red-600/50 max-w-lg">
          <h2 className="text-3xl text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-orange-600 rounded-xl text-white font-bold hover:bg-orange-700 transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-950 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {isUpdateMode ? "Update Your APK" : "Publish Your APK"}
          </h1>
          <p className="text-gray-400 text-lg mt-4">
            {isUpdateMode
              ? "Edit and resubmit your app for review"
              : "Share your app in just a few steps"}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-8">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  animate={{ scale: currentStep >= step ? 1 : 0.8 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500 ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-2xl shadow-orange-900/50"
                      : "bg-gray-800 text-gray-500 border-2 border-gray-700"
                  }`}
                >
                  {step}
                </motion.div>
                {step === 1 && (
                  <div className="w-32 h-1 mx-4 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: currentStep === 2 ? "100%" : "0%" }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Step1Form onNext={handleNext} {...formProps} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <Step2Form
                {...formProps}
                onBack={handleBack}
                isUpdate={isUpdateMode}
                apkId={id}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadApk;