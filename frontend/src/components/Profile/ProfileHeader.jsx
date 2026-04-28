import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";

export default function ProfileHeader({ profile, onEdit }) {
  return (
    <motion.div className="bg-white rounded-xl shadow relative overflow-hidden">

      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.banner})` }}
      />

      <div className="p-6 relative">
        <button
          onClick={onEdit}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Edit Profile"
        >
          <Edit2 size={20} className="text-gray-600" />
        </button>

        <motion.img
          src={profile.avatar}
          className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 left-6"
          whileHover={{ scale: 1.05 }}
        />

        <div className="mt-10">
          <h1 className="text-2xl font-bold">{profile.fullName}</h1>
          <p className="text-gray-600">{profile.headline}</p>
          <p className="text-sm text-gray-500">
            📍 {profile.address}, {profile.country}
          </p>
        </div>
      </div>
    </motion.div>
  );
}