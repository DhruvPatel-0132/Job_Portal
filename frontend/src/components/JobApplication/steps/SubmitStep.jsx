import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  PartyPopper,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";

const SubmitStep = ({ formData, job, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="submit"
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
                  <Send size={32} className="text-blue-600" />
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Ready to Submit?
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                  You're applying for{" "}
                  <span className="font-bold text-gray-900">
                    {job.title}
                  </span>{" "}
                  at{" "}
                  <span className="font-bold text-gray-900">
                    {job.company}
                  </span>
                </p>

                {/* Quick Summary Stats */}
                <div className="flex items-center justify-center gap-6 mt-8 mb-8">
                  <div className="text-center">
                    <p className="text-lg font-black text-blue-600 truncate max-w-[120px]">
                      {formData.basicInfo?.highestEducation || "—"}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                      Education
                    </p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-600">
                      {formData.resume?.score || "—"}%
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                      Match
                    </p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-purple-600">
                      {Object.keys(formData.questions || {}).length}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                      Questions
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-200/60 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Application
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Back to Review
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Success State */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="p-12 text-center">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200/50 mb-6"
                >
                  <CheckCircle2 size={48} className="text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PartyPopper size={24} className="text-amber-500" />
                    <h2 className="text-2xl font-extrabold text-gray-900">
                      Application Submitted!
                    </h2>
                    <PartyPopper size={24} className="text-amber-500 scale-x-[-1]" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                    Your application for{" "}
                    <span className="font-bold text-gray-900">
                      {job.title}
                    </span>{" "}
                    at{" "}
                    <span className="font-bold text-gray-900">
                      {job.company}
                    </span>{" "}
                    has been successfully submitted. We'll notify you about the status.
                  </p>
                </motion.div>

                {/* Timeline */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 p-5 bg-gray-50/80 rounded-xl inline-block"
                >
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    What's Next
                  </p>
                  <div className="space-y-3 text-left">
                    {[
                      "Application is being reviewed",
                      "Recruiter will reach out within 3-5 days",
                      "Technical assessment may follow",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            i === 0
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.history.back()}
                  className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Jobs
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubmitStep;
