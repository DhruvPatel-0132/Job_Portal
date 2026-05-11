import React from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";

const PostHeader = ({ postType, onClose }) => {
  const getTitle = () => {
    switch (postType) {
      case "media": return "Create a media post";
      case "job_post": return "Create a job post";
      case "article": return "Write an article";
      case "project": return "Showcase your project";
      case "achievement": return "Share an achievement";
      default: return "Create a post";
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
      <motion.button
        whileHover={{ rotate: 90, backgroundColor: "#fee2e2", color: "#ef4444" }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="p-2 rounded-full text-gray-400 transition-all"
      >
        <X className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default PostHeader;
