import { motion } from "framer-motion";
import { Briefcase, Edit2 } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function ExperienceCard({ experience, onEdit }) {
  if (!experience || experience.length === 0) return null;

  return (
    <motion.div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 relative">
      <button
        onClick={onEdit}
        className="absolute top-6 sm:top-8 right-6 sm:right-8 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        aria-label="Edit Experience"
      >
        <Edit2 size={20} className="text-gray-600" />
      </button>

      <h2 className="text-xl font-bold mb-8 flex items-center gap-2.5 text-gray-900">
        Experience
      </h2>

      <div className="space-y-8">
        {experience.map((exp, i) => (
          <motion.div key={i} className="relative pl-6 sm:pl-8 group">
            {/* Timeline dot */}
            <div className="absolute left-[3px] sm:left-[3px] top-2 w-2.5 h-2.5 rounded-full bg-black ring-4 ring-white group-hover:scale-110 transition-transform" />

            {/* Timeline line */}
            {i !== experience.length - 1 && (
              <div className="absolute left-[7px] top-6 bottom-[-2.5rem] w-[2px] bg-gray-100" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
              <div>
                <h3 className="text-[17px] font-bold text-gray-900">
                  {exp.title}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 text-[14px] text-gray-600 mt-1">
                  <span className="font-semibold text-gray-900">
                    {exp.company}
                  </span>

                  {(exp.employmentType || exp.locationType) && (
                    <span className="text-gray-300 mx-0.5">•</span>
                  )}
                  {exp.employmentType && <span>{exp.employmentType}</span>}

                  {exp.employmentType && exp.locationType && (
                    <span className="text-gray-300 mx-0.5">•</span>
                  )}
                  {exp.locationType && <span>{exp.locationType}</span>}
                </div>
              </div>

              <div className="text-[13px] font-medium text-gray-500 whitespace-nowrap mt-1 sm:mt-0">
                {formatDate(exp.startDate)} -{" "}
                {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                {exp.location && (
                  <span className="block sm:text-right mt-0.5 text-gray-400">
                    {exp.location}
                  </span>
                )}
              </div>
            </div>

            {exp.description && (
              <p className="text-[14px] text-gray-600 mt-3 leading-relaxed">
                {exp.description}
              </p>
            )}

            {exp.skills && exp.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[12px] font-medium bg-gray-50 text-gray-600 rounded-lg border border-gray-200/80 hover:border-gray-300 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
