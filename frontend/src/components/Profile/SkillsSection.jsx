import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileChartColumn, Plus, X } from "lucide-react";
import InputField from "./InputField";

export default function SkillsSection({ editData, update }) {
  const [newSkill, setNewSkill] = useState("");
  const skills = Array.isArray(editData.skills) ? editData.skills : [];

  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      update("skills", [...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    update("skills", skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-end gap-3">
          <div className="flex-1" onKeyDown={handleKeyDown}>
            <InputField
              label="Add a Skill"
              field="newSkill"
              value={newSkill}
              onChange={(field, val) => setNewSkill(val)}
              icon={FileChartColumn}
              isTextarea={false}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>
          <button
            onClick={handleAddSkill}
            type="button"
            className="flex items-center justify-center h-[46px] px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-[14px] shadow-sm shrink-0"
          >
            <Plus size={18} className="mr-1.5" />
            Add
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-4 min-h-[120px] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 text-[14px] font-medium rounded-lg border border-gray-200/60"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            {skills.length === 0 && (
              <p className="text-[14px] text-gray-400 w-full text-center py-6">
                No skills added yet. Add some skills to stand out!
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
