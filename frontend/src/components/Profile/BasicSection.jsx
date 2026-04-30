import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Camera, User, Sparkles, Calendar } from "lucide-react";
import InputField from "./InputField";

export default function BasicSection({ editData, update }) {
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        update("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Avatar Quick Edit */}
      <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
        <input 
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAvatarChange}
        />
        <div 
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden">
            {editData.avatar ? (
              <img
                src={editData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              editData.firstName?.[0] || "?"
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={20} className="text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Profile Picture
          </h3>
          <p className="text-[13px] text-gray-500 mt-0.5">PNG, JPG under 5MB</p>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-[13px] font-medium text-black hover:text-gray-600 transition-colors"
            >
              Upload new picture
            </button>
            {editData.avatar && (
              <button 
                onClick={() => update("avatar", "")}
                className="text-[13px] font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="First Name"
          field="firstName"
          value={editData.firstName}
          onChange={update}
          icon={User}
        />
        <InputField
          label="Last Name"
          field="lastName"
          value={editData.lastName}
          onChange={update}
          icon={User}
        />
        <InputField
          label="Professional Headline"
          field="headline"
          value={editData.headline}
          onChange={update}
          icon={Sparkles}
          className="sm:col-span-2"
          placeholder="e.g. Full Stack Developer"
        />
        <InputField
          label="Date of Birth"
          field="birthday"
          value={editData.birthday}
          onChange={update}
          type="date"
          icon={Calendar}
        />
      </div>
    </motion.div>
  );
}
