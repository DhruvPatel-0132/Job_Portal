import { motion } from "framer-motion";
import { Edit2, Upload, Trash2, X } from "lucide-react";
import { useState, useRef } from "react";
import { useProfileStore } from "../../store/profileStore";

export default function ProfileHeader({ profile, onEdit }) {
  const [isBannerPopupOpen, setIsBannerPopupOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { updateProfile, fetchProfile } = useProfileStore();

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setIsBannerPopupOpen(false);
        await updateProfile({ banner: reader.result });
        fetchProfile();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerDelete = async () => {
    setIsBannerPopupOpen(false);
    await updateProfile({ banner: "" });
    fetchProfile();
  };

  return (
    <motion.div className="bg-white rounded-xl shadow relative overflow-visible">

      <div
        className="h-40 bg-cover bg-center relative bg-gray-200"
        style={profile?.banner ? { backgroundImage: `url(${profile.banner})` } : {}}
      >
        {/* Banner Edit Button */}
        <button
          onClick={() => setIsBannerPopupOpen(!isBannerPopupOpen)}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors z-20"
          aria-label="Edit Banner"
        >
          <Edit2 size={16} className="text-gray-700" />
        </button>

        {/* Banner Popup Menu */}
        {isBannerPopupOpen && (
          <div className="absolute top-14 right-4 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 w-40 z-30">
            <button
              onClick={() => {
                setIsBannerPopupOpen(false);
                fileInputRef.current?.click();
              }}
              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Upload size={14} /> Open
            </button>
            {profile?.banner && (
              <button
                onClick={handleBannerDelete}
                className="w-full px-4 py-2 text-left text-[14px] text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
            <button
              onClick={() => setIsBannerPopupOpen(false)}
              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <X size={14} /> Cancel upload
            </button>
          </div>
        )}

        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleBannerChange} 
        />
      </div>

      <div className="p-6 relative">
        <button
          onClick={onEdit}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Edit Profile"
        >
          <Edit2 size={20} className="text-gray-600" />
        </button>

        <motion.img
          src={profile.avatar || "/avatar.svg"}
          className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 left-6 object-cover bg-gray-100"
          whileHover={{ scale: 1.05 }}
        />

        <div className="mt-10">
          <h1 className="text-2xl font-bold">{profile.fullName}</h1>
          <p className="text-gray-600">{profile.headline}</p>
          {profile.address && profile.country && (
            <p className="text-sm text-gray-500">
              📍 {profile.address}, {profile.country}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}