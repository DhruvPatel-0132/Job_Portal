import { motion } from "framer-motion";

export default function SkillsCard({ skills }) {
  return (
    <motion.div className="bg-white p-6 rounded-xl shadow">
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