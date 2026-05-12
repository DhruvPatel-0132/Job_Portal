import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, X } from "lucide-react";

const AchievementForm = ({ 
  achievementData, setAchievementData, skillInput, setSkillInput, handleAddSkill, removeSkill 
}) => {
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
          <option value="publication">Publication</option>
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
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Issue Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm"
            value={achievementData.date}
            onChange={(e) => setAchievementData({ ...achievementData, date: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Expiry Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm"
            disabled={achievementData.doesNotExpire}
            value={achievementData.expiryDate}
            onChange={(e) => setAchievementData({ ...achievementData, expiryDate: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 px-1">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer">
          <input 
            type="checkbox" 
            checked={achievementData.doesNotExpire}
            onChange={(e) => setAchievementData({ ...achievementData, doesNotExpire: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
          />
          This credential does not expire
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm"
          placeholder="Credential ID (Optional)"
          value={achievementData.credentialId}
          onChange={(e) => setAchievementData({ ...achievementData, credentialId: e.target.value })}
        />
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm"
          placeholder="Credential URL (Optional)"
          value={achievementData.credentialUrl}
          onChange={(e) => setAchievementData({ ...achievementData, credentialUrl: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all focus:border-blue-500 text-sm"
          placeholder="Add skills related to this achievement..."
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
        />
        <div className="flex flex-wrap gap-2 min-h-[20px]">
          <AnimatePresence>
            {achievementData.skills?.map((skill, index) => (
              <motion.span
                key={skill}
                layout
                initial={{ scale: 0.5, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                whileHover={{ scale: 1.05, backgroundColor: "#eff6ff" }}
                className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-blue-100 shadow-sm"
              >
                {skill}
                <motion.button 
                  whileHover={{ scale: 1.2, color: "#1e40af" }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => removeSkill(skill)} 
                  className="text-blue-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <textarea
        className="w-full min-h-[100px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
        placeholder="Achievement description..."
        value={achievementData.description}
        onChange={(e) => setAchievementData({ ...achievementData, description: e.target.value })}
      />
    </motion.div>
  );
};

export default AchievementForm;
