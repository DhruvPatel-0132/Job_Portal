import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import InputField from "./InputField";

export default function ContactSection({ editData, update }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Email Address"
          field="email"
          value={editData.email}
          onChange={update}
          type="email"
          icon={Mail}
        />
        <InputField
          label="Phone Number"
          field="phone"
          value={editData.phone}
          onChange={update}
          type="tel"
          icon={Phone}
        />
      </div>
    </motion.div>
  );
}
