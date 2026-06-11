import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const PRESET_SKILLS = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "TypeScript",
  "JavaScript",
  "Docker",
  "Redis",
  "GraphQL",
  "Tailwind CSS",
  "Git",
  "REST API",
  "Java",
  "Go",
  "Kubernetes",
];

const SkillsStep = ({ formData, setFormData, onNext, onBack }) => {
  const [newSkill, setNewSkill] = useState("");

  const skills = formData.skills || [];

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...(prev.skills || []), skill],
    }));
  };

  const addCustomSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomSkill();
    }
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
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Skills
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select your skills or add custom ones
            </p>
          </div>

          {/* Auto-fill hint */}
          {formData.resume?.uploaded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 mb-6"
            >
              <Sparkles size={14} className="text-purple-600" />
              <span className="text-xs font-bold text-purple-700">
                Skills can be auto-filled from your resume
              </span>
            </motion.div>
          )}

          {/* Selected Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Selected ({skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      {skill}
                      <button
                        onClick={() => toggleSkill(skill)}
                        className="hover:bg-blue-500 rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Preset Skills */}
          <div className="mb-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Popular Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_SKILLS.map((skill) => {
                const isSelected = skills.includes(skill);
                return (
                  <motion.button
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-gray-50 text-gray-600 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {skill}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Add Custom Skill */}
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a custom skill..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addCustomSkill}
              disabled={!newSkill.trim()}
              className="px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              <Plus size={16} />
              Add
            </motion.button>
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

export default SkillsStep;
