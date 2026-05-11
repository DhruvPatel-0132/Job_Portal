import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, MapPin, Clock, X } from "lucide-react";

const JobForm = ({ 
  jobData, setJobData, skillInput, setSkillInput, handleAddSkill, removeSkill 
}) => {
  return (
    <motion.div
      key="job"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div className="relative group">
        <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
          placeholder="Job Title" 
          value={jobData.title}
          onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
            placeholder="Location"
            value={jobData.location}
            onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
          />
        </div>
        <div className="relative">
          <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <select
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none bg-white"
            value={jobData.type}
            onChange={(e) => setJobData({ ...jobData, type: e.target.value })}
          >
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
          value={jobData.workMode}
          onChange={(e) => setJobData({ ...jobData, workMode: e.target.value })}
        >
          <option value="on_site">On-site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
          value={jobData.experienceLevel}
          onChange={(e) => setJobData({ ...jobData, experienceLevel: e.target.value })}
        >
          <option value="fresher">Fresher</option>
          <option value="junior">Junior (1-2 yrs)</option>
          <option value="mid">Mid (3-5 yrs)</option>
          <option value="senior">Senior (5+ yrs)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="Min Salary"
          value={jobData.salaryMin}
          onChange={(e) => setJobData({ ...jobData, salaryMin: e.target.value })}
        />
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
          placeholder="Max Salary"
          value={jobData.salaryMax}
          onChange={(e) => setJobData({ ...jobData, salaryMax: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all focus:border-blue-500"
          placeholder="Add skills (e.g. React, Python) and press Enter..."
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
        />
        <div className="flex flex-wrap gap-2 min-h-[20px]">
          <AnimatePresence>
            {jobData.skills.map((skill, index) => (
              <motion.span
                key={skill}
                layout
                initial={{ scale: 0.5, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                whileHover={{ scale: 1.05, backgroundColor: "#eff6ff" }}
                className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-100 shadow-sm"
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
        className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
        placeholder="Role description and requirements..."
        value={jobData.description}
        onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
      />
    </motion.div>
  );
};

export default JobForm;
