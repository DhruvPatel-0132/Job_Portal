import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";

export default function AboutCard({ about, onEdit }) {
  return (
    <motion.div className="bg-white p-6 rounded-xl shadow relative">
      <button
        onClick={onEdit}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        aria-label="Edit About"
      >
        <Edit2 size={20} className="text-gray-600" />
      </button>

      <h2 className="text-lg font-semibold mb-6">About</h2>
      <p className="text-sm text-gray-700 whitespace-pre-wrap">
        {about || <span className="text-gray-500 italic">No description added yet.</span>}
      </p>
    </motion.div>
  );
}