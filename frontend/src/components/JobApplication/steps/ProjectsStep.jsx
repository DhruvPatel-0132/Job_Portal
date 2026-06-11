import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  FileText,
  Code2,
  GitBranch,
  ExternalLink,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const InputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={16} />
      </div>
      <input
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
        {...props}
      />
    </div>
  </div>
);

const TextAreaField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={16} />
      </div>
      <textarea
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all resize-none"
        rows={3}
        {...props}
      />
    </div>
  </div>
);

const EMPTY_PROJECT = {
  name: "",
  description: "",
  techStack: "",
  github: "",
  liveDemo: "",
};

const ProjectsStep = ({ formData, setFormData, onNext, onBack }) => {
  const projects = formData.projects?.length > 0 ? formData.projects : [{ ...EMPTY_PROJECT }];

  const updateProject = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.projects || [{ ...EMPTY_PROJECT }])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), { ...EMPTY_PROJECT }],
    }));
  };

  const removeProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Projects
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showcase your best projects
            </p>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="relative"
                >
                  <div className={`p-6 rounded-xl border ${index === 0 ? "border-blue-100 bg-blue-50/20" : "border-gray-100 bg-gray-50/30"}`}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Project {index + 1}
                      </span>
                      {projects.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeProject(index)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <InputField
                          icon={FolderOpen}
                          label="Project Name"
                          placeholder="E-Commerce Platform"
                          value={project.name}
                          onChange={(e) => updateProject(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <TextAreaField
                          icon={FileText}
                          label="Description"
                          placeholder="Brief description of the project and your role..."
                          value={project.description}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <InputField
                          icon={Code2}
                          label="Tech Stack"
                          placeholder="React, Node.js, MongoDB, AWS"
                          value={project.techStack}
                          onChange={(e) => updateProject(index, "techStack", e.target.value)}
                        />
                      </div>
                      <InputField
                        icon={GitBranch}
                        label="GitHub Link"
                        placeholder="github.com/user/project"
                        value={project.github}
                        onChange={(e) => updateProject(index, "github", e.target.value)}
                      />
                      <InputField
                        icon={ExternalLink}
                        label="Live Demo"
                        placeholder="project.vercel.app"
                        value={project.liveDemo}
                        onChange={(e) => updateProject(index, "liveDemo", e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addProject}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Project
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors hover:bg-gray-50 flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProjectsStep;
