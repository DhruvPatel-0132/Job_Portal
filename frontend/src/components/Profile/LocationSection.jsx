import React from "react";
import { motion } from "framer-motion";
import { Globe, Building2, Hash, MapPin } from "lucide-react";
import InputField from "./InputField";

export default function LocationSection({ editData, update }) {
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
          label="Country"
          field="country"
          value={editData.country}
          onChange={update}
          icon={Globe}
          placeholder="e.g. USA"
        />
        <InputField
          label="City"
          field="city"
          value={editData.city}
          onChange={update}
          icon={Building2}
          placeholder="e.g. New York"
        />
        <InputField
          label="Postal Code"
          field="code"
          value={editData.code}
          onChange={update}
          icon={Hash}
          placeholder="e.g. 10001"
        />
        <InputField
          label="Detailed Address"
          field="address"
          value={editData.address}
          onChange={update}
          icon={MapPin}
          className="sm:col-span-2"
          placeholder="e.g. 123 Main St, Apt 4B"
        />
      </div>
    </motion.div>
  );
}
