import React from "react";
import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CompanyProgress({ company, profile }) {
  const navigate = useNavigate();
  const safeCompany = company || {};
  const safeProfile = profile || {};

  const calculateProgress = () => {
    let score = 0;
    const details = [];

    // 1. Identity & Branding (30%)
    if (safeCompany.logo || safeProfile.avatar) score += 15; else details.push("Upload your company logo");
    if (safeCompany.banner || safeProfile.banner) score += 15; else details.push("Add a background banner");

    // 2. Overview & Details (30%)
    if (safeCompany.tagline || safeProfile.headline) score += 10; else details.push("Add a company tagline");
    if (safeCompany.about || safeProfile.about) score += 20; else details.push("Write your company 'About Us' section");

    // 3. Contact & Web (20%)
    if (safeCompany.website) score += 10; else details.push("Add your company website");
    if (safeCompany.phone) score += 10; else details.push("Add a contact phone number");

    // 4. Industry & Firmographics (10%)
    if (safeCompany.industry && safeCompany.companySize) {
      score += 5;
    } else {
      details.push("Complete industry and company size");
    }
    if (safeCompany.location || safeProfile.city) score += 5; else details.push("Add your company location");

    // 5. Services & Specialties (10%)
    if (safeCompany.services?.length || safeCompany.specialties?.length) {
      score += 10;
    } else {
      details.push("Add your company services or specialties");
    }

    return {
      score: Math.min(score, 100),
      nextStep: details[0] || "Profile is complete!"
    };
  };

  const { score, nextStep } = calculateProgress();

  const getColorScheme = (score) => {
    if (score <= 20) return {
      bg: "bg-rose-50",
      text: "text-rose-600",
      bar: "from-rose-500 to-red-600",
      icon: "text-rose-600",
      label: "Critical"
    };
    if (score <= 45) return {
      bg: "bg-orange-50",
      text: "text-orange-600",
      bar: "from-orange-400 to-orange-600",
      icon: "text-orange-600",
      label: "Warning"
    };
    if (score <= 65) return {
      bg: "bg-amber-50",
      text: "text-amber-600",
      bar: "from-amber-400 to-yellow-500",
      icon: "text-amber-600",
      label: "Improving"
    };
    if (score <= 85) return {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      bar: "from-indigo-500 to-violet-600",
      icon: "text-indigo-600",
      label: "Great"
    };
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      bar: "from-emerald-500 to-green-600",
      icon: "text-emerald-600",
      label: "Excellent"
    };
  };

  const colors = getColorScheme(score);

  if (score === 100) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 overflow-hidden relative group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <Building2 size={18} className={colors.icon} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Complete your company profile</h3>
            <p className="text-[11px] text-gray-500">Profiles with {score}% completion attract more talent</p>
          </div>
        </div>
        <span className={`text-sm font-bold ${colors.text} ${colors.bg} px-2 py-0.5 rounded-md`}>
          {score}%
        </span>
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colors.bar} rounded-full`}
        />
      </div>

      {score < 100 && (
        <div
          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg group/step cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => navigate("/profile")}
        >
          <p className="text-xs text-gray-600 font-medium flex items-center gap-2">
            <span className={`w-1.5 h-1.5 ${colors.text.replace('text-', 'bg-')} rounded-full animate-pulse`} />
            Next step: <span className="text-gray-900 font-bold">{nextStep}</span>
          </p>
          <ArrowRight size={14} className={`text-gray-400 group-hover/step:${colors.text} group-hover/step:translate-x-1 transition-all`} />
        </div>
      )}
    </motion.div>
  );
}
