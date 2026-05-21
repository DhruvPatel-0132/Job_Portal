import React from "react";
import { motion } from "motion/react";

const ToolbarButton = ({ icon, color, onClick, title }) => {
  const colorClasses = {
    blue: "text-blue-600 hover:bg-blue-50",
    orange: "text-orange-600 hover:bg-orange-50",
    indigo: "text-indigo-600 hover:bg-indigo-50",
    purple: "text-purple-600 hover:bg-purple-50",
    gray: "text-gray-600 hover:bg-gray-50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      className={`p-2.5 rounded-lg transition-colors ${colorClasses[color] || colorClasses.gray}`}
    >
      {icon}
    </motion.button>
  );
};

export default ToolbarButton;
