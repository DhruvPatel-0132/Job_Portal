import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SidebarProfile = ({ profile }) => {
  const navigate = useNavigate();
  const safeProfile = profile || {};

  const fullName = safeProfile.fullName || "Loading...";
  const avatar = safeProfile.avatar || "/avatar.svg";
  const banner = safeProfile.banner || "";
  const headline = safeProfile.headline || "No headline added";
  const skills = safeProfile.skills || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      {/* Banner Area */}
      <div
        className="h-16 w-full bg-gradient-to-br from-gray-100 to-gray-300 bg-cover bg-center"
        style={banner ? { backgroundImage: `url(${banner})` } : {}}
      />

      {/* Avatar Section */}
      <div className="flex justify-center -mt-8 pb-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <img
            src={avatar}
            alt="Profile Avatar"
            onClick={() => navigate("/profile")}
            className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-sm cursor-pointer bg-white"
          />
        </motion.div>
      </div>

      {/* Name and Headline */}
      <div className="text-center px-4 pb-5 border-b border-gray-50">
        <h2
          onClick={() => navigate("/profile")}
          className="text-[16px] font-bold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors leading-snug"
        >
          {fullName}
        </h2>
        <p className="text-[12px] text-gray-500 mt-1.5 leading-relaxed font-medium px-1">
          {headline}
        </p>
      </div>

      {/* Stats Section */}
      <div className="py-2.5 border-b border-gray-50 bg-gray-50/30">
        <motion.div
          whileHover={{ x: 3, backgroundColor: "rgba(249, 250, 251, 1)" }}
          className="px-4 py-1.5 cursor-pointer flex justify-between items-center transition-all group"
        >
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-gray-700">
            Profile viewers
          </span>
          <span className="text-[13px] text-blue-600 font-bold">
            {safeProfile.profileViews || 0}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ x: 3, backgroundColor: "rgba(249, 250, 251, 1)" }}
          className="px-4 py-1.5 cursor-pointer flex justify-between items-center transition-all group"
        >
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-gray-700">
            Connections
          </span>
          <span className="text-[13px] text-blue-600 font-bold">
            {safeProfile.connections || 0}
          </span>
        </motion.div>
      </div>

      {/* Skills Section */}
      <div className="py-4 border-b border-gray-50 px-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-3">
          Top Skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {skills.length > 0 ? (
            skills.slice(0, 3).map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-blue-50/60 text-blue-700 text-[10px] px-2.5 py-1 rounded-md font-bold border border-blue-100/40"
              >
                {skill}
              </motion.span>
            ))
          ) : (
            <span className="text-[11px] text-gray-400 italic">No skills added</span>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <motion.div
        whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
        className="px-4 py-3.5 cursor-pointer transition-all flex items-center justify-between group"
      >
        <span className="text-[12px] text-gray-700 font-bold flex items-center group-hover:text-black">
          <svg
            className="w-4 h-4 mr-2.5 text-gray-400 group-hover:text-gray-600 transition-colors"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          My items
        </span>
        <svg 
          className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default SidebarProfile;