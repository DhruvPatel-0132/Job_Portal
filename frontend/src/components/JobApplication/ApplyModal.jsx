import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  FileText,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import QuickApply from "./QuickApply";

const ApplyModal = ({ job, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showQuickApply, setShowQuickApply] = React.useState(false);

  if (!isOpen) return null;

  const handleFullApplication = () => {
    onClose();
    navigate(`/jobs/apply/${job.id}`, { state: { job } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Top gradient */}
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

              <div className="p-6">
                {/* Close button */}
                <div className="flex justify-end mb-2">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={18} className="text-gray-400" />
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {!showQuickApply ? (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Header */}
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                          Apply for {job.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Choose how you'd like to apply
                        </p>
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {/* Quick Apply */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowQuickApply(true)}
                          className="w-full p-5 rounded-2xl border-2 border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:border-blue-300 transition-all text-left group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/50 shrink-0">
                              <Zap size={22} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-extrabold text-gray-900">
                                  Quick Apply
                                </h3>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black rounded-full uppercase tracking-wider">
                                  Fast
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Apply instantly with your profile data
                              </p>
                              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-bold">
                                <Clock size={10} />
                                <span>Takes less than 30 seconds</span>
                              </div>
                            </div>
                            <ArrowRight
                              size={16}
                              className="text-gray-300 group-hover:text-blue-600 transition-colors mt-1"
                            />
                          </div>
                        </motion.button>

                        {/* Full Application */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleFullApplication}
                          className="w-full p-5 rounded-2xl border-2 border-gray-100 hover:border-gray-300 transition-all text-left group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg shadow-gray-200/50 shrink-0">
                              <FileText size={22} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-extrabold text-gray-900">
                                  Full Application
                                </h3>
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-wider">
                                  Recommended
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Complete detailed application with all sections
                              </p>
                              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-bold">
                                <Clock size={10} />
                                <span>Takes about 10-15 minutes</span>
                              </div>
                            </div>
                            <ArrowRight
                              size={16}
                              className="text-gray-300 group-hover:text-gray-600 transition-colors mt-1"
                            />
                          </div>
                        </motion.button>
                      </div>

                      {/* Benefits of full application */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                          Full Application Benefits
                        </p>
                        <div className="space-y-2">
                          {[
                            "AI-powered resume analysis",
                            "Higher visibility to recruiters",
                            "Detailed skill matching",
                          ].map((benefit) => (
                            <div
                              key={benefit}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle2
                                size={12}
                                className="text-emerald-500"
                              />
                              <span className="text-xs text-gray-600 font-medium">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quickApply"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Back button */}
                      <button
                        onClick={() => setShowQuickApply(false)}
                        className="text-xs font-bold text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
                      >
                        ← Back to options
                      </button>
                      <QuickApply job={job} onClose={onClose} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ApplyModal;
