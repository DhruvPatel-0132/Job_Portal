import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Briefcase,
  Calendar,
  FileText,
  Award,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

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

const TextAreaField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={16} />
      </div>
      <textarea
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all resize-none"
        rows={3}
        {...props}
      />
    </div>
  </div>
);

const EMPTY_EXPERIENCE = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  responsibilities: "",
  achievements: "",
};

const ExperienceStep = ({ formData, setFormData, onNext, onBack }) => {
  const experiences = formData.experience?.length > 0 ? formData.experience : [{ ...EMPTY_EXPERIENCE }];

  const updateExperience = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.experience || [{ ...EMPTY_EXPERIENCE }])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), { ...EMPTY_EXPERIENCE }],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

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
              Work Experience
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Share your professional experience
            </p>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="relative"
                >
                  <div className={`p-6 rounded-xl border ${index === 0 ? "border-blue-100 bg-blue-50/20" : "border-gray-100 bg-gray-50/30"}`}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Experience {index + 1}
                      </span>
                      {experiences.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeExperience(index)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        icon={Building2}
                        label="Company"
                        placeholder="Google Inc."
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                      />
                      <InputField
                        icon={Briefcase}
                        label="Position"
                        placeholder="Senior Software Engineer"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, "position", e.target.value)}
                      />
                      <InputField
                        icon={Calendar}
                        label="Start Date"
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                      />
                      <InputField
                        icon={Calendar}
                        label="End Date"
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                      />
                      <div className="md:col-span-2">
                        <TextAreaField
                          icon={FileText}
                          label="Responsibilities"
                          placeholder="Describe your key responsibilities..."
                          value={exp.responsibilities}
                          onChange={(e) => updateExperience(index, "responsibilities", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <TextAreaField
                          icon={Award}
                          label="Achievements"
                          placeholder="Highlight your key achievements..."
                          value={exp.achievements}
                          onChange={(e) => updateExperience(index, "achievements", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addExperience}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add More Experience
          </motion.button>
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

export default ExperienceStep;
