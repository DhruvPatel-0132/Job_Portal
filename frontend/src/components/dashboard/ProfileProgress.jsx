import React from "react";
import { motion } from "framer-motion";
import { UserCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileProgress = ({ profile }) => {
  const navigate = useNavigate();

  const calculateProgress = () => {
    let score = 0;
    const details = [];

    // 1. Identity & First Impression (20%)
    if (profile?.avatar) score += 7; else details.push("Upload a profile picture");
    if (profile?.banner) score += 5; else details.push("Add a background banner");

    if (profile?.headline) {
      score += 4;
      if (profile.headline.length > 15) score += 4; else details.push("Make your headline more descriptive");
    } else {
      details.push("Add a professional headline");
    }

    // 2. Narrative & Professional Summary (20%)
    if (profile?.about) {
      score += 5;
      if (profile.about.length > 100) {
        score += 15;
      } else {
        const remaining = 100 - profile.about.length;
        score += Math.floor((profile.about.length / 100) * 15);
        details.push(`Add ${remaining} more characters to your 'About' section`);
      }
    } else {
      details.push("Write a professional summary in 'About'");
    }

    // 3. Work & Education History (35%)
    const expCount = profile?.experience?.length || 0;
    if (expCount > 0) {
      score += 10;
      const hasDesc = profile.experience.some(exp => exp.description && exp.description.length > 20);
      if (hasDesc) score += 5; else details.push("Add descriptions to your experience");
      if (expCount >= 2) score += 5; else details.push("Add a second work experience");
    } else {
      details.push("Add your work history");
    }

    const eduCount = profile?.education?.length || 0;
    if (eduCount > 0) {
      score += 10;
      const hasDetail = profile.education.some(edu => edu.degree && edu.fieldOfStudy);
      if (hasDetail) score += 5; else details.push("Complete degree details for education");
    } else {
      details.push("Add your education details");
    }

    // 4. Skills (10%)
    const skillCount = profile?.skills?.length || 0;
    if (skillCount >= 5) {
      score += 10;
    } else if (skillCount > 0) {
      score += (skillCount * 2);
      details.push(`Add ${5 - skillCount} more skills`);
    } else {
      details.push("Add your top technical skills");
    }

    // 5. Contact & Personal (15%)
    if (profile?.phone) score += 5; else details.push("Add your phone number");
    if (profile?.birthday) score += 5; else details.push("Add your date of birth");

    if (profile?.country) score += 2;
    if (profile?.city) score += 3;
    if (!profile?.country || !profile?.city) details.push("Complete your location details");

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
            <UserCheck size={18} className={colors.icon} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Complete your profile</h3>
            <p className="text-[11px] text-gray-500">Profiles with {score}% completion get more views</p>
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
};

export default ProfileProgress;
