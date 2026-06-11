import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Building2,
  Calendar,
  Award,
  BookOpen,
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

const EMPTY_EDUCATION = {
  degree: "",
  college: "",
  passingYear: "",
  cgpa: "",
  specialization: "",
};

const EducationStep = ({ formData, setFormData, onNext, onBack }) => {
  const educations = formData.education?.length > 0 ? formData.education : [{ ...EMPTY_EDUCATION }];

  const updateEducation = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.education || [{ ...EMPTY_EDUCATION }])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...(prev.education || []), { ...EMPTY_EDUCATION }],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
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
              Education
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add your educational qualifications
            </p>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {educations.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="relative"
                >
                  {/* Entry card */}
                  <div className={`p-6 rounded-xl border ${index === 0 ? "border-blue-100 bg-blue-50/20" : "border-gray-100 bg-gray-50/30"}`}>
                    {/* Entry number & delete */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Education {index + 1}
                      </span>
                      {educations.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeEducation(index)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        icon={GraduationCap}
                        label="Degree"
                        placeholder="B.Tech in Computer Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      />
                      <InputField
                        icon={Building2}
                        label="College / University"
                        placeholder="Stanford University"
                        value={edu.college}
                        onChange={(e) => updateEducation(index, "college", e.target.value)}
                      />
                      <InputField
                        icon={Calendar}
                        label="Passing Year"
                        placeholder="2024"
                        type="number"
                        value={edu.passingYear}
                        onChange={(e) => updateEducation(index, "passingYear", e.target.value)}
                      />
                      <InputField
                        icon={Award}
                        label="CGPA / Percentage"
                        placeholder="8.5 / 10"
                        value={edu.cgpa}
                        onChange={(e) => updateEducation(index, "cgpa", e.target.value)}
                      />
                      <div className="md:col-span-2">
                        <InputField
                          icon={BookOpen}
                          label="Specialization"
                          placeholder="Machine Learning, Cloud Computing"
                          value={edu.specialization}
                          onChange={(e) => updateEducation(index, "specialization", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add More */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addEducation}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Education
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

export default EducationStep;
