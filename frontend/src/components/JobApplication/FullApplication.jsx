import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationStepper from "./ApplicationStepper";
import JobDetailsStep from "./steps/JobDetailsStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import ResumeUploadStep from "./steps/ResumeUploadStep";
import QuestionsStep from "./steps/QuestionsStep";
import ReviewStep from "./steps/ReviewStep";
import { useAuthStore } from "../../store/authStore";

const FullApplication = ({ job }) => {
  const { user, profile } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    basicInfo: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      linkedin: profile?.linkedin || "",
      portfolio: profile?.portfolio || "",
      highestEducation: "",
      website: "",
      currentCompany: profile?.company || "",
    },
    resume: {},
    questions: {},
  });

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (step) => setCurrentStep(step);

  const renderStep = () => {
    const commonProps = {
      formData,
      setFormData,
      onNext: goNext,
      onBack: goBack,
      job,
    };

    switch (currentStep) {
      case 1:
        return <JobDetailsStep job={job} onNext={goNext} />;
      case 2:
        return <BasicInfoStep {...commonProps} />;
      case 3:
        return <ResumeUploadStep {...commonProps} />;
      case 4:
        return <QuestionsStep {...commonProps} />;
      case 5:
        return (
          <ReviewStep
            formData={formData}
            job={job}
            onEdit={goToStep}
            onNext={goNext}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Stepper - hidden on small screens, scrollable */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto overflow-x-auto hide-scrollbar">
          <ApplicationStepper
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-8">
        <AnimatePresence mode="wait">
          <div key={currentStep}>{renderStep()}</div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FullApplication;
