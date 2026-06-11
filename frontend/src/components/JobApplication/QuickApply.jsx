import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const QuickApply = ({ job, onClose }) => {
  const { user, profile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const userData = {
    name: user?.name || "Your Name",
    email: user?.email || "your@email.com",
    phone: profile?.phone || "Not provided",
    location: profile?.location || "Not provided",
    headline: profile?.headline || "Not provided",
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
          className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-200/50 mb-4"
        >
          <CheckCircle2 size={32} className="text-white" />
        </motion.div>
        <h3 className="text-lg font-extrabold text-gray-900">
          Application Submitted!
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Your quick application for{" "}
          <span className="font-bold text-gray-800">{job.title}</span> has been
          sent.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold"
        >
          Done
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/50">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Quick Apply</h3>
          <p className="text-xs text-gray-500">
            Apply instantly with your profile data
          </p>
        </div>
      </div>

      {/* Job Info */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-6">
        <p className="text-sm font-bold text-gray-900">{job.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {job.company} • {job.location}
        </p>
      </div>

      {/* User Data */}
      <div className="space-y-3 mb-6">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Your Profile Data
        </h4>
        <div className="space-y-2">
          {[
            { icon: User, label: "Name", value: userData.name },
            { icon: Mail, label: "Email", value: userData.email },
            { icon: Phone, label: "Phone", value: userData.phone },
            { icon: MapPin, label: "Location", value: userData.location },
            { icon: Briefcase, label: "Role", value: userData.headline },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <Icon size={14} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {label}
                </span>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {value}
                </p>
              </div>
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={14} />
            Submit Quick Application
          </>
        )}
      </motion.button>
    </div>
  );
};

export default QuickApply;
