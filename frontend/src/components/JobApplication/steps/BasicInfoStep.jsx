import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Link,
  GitBranch,
  Globe,
  Building2,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";

const InputField = ({ icon: Icon, label, required, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
      {label}
      {required && <span className="text-red-400">*</span>}
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

const SelectField = ({ icon: Icon, label, options, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
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

const BasicInfoStep = ({ formData, setFormData, onNext, onBack }) => {
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }));
  };

  const data = formData.basicInfo || {};

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
              Basic Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Let's start with your contact details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              icon={User}
              label="First Name"
              required
              placeholder="John"
              value={data.firstName || ""}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
            <InputField
              icon={User}
              label="Last Name"
              required
              placeholder="Doe"
              value={data.lastName || ""}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
            <InputField
              icon={Mail}
              label="Email"
              required
              type="email"
              placeholder="john@example.com"
              value={data.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <InputField
              icon={Phone}
              label="Phone"
              required
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={data.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <InputField
              icon={MapPin}
              label="Current Location"
              required
              placeholder="San Francisco, CA"
              value={data.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
            />
            <InputField
              icon={Link}
              label="LinkedIn"
              placeholder="linkedin.com/in/johndoe"
              value={data.linkedin || ""}
              onChange={(e) => updateField("linkedin", e.target.value)}
            />
            <InputField
              icon={GitBranch}
              label="Portfolio / GitHub"
              placeholder="github.com/johndoe"
              value={data.portfolio || ""}
              onChange={(e) => updateField("portfolio", e.target.value)}
            />
            <SelectField
              icon={GraduationCap}
              label="Highest Education"
              options={[
                "High School / GED",
                "Associate Degree",
                "Bachelor's Degree",
                "Master's Degree",
                "Doctorate (PhD)",
                "Other",
              ]}
              value={data.highestEducation}
              onChange={(val) => updateField("highestEducation", val)}
            />
          </div>

          {/* Optional Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Optional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                icon={Globe}
                label="Personal Website"
                placeholder="johndoe.dev"
                value={data.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
              />
              <InputField
                icon={Building2}
                label="Current Company"
                placeholder="Acme Corp"
                value={data.currentCompany || ""}
                onChange={(e) => updateField("currentCompany", e.target.value)}
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

export default BasicInfoStep;
