import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";

export default function SkillsCard({ skills, onEdit }) {
  return (
    <motion.div className="bg-white p-6 rounded-xl shadow relative">
      <button
        onClick={onEdit}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        aria-label="Edit Skills"
      >
        <Edit2 size={20} className="text-gray-600" />
      </button>

      <h2 className="text-lg font-semibold mb-2">Skills</h2>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.span
            key={i}
            whileHover={{ scale: 1.1 }}
            className="bg-gray-200 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}