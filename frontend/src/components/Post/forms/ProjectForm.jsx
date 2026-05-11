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
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none bg-white"
          value={projectData.status}
          onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
        >
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
        </select>
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
