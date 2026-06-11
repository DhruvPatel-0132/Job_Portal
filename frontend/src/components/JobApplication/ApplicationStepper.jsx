import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  { num: 1, label: "Job Details" },
  { num: 2, label: "Basic Details" },
  { num: 3, label: "Resume" },
  { num: 4, label: "Questions" },
  { num: 5, label: "Preview" },
];

const ApplicationStepper = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full py-4 px-2">
      {/* Progress bar background */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 rounded-full" />
        <motion.div
          className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ maxWidth: "calc(100% - 32px)" }}
        />

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          const isClickable = step.num <= currentStep;

          return (
            <div
              key={step.num}
              className="relative flex flex-col items-center z-10"
              style={{ width: "fit-content" }}
            >
              <motion.button
                onClick={() => isClickable && onStepClick?.(step.num)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.15 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/60 cursor-pointer"
                    : isCurrent
                    ? "bg-white border-2 border-blue-600 text-blue-600 shadow-lg shadow-blue-100/80 ring-4 ring-blue-50 cursor-default"
                    : "bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  step.num
                )}
              </motion.button>

              <span
                className={`mt-2 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                  isCompleted
                    ? "text-blue-600"
                    : isCurrent
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationStepper;
