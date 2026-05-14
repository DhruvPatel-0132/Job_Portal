import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Image as ImageIcon, Plus, X } from "lucide-react";

const ProjectForm = ({ 
  projectData, setProjectData, techInput, setTechInput, handleAddTech, removeTech, 
  projectImageRef, handleProjectImageSelect, removeProjectImage 
}) => {
  return (
    <motion.div key="project" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <input
        className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
        placeholder="Project Title"
        value={projectData.title}
        onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <ExternalLink className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"
            placeholder="Live Demo URL"
            value={projectData.live}
            onChange={(e) => setProjectData({ ...projectData, live: e.target.value })}
          />
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          <input
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"
            placeholder="GitHub Repository URL"
            value={projectData.githubUrl}
            onChange={(e) => setProjectData({ ...projectData, githubUrl: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"
          placeholder="Demo Video URL (YouTube/Vimeo)"
          value={projectData.demoVideoUrl}
          onChange={(e) => setProjectData({ ...projectData, demoVideoUrl: e.target.value })}
        />
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none bg-white"
          value={projectData.status}
          onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
        >
          <option value="idea">💡 Idea</option>
          <option value="in_progress">🏗️ In Progress</option>
          <option value="beta">🧪 Beta</option>
          <option value="completed">✅ Completed</option>
          <option value="maintained">🛠️ Maintained</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Start Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm"
            value={projectData.startDate}
            onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">End Date (Optional)</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none text-sm"
            value={projectData.endDate}
            onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all focus:border-indigo-500"
          placeholder="Type tech and press Enter (e.g. React, Node.js)..."
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={handleAddTech}
        />
        <div className="flex flex-wrap gap-2 min-h-[20px]">
          <AnimatePresence>
            {projectData.tech.map((t, index) => (
              <motion.span
                key={t}
                layout
                initial={{ scale: 0.5, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                whileHover={{ scale: 1.05, backgroundColor: "#eef2ff" }}
                className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-indigo-100 shadow-sm"
              >
                {t}
                <motion.button 
                  whileHover={{ scale: 1.2, color: "#3730a3" }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => removeTech(t)} 
                  className="text-indigo-400 transition-colors"
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
        placeholder="Project description..."
        value={projectData.description}
        onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
      />

      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-500" />
          Project Screenshots / Media
        </label>
        <div className="grid grid-cols-4 gap-3">
          {projectData.images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={img.url} className="w-full h-full object-cover" alt="Project preview" />
              <button 
                onClick={() => removeProjectImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => projectImageRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:bg-blue-50/30 hover:text-blue-500 transition-all"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Add Media</span>
          </motion.button>
        </div>
        <input 
          type="file" 
          ref={projectImageRef} 
          onChange={handleProjectImageSelect} 
          multiple 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </motion.div>
  );
};

export default ProjectForm;
