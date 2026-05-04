import { motion } from "framer-motion";
import { Edit2, MapPin } from "lucide-react";

export default function ProfileHeader({ profile, onEdit }) {
  return (
    <motion.div className="bg-white rounded-xl shadow relative overflow-visible">
      <div
        className="h-48 bg-cover bg-center relative bg-gray-200 rounded-t-xl overflow-hidden"
        style={profile?.banner ? { backgroundImage: `url(${profile.banner})` } : {}}
      >
        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
          {(profile.address || profile.city || profile.country) && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span>
                {profile.address && `${profile.address}, `}
                {[profile.city, profile.country].filter(Boolean).join(", ")}
                {profile.postalCode && ` (${profile.postalCode})`}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}