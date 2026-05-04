import React from "react";
import { motion } from "framer-motion";
import { LibraryBig } from "lucide-react";
import InputField from "./InputField";

export default function AboutSection({ editData, update }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-5">
        <InputField
          label="About You"
          field="about"
          value={editData.about}
          onChange={update}
          icon={LibraryBig}
          isTextarea={true}
          rows={6}
          placeholder="Describe yourself, your achievements, and your goals..."
        />
      </div>
    </motion.div>
  );
}
