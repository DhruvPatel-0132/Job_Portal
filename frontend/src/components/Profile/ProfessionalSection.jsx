import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import InputField from "./InputField";

export default function ProfessionalSection({ editData, update }) {
  const [newSkills, setNewSkills] = useState({});
  const experiences = Array.isArray(editData.experience)
    ? editData.experience
    : [];

  const handleExpChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    update("experience", updated);
  };

  const addExperience = () => {
    update("experience", [
      ...experiences,
      {
        title: "",
        company: "",
        employmentType: "",
        locationType: "",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
        skills: [],
      },
    ]);
  };

  const removeExperience = (index) => {
    const updated = [...experiences];
    updated.splice(index, 1);
    update("experience", updated);
  };

  const handleAddSkill = (index, e) => {
    e?.preventDefault();
    const skill = newSkills[index]?.trim();
    if (skill && !experiences[index].skills?.includes(skill)) {
      handleExpChange(index, "skills", [...(experiences[index].skills || []), skill]);
      setNewSkills({ ...newSkills, [index]: "" });
    }
  };

  const handleRemoveSkill = (index, skillToRemove) => {
    handleExpChange(
      index,
      "skills",
      experiences[index].skills.filter((s) => s !== skillToRemove)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative space-y-5"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-900">
              Experience {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Title"
              field="title"
              value={exp.title}
              onChange={(field, val) => handleExpChange(index, field, val)}
              placeholder="e.g. Software Engineer"
            />
            <InputField
              label="Company"
              field="company"
              value={exp.company}
              onChange={(field, val) => handleExpChange(index, field, val)}
              placeholder="e.g. Google"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">
                Employment Type
              </label>
              <select
                value={exp.employmentType || ""}
                onChange={(e) =>
                  handleExpChange(index, "employmentType", e.target.value)
                }
                className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-[15px] text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200 hover:border-gray-300"
              >
                <option value="">Select...</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">
                Location Type
              </label>
              <select
                value={exp.locationType || ""}
                onChange={(e) =>
                  handleExpChange(index, "locationType", e.target.value)
                }
                className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-[15px] text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200 hover:border-gray-300"
              >
                <option value="">Select...</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <InputField
            label="Location"
            field="location"
            value={exp.location}
            onChange={(field, val) => handleExpChange(index, field, val)}
            placeholder="e.g. San Francisco, CA"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Start Date"
              field="startDate"
              type="month"
              value={exp.startDate}
              onChange={(field, val) => handleExpChange(index, field, val)}
            />
            <div
              className={`transition-opacity duration-200 ${exp.currentlyWorking ? "opacity-50 pointer-events-none" : ""}`}
            >
              <InputField
                label="End Date"
                field="endDate"
                type="month"
                value={exp.currentlyWorking ? "" : exp.endDate}
                onChange={(field, val) => handleExpChange(index, field, val)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const newWorkingState = !exp.currentlyWorking;
                const updated = [...experiences];
                updated[index] = {
                  ...updated[index],
                  currentlyWorking: newWorkingState,
                  ...(newWorkingState ? { endDate: "" } : {}),
                };
                update("experience", updated);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${exp.currentlyWorking ? "bg-black" : "bg-gray-200"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${exp.currentlyWorking ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className="text-[14px] text-gray-700 font-medium">
              I am currently working in this role
            </span>
          </div>

          <InputField
            label="Description"
            field="description"
            value={exp.description}
            onChange={(field, val) => handleExpChange(index, field, val)}
            isTextarea={true}
            rows={4}
            placeholder="Describe your responsibilities and achievements..."
          />

          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-medium text-gray-700">Skills</label>
            <div className="flex items-end gap-3">
              <div
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(index, e);
                  }
                }}
              >
                <InputField
                  label=""
                  field={`newSkill-${index}`}
                  value={newSkills[index] || ""}
                  onChange={(field, val) => setNewSkills({ ...newSkills, [index]: val })}
                  placeholder="e.g., React, Node.js"
                />
              </div>
              <button
                type="button"
                onClick={(e) => handleAddSkill(index, e)}
                className="flex items-center justify-center h-[46px] px-5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-[14px] shadow-sm shrink-0"
              >
                <Plus size={18} className="mr-1.5" />
                Add
              </button>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200/80 p-3 min-h-[56px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-wrap gap-2">
              <AnimatePresence>
                {(exp.skills || []).map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-800 text-[13px] font-medium rounded-lg border border-gray-200/60"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index, skill)}
                      className="p-0.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              {(!exp.skills || exp.skills.length === 0) && (
                <p className="text-[13px] text-gray-400 w-full py-1.5">
                  No skills added to this experience.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="flex items-center justify-center w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-[15px]"
      >
        <Plus size={18} className="mr-2" />
        Add Experience
      </button>
    </motion.div>
  );
}
