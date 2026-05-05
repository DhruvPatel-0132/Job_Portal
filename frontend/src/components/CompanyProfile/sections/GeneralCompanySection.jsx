import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { uploadToCloudinary } from "../../../utils/cloudinary";

export default function GeneralCompanySection({ editData, update }) {
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState({ logo: false, banner: false });

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading((prev) => ({ ...prev, logo: true }));
        const url = await uploadToCloudinary(file);
        update("logo", url);
      } catch (error) {
        console.error("Logo upload failed:", error);
        alert("Failed to upload logo.");
      } finally {
        setIsUploading((prev) => ({ ...prev, logo: false }));
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
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-6 pb-6 border-b border-gray-100">
        {/* Logo Section */}
        <div className="flex items-center gap-5">
          <input
            type="file"
            accept="image/*"
            ref={logoInputRef}
            className="hidden"
            onChange={handleLogoChange}
          />
          <div
            className="relative group cursor-pointer"
            onClick={() => !isUploading.logo && logoInputRef.current?.click()}
          >
            <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden">
              {isUploading.logo ? (
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : editData.logo ? (
                <img
                  src={editData.logo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                (editData.name || "C")[0].toUpperCase()
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Company Logo</h3>
            <p className="text-[13px] text-gray-500 mt-0.5">PNG, JPG under 5MB</p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploading.logo}
                className="text-[13px] font-medium text-black hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {isUploading.logo ? "Uploading..." : "Upload new logo"}
              </button>
              {editData.logo && !isUploading.logo && (
                <button
                  onClick={() => update("logo", "")}
                  className="text-[13px] font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="pt-4 border-t border-gray-50">
          <input
            type="file"
            accept="image/*"
            ref={bannerInputRef}
            className="hidden"
            onChange={handleBannerChange}
          />
          <h3 className="text-sm font-semibold text-gray-900">Company Banner</h3>
          <p className="text-[13px] text-gray-500 mt-0.5">Header background image</p>

          <div
            className="mt-3 relative h-24 w-full rounded-xl bg-gray-50 border border-gray-200 overflow-hidden group cursor-pointer hover:border-gray-300 transition-all shadow-sm"
            onClick={() => !isUploading.banner && bannerInputRef.current?.click()}
          >
            {isUploading.banner && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] z-20">
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span className="text-[11px] font-medium text-gray-600 mt-2">
                  Uploading Banner...
                </span>
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
                <span className="text-[12px] font-medium text-gray-500">
                  Click to upload banner
                </span>
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

      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">Company Name</label>
        <input
          type="text"
          value={editData.name || ""}
          onChange={(e) => update("name", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          placeholder="e.g. TalentForge AI"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1">Tagline</label>
        <input
          type="text"
          value={editData.tagline || ""}
          onChange={(e) => update("tagline", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          placeholder="e.g. Empowering businesses with next-generation technology solutions"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1">Industry</label>
          <input
            type="text"
            value={editData.industry || ""}
            onChange={(e) => update("industry", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            placeholder="e.g. Information Technology"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1">Company Size</label>
          <select
            value={editData.companySize || ""}
            onChange={(e) => update("companySize", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          >
            <option value="">Select size</option>
            <option value="1-10 employees">1-10 employees</option>
            <option value="11-50 employees">11-50 employees</option>
            <option value="51-200 employees">51-200 employees</option>
            <option value="201-500 employees">201-500 employees</option>
            <option value="501-1000 employees">501-1000 employees</option>
            <option value="1001-5000 employees">1001-5000 employees</option>
            <option value="5001-10,000 employees">5001-10,000 employees</option>
            <option value="10,001+ employees">10,001+ employees</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1">Type</label>
          <select
            value={editData.type || ""}
            onChange={(e) => update("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          >
            <option value="">Select type</option>
            <option value="Public Company">Public Company</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Government Agency">Government Agency</option>
            <option value="Non Profit">Non Profit</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Privately Held">Privately Held</option>
            <option value="Partnership">Partnership</option>
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1">Founded Year</label>
          <input
            type="number"
            value={editData.foundedYear || ""}
            onChange={(e) => update("foundedYear", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            placeholder="e.g. 2019"
          />
        </div>
      </div>
    </div>
  );
}
