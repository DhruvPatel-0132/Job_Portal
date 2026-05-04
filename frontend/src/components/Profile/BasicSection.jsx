import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, User, Sparkles, Calendar, Image as ImageIcon, Trash2 } from "lucide-react";
import InputField from "./InputField";
import { uploadToCloudinary } from "../../utils/cloudinary";

export default function BasicSection({ editData, update }) {
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState({ avatar: false, banner: false });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading((prev) => ({ ...prev, avatar: true }));
        const url = await uploadToCloudinary(file);
        update("avatar", url);
      } catch (error) {
        console.error("Avatar upload failed:", error);
        alert("Failed to upload avatar.");
      } finally {
        setIsUploading((prev) => ({ ...prev, avatar: false }));
      }
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading((prev) => ({ ...prev, banner: true }));
        const url = await uploadToCloudinary(file);
        update("banner", url);
      } catch (error) {
        console.error("Banner upload failed:", error);
        alert("Failed to upload banner.");
      } finally {
        setIsUploading((prev) => ({ ...prev, banner: false }));
      }
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
      {/* Image Upload Section */}
      <div className="space-y-6 pb-6 border-b border-gray-100">
        {/* Avatar Section */}
        <div className="flex items-center gap-5">
          <input 
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div 
            className="relative group cursor-pointer"
            onClick={() => !isUploading.avatar && avatarInputRef.current?.click()}
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden">
              {isUploading.avatar ? (
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : editData.avatar ? (
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
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Profile Picture
            </h3>
            <p className="text-[13px] text-gray-500 mt-0.5">PNG, JPG under 5MB</p>
            <div className="flex items-center gap-4 mt-2">
              <button 
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploading.avatar}
                className="text-[13px] font-medium text-black hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {isUploading.avatar ? "Uploading..." : "Upload new picture"}
              </button>
              {editData.avatar && !isUploading.avatar && (
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

        {/* Banner Section - Now Below Avatar */}
        <div className="pt-4 border-t border-gray-50">
          <input 
            type="file"
            accept="image/*"
            ref={bannerInputRef}
            className="hidden"
            onChange={handleBannerChange}
          />
          <h3 className="text-sm font-semibold text-gray-900">
            Profile Banner
          </h3>
          <p className="text-[13px] text-gray-500 mt-0.5">Header background image</p>
          
          <div 
            className="mt-3 relative h-24 w-full rounded-xl bg-gray-50 border border-gray-200 overflow-hidden group cursor-pointer hover:border-gray-300 transition-all shadow-sm"
            onClick={() => !isUploading.banner && bannerInputRef.current?.click()}
          >
            {isUploading.banner && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] z-20">
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span className="text-[11px] font-medium text-gray-600 mt-2">Uploading Banner...</span>
               </div>
            )}

            {editData.banner ? (
              <img 
                src={editData.banner} 
                className="w-full h-full object-cover" 
                alt="Banner Preview" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-400">
                  <ImageIcon size={18} />
                </div>
                <span className="text-[12px] font-medium text-gray-500">Click to upload banner</span>
              </div>
            )}
            
            {!isUploading.banner && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-[12px] font-semibold text-black shadow-sm">
                  <Camera size={14} />
                  {editData.banner ? "Change Image" : "Upload Image"}
                </div>
                {editData.banner && (
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      update("banner", "");
                    }}
                    className="p-1.5 bg-white rounded-lg text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
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
