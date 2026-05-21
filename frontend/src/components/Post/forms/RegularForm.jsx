import React from "react";
import { motion } from "motion/react";

const RegularForm = ({ content, setContent }) => {
  return (
    <motion.textarea
      key="regular"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      placeholder="What do you want to talk about?"
      className="w-full min-h-[150px] text-[18px] leading-relaxed resize-none focus:outline-none placeholder-gray-400 font-normal"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
};

export default RegularForm;
