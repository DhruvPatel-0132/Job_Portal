import React from "react";
import { motion } from "motion/react";
import { Award } from "lucide-react";

const AchievementForm = ({ achievementData, setAchievementData }) => {
  return (
    <motion.div key="achievement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Award className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
            placeholder="Title"
            value={achievementData.title}
            onChange={(e) => setAchievementData({ ...achievementData, title: e.target.value })}
          />
        </div>
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-white text-sm"
          value={achievementData.type}
          onChange={(e) => setAchievementData({ ...achievementData, type: e.target.value })}
        >
          <option value="certification">Certification</option>
          <option value="award">Award</option>
          <option value="honor">Honor</option>
          <option value="patent">Patent</option>
        </select>
      </div>
      <input
        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none"
        placeholder="Issuing Organization"
        value={achievementData.issuer}
        onChange={(e) => setAchievementData({ ...achievementData, issuer: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm"
          value={achievementData.date}
          onChange={(e) => setAchievementData({ ...achievementData, date: e.target.value })}
        />
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm"
          placeholder="Credential URL (optional)"
          value={achievementData.credentialUrl}
          onChange={(e) => setAchievementData({ ...achievementData, credentialUrl: e.target.value })}
        />
      </div>
    </motion.div>
  );
};

export default AchievementForm;
