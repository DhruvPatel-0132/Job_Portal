import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  Shield,
  Calendar,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const RadioGroup = ({ label, options, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <motion.button
          key={opt}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(opt)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${value === opt
              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200/50"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
            }`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  </div>
);

const SelectField = ({ icon: Icon, label, options, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={16} />
      </div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  </div>
);

const InputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={16} />
      </div>
      <input
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
        {...props}
      />
    </div>
  </div>
);

const ProfessionalStep = ({ formData, setFormData, onNext, onBack }) => {
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      professional: { ...prev.professional, [field]: value },
    }));
  };

  const data = formData.professional || {};

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Professional Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tell us about your professional background
            </p>
          </div>

          <div className="space-y-6">
            <InputField
              icon={Briefcase}
              label="Current Role"
              placeholder="Senior Software Engineer"
              value={data.currentRole || ""}
              onChange={(e) => updateField("currentRole", e.target.value)}
            />

            <RadioGroup
              label="Years of Experience"
              options={["0-1", "1-3", "3-5", "5+"]}
              value={data.experience}
              onChange={(val) => updateField("experience", val)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                icon={DollarSign}
                label="Current CTC"
                placeholder="$80,000"
                value={data.currentCTC || ""}
                onChange={(e) => updateField("currentCTC", e.target.value)}
              />
              <InputField
                icon={DollarSign}
                label="Expected CTC"
                placeholder="$120,000"
                value={data.expectedCTC || ""}
                onChange={(e) => updateField("expectedCTC", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                icon={Clock}
                label="Notice Period"
                options={[
                  "Immediately",
                  "15 Days",
                  "30 Days",
                  "60 Days",
                  "90 Days",
                ]}
                value={data.noticePeriod}
                onChange={(val) => updateField("noticePeriod", val)}
              />
              <InputField
                icon={Calendar}
                label="Available to Join"
                type="date"
                value={data.availableDate || ""}
                onChange={(e) => updateField("availableDate", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                icon={MapPin}
                label="Preferred Location"
                placeholder="San Francisco, Remote"
                value={data.preferredLocation || ""}
                onChange={(e) =>
                  updateField("preferredLocation", e.target.value)
                }
              />
              <SelectField
                icon={Shield}
                label="Work Authorization"
                options={[
                  "Authorized to Work",
                  "Require Visa Sponsorship",
                  "Employment Visa Holder",
                  "OCI/PIO Card Holder",
                  "Student Visa",
                  "Dependent Visa",
                  "Other",
                ]}
                value={data.workAuth}
                onChange={(val) => updateField("workAuth", val)}
              />
            </div>
          </div>
        </div>
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
          onClick={onNext}
          className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfessionalStep;
