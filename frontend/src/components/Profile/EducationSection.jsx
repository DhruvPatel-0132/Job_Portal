import React from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import InputField from "./InputField";

export default function EducationSection({ editData, update }) {
  const educations = Array.isArray(editData.education) ? editData.education : [];

  const handleEduChange = (index, field, value) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    update("education", updated);
  };

  const addEducation = () => {
    update("education", [
      ...educations,
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        stillStudying: false,
        description: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    const updated = [...educations];
    updated.splice(index, 1);
    update("education", updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {educations.map((edu, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative space-y-5"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-900">Education {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <InputField
            label="School / University"
            field="school"
            value={edu.school}
            onChange={(field, val) => handleEduChange(index, field, val)}
            placeholder="e.g. Stanford University"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Degree"
              field="degree"
              value={edu.degree}
              onChange={(field, val) => handleEduChange(index, field, val)}
              placeholder="e.g. Bachelor of Science"
            />
            <InputField
              label="Field of Study"
              field="fieldOfStudy"
              value={edu.fieldOfStudy}
              onChange={(field, val) => handleEduChange(index, field, val)}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Start Date"
              field="startDate"
              type="date"
              value={edu.startDate ? edu.startDate.split('T')[0] : ""}
              onChange={(field, val) => handleEduChange(index, field, val)}
            />
            <div className={`transition-opacity duration-200 ${edu.stillStudying ? "opacity-50 pointer-events-none" : ""}`}>
              <InputField
                label="End Date"
                field="endDate"
                type="date"
                value={edu.stillStudying ? "" : (edu.endDate ? edu.endDate.split('T')[0] : "")}
                onChange={(field, val) => handleEduChange(index, field, val)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const newStudyingState = !edu.stillStudying;
                const updated = [...educations];
                updated[index] = {
                  ...updated[index],
                  stillStudying: newStudyingState,
                  ...(newStudyingState ? { endDate: "" } : {}),
                };
                update("education", updated);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${edu.stillStudying ? "bg-black" : "bg-gray-200"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${edu.stillStudying ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className="text-[14px] text-gray-700 font-medium">I am currently studying here</span>
          </div>

          <InputField
            label="Description"
            field="description"
            value={edu.description}
            onChange={(field, val) => handleEduChange(index, field, val)}
            isTextarea={true}
            rows={4}
            placeholder="Describe your studies, activities, or societies..."
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="flex items-center justify-center w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-[15px]"
      >
        <Plus size={18} className="mr-2" />
        Add Education
      </button>
    </motion.div>
  );
}
