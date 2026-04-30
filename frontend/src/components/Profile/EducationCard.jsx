import { motion } from "framer-motion";

export default function EducationCard({ education }) {
  return (
    <motion.div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Education</h2>

      {education.map((edu, i) => (
        <div key={i} className="border-l-2 pl-3">
          <h3 className="font-medium">{edu.school}</h3>
          <p className="text-sm text-gray-600">
            {edu.degree} in {edu.fieldOfStudy}
          </p>
        </div>
      ))}
    </motion.div>
  );
}