import React, { useState } from "react";
import Step1Form from "../../components/UploadForm/Step1Form";
import Step2Form from "../../components/UploadForm/Step2Form";

const UploadApk = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({}); // Always starts as object

  const handleNext = (step1Data) => {
    setFormData((prev) => ({ ...prev, ...step1Data }));
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto pt-10 px-6">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 text-center">
          Publish Your APK
        </h1>

        {currentStep === 1 && (
          <Step1Form
            onNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {currentStep === 2 && (
          <Step2Form formData={formData} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default UploadApk;
