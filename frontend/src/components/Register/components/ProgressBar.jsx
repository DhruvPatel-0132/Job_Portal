import { motion } from "framer-motion";

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
      <motion.div
        className="h-full bg-black"
        animate={{ width: `${progress}%` }}
      />
    </div>
  );
}