import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";

const SidebarCompanyProfile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const company = useAuthStore((state) => state.company);
  const profile = useAuthStore((state) => state.profile);

  const safeCompany = company || {};
  const safeProfile = profile || {};

  const companyName = safeCompany.name || safeProfile.fullName || (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Company Name");
  const avatar = safeProfile.avatar || "/avatar.svg";
  const banner = safeProfile.banner || "";
  const headline = safeProfile.headline || "No headline added";
  
  // Use company establishedYear or about if available, otherwise mock it
  const location = safeProfile.city ? `${safeProfile.city}, ${safeProfile.country}` : "Not specified";
  const establishedYear = safeCompany.establishedYear ? `Established ${safeCompany.establishedYear}` : "Industry not specified";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      {/* Banner Area */}
      <div
        className="h-16 w-full bg-gradient-to-r from-blue-600 to-indigo-700 bg-cover bg-center"
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
            alt="Company Logo"
            onClick={() => navigate("/profile")}
            className="w-16 h-16 rounded-2xl border-4 border-white object-cover shadow-sm cursor-pointer bg-white"
          />
        </motion.div>
      </div>

      {/* Name and Headline */}
      <div className="text-center px-4 pb-5 border-b border-gray-50">
        <h2
          onClick={() => navigate("/profile")}
          className="text-[16px] font-bold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors leading-snug"
        >
          {companyName}
        </h2>
        <p className="text-[12px] text-gray-500 mt-1.5 leading-relaxed font-medium px-1">
          {headline}
        </p>
      </div>

      {/* Info Section */}
      <div className="py-2.5 border-b border-gray-50 bg-gray-50/30">
        <motion.div
          whileHover={{ x: 3, backgroundColor: "rgba(249, 250, 251, 1)" }}
          className="px-4 py-1.5 cursor-pointer flex justify-between items-center transition-all group"
        >
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-gray-700">
            Followers
          </span>
          <span className="text-[13px] text-blue-600 font-bold">
            {safeProfile.followers || 0}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ x: 3, backgroundColor: "rgba(249, 250, 251, 1)" }}
          className="px-4 py-1.5 cursor-pointer flex justify-between items-center transition-all group"
        >
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-gray-700">
            Open Jobs
          </span>
          <span className="text-[13px] text-blue-600 font-bold">
            {safeProfile.openJobs || 0}
          </span>
        </motion.div>
      </div>

      {/* Location / Industry */}
      <div className="py-3 border-b border-gray-50 px-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="text-[11px]">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <span className="text-[11px] truncate">{establishedYear}</span>
        </div>
      </div>

      {/* Bottom Action */}
      <motion.div
        whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
        onClick={() => navigate("/dashboard")}
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
          Manage Jobs
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

export default SidebarCompanyProfile;
