import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function EducationCard({ education, onEdit }) {

  return (
    <motion.div className="bg-white p-6 rounded-xl shadow relative">
      <button
        onClick={onEdit}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        aria-label="Edit Education"
      >
        <Edit2 size={20} className="text-gray-600" />
      </button>

      <h2 className="text-lg font-semibold mb-6">Education</h2>

      <div className="space-y-6">
        {education && education.length > 0 ? (
          education.map((edu, i) => (
            <div key={i} className="relative pl-4 border-l-2 border-gray-200">
              <div className="absolute w-2.5 h-2.5 bg-gray-200 rounded-full -left-[6px] top-1.5 border-2 border-white"></div>
              <h3 className="font-semibold text-gray-900">{edu.school}</h3>
              <p className="text-[15px] text-gray-800">
                {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
              </p>
              <p className="text-[13px] text-gray-500 mt-1">
                {edu.startDate ? formatDate(edu.startDate) : ""}
                {edu.startDate && (edu.stillStudying || edu.endDate) ? " - " : ""}
                {edu.stillStudying ? "Present" : (edu.endDate ? formatDate(edu.endDate) : "")}
              </p>
              {edu.description && (
                <p className="text-[14px] text-gray-600 mt-2 leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm">No education added yet.</p>
        )}
      </div>
    </motion.div>
  );
}