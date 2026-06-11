import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  FolderOpen,
  MessageSquare,
  Pencil,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  PartyPopper,
  Send,
  ArrowLeft,
  AlertTriangle,
  X,
} from "lucide-react";

const SectionCard = ({ icon: Icon, title, children, onEdit, stepNum }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-gray-100 overflow-hidden"
  >
    <div className="flex items-center justify-between px-5 py-3 bg-gray-50/70 border-b border-gray-100">
      <div className="flex items-center gap-2.5">
        <Icon size={15} className="text-blue-600" />
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onEdit(stepNum)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors uppercase tracking-wider"
      >
        <Pencil size={11} />
        Edit
      </motion.button>
    </div>
    <div className="p-5">{children}</div>
  </motion.div>
);

const InfoRow = ({ label, value }) =>
  value ? (
    <div className="flex items-start gap-2 py-1">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider w-32 shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  ) : null;

const ReviewStep = ({ formData, job, onEdit, onNext, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const bi = formData.basicInfo || {};
  const pr = formData.professional || {};
  const qa = formData.questions || {};

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="max-w-2xl mx-auto"
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
                <span className="font-bold text-gray-900">{job?.title}</span> at{" "}
                <span className="font-bold text-gray-900">{job?.company}</span>{" "}
                has been successfully submitted. We'll notify you about the status.
              </p>
            </motion.div>

            {/* Timeline and Actions */}
            <div className="flex flex-col items-center justify-center mt-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="w-full max-w-sm p-6 bg-gray-50/80 rounded-xl border border-gray-100 text-left"
              >
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  What's Next
                </p>
                <div className="space-y-4">
                  {[
                    "Application is being reviewed",
                    "Recruiter will reach out within 3-5 days",
                    "Technical assessment may follow",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
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
                className="mt-6 w-full max-w-sm px-8 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-gray-200/50 hover:shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Jobs
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Review Your Application
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Please review all details before submitting
        </p>
      </div>

      <div className="space-y-4">
        {/* Personal Details */}
        <SectionCard icon={User} title="Personal Details" onEdit={onEdit} stepNum={2}>
          <div className="space-y-1">
            <InfoRow label="Name" value={`${bi.firstName || ""} ${bi.lastName || ""}`.trim()} />
            <InfoRow label="Email" value={bi.email} />
            <InfoRow label="Phone" value={bi.phone} />
            <InfoRow label="Location" value={bi.location} />
            <InfoRow label="LinkedIn" value={bi.linkedin} />
            <InfoRow label="Portfolio" value={bi.portfolio} />
            <InfoRow label="Highest Education" value={bi.highestEducation} />
            {bi.website && <InfoRow label="Website" value={bi.website} />}
            {bi.currentCompany && <InfoRow label="Company" value={bi.currentCompany} />}
          </div>
        </SectionCard>

        {/* Resume */}
        <SectionCard icon={FileText} title="Resume" onEdit={onEdit} stepNum={3}>
          {formData.resume?.uploaded ? (
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-sm font-medium text-gray-800">
                {formData.resume.fileName}
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Score: {formData.resume.score}%
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">No resume uploaded</span>
          )}
        </SectionCard>

        {/* Questions */}
        <SectionCard icon={MessageSquare} title="Additional Questions" onEdit={onEdit} stepNum={4}>
          {Object.keys(qa).length > 0 ? (
            <div className="space-y-2">
              {qa.sponsorship && <InfoRow label="Sponsorship" value={qa.sponsorship} />}
              {qa.remote && <InfoRow label="Remote Exp" value={qa.remote} />}
              {qa.relocate && <InfoRow label="Relocate" value={qa.relocate} />}
              {qa.noticePeriod && <InfoRow label="Notice Period" value={qa.noticePeriod} />}
              {qa.whyJoin && (
                <div className="mt-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Why Join
                  </span>
                  <p className="text-sm text-gray-800 mt-1 line-clamp-2">{qa.whyJoin}</p>
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">No questions answered</span>
          )}
        </SectionCard>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors hover:bg-gray-50 flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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
      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto">
                <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <AlertTriangle size={32} className="text-amber-500" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                    Submit Application?
                  </h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to submit your application for{" "}
                    <span className="font-bold text-gray-900">{job?.title}</span>? 
                    You won't be able to edit your details after submitting.
                  </p>
                  
                  <div className="flex gap-3 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmSubmit}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      Yes, Submit
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReviewStep;
