// src/pages/UploadApk/UploadApk.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ← Add AnimatePresence here!
import Step1Form from "../../components/UploadForm/Step1Form";
import Step2Form from "../../components/UploadForm/Step2Form";

const UploadApk = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = (step1Data) => {
    setFormData((prev) => ({ ...prev, ...step1Data }));
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

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
            Publish Your APK
          </h1>
          <p className="text-gray-400 text-lg mt-4">
            Share your amazing app with the world in just a few steps
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-8">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: currentStep >= step ? 1 : 0.8 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500
                    ${
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
                      initial={{ width: 0 }}
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
              <Step1Form
                onNext={handleNext}
                formData={formData}
                setFormData={setFormData}
              />
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
              <Step2Form formData={formData} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadApk;
