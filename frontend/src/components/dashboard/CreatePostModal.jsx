import React, { useState, useEffect } from "react";
import {
  X, Image as ImageIcon, Video, Calendar, MoreHorizontal,
  Globe, Briefcase, Award, Code, FileText, MapPin,
  Clock, DollarSign, ExternalLink, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CreatePostModal = ({ isOpen, onClose, role, user, profile, company, initialType = "regular" }) => {
  const [postType, setPostType] = useState(initialType);
  const [content, setContent] = useState("");

  const [jobData, setJobData] = useState({
    title: "", location: "", type: "full_time", workMode: "on_site",
    experienceLevel: "fresher", salaryMin: "", salaryMax: "", description: "", skills: ""
  });
  const [projectData, setProjectData] = useState({
    title: "", tech: "", live: "", status: "completed", description: ""
  });
  const [articleData, setArticleData] = useState({ title: "", summary: "", tags: "", content: "" });
  const [achievementData, setAchievementData] = useState({
    title: "", type: "certification", issuer: "", date: "", credentialUrl: ""
  });

  useEffect(() => {
    if (isOpen) setPostType(initialType);
  }, [isOpen, initialType]);

  const handlePost = () => {
    console.log("Posting:", { type: postType, content, jobData, projectData, articleData, achievementData });
    onClose();
  };

  const name = role === "company" ? company?.name : profile?.fullName || "User";
  const avatar = profile?.avatar || company?.logo || "/avatar.svg";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-[600px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <motion.h2
                key={postType}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-gray-800"
              >
                {postType === "regular" && "Create a post"}
                {postType === "media" && "Select Media"}
                {postType === "job_post" && "Post a Job"}
                {postType === "article" && "Write an Article"}
                {postType === "project" && "Showcase Project"}
                {postType === "achievement" && "Add Achievement"}
              </motion.h2>
              <motion.button
                whileHover={{ rotate: 90, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </motion.button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="flex items-center gap-3 mb-6">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-50 p-0.5"
                />
                <div>
                  <div className="font-bold text-[16px] text-gray-900">{name}</div>
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    className="flex items-center gap-1.5 px-3 py-1 border border-gray-300 text-gray-600 rounded-full text-xs font-bold mt-0.5 transition-colors"
                  >
                    <Globe className="w-3 h-3" /> Anyone
                  </motion.button>
                </div>
              </div>

              <motion.div
                layout
                className="space-y-4"
              >
                <AnimatePresence mode="wait">
                  {postType === "media" && (
                    <motion.div
                      key="media"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
                      >
                        <ImageIcon className="w-8 h-8 text-blue-600" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-900">Select images and videos</h3>
                      <p className="text-gray-500 text-sm mt-1">or drag and drop them here</p>
                      <button onClick={() => setPostType("regular")} className="mt-6 text-blue-600 font-bold hover:underline text-sm">
                        Back to text post
                      </button>
                    </motion.div>
                  )}

                  {postType === "regular" && (
                    <motion.textarea
                      key="regular"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      placeholder="What do you want to talk about?"
                      className="w-full min-h-[150px] text-[18px] leading-relaxed resize-none focus:outline-none placeholder-gray-400 font-normal"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  )}

                  {postType === "job_post" && (
                    <motion.div
                      key="job"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      <div className="relative group">
                        <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Job Title" />
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

                      <input
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="Skills required (comma separated)"
                        value={jobData.skills}
                        onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
                      />

                      <textarea
                        className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="Role description and requirements..."
                        value={jobData.description}
                        onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                      />
                    </motion.div>
                  )}

                  {/* ... other types (project, article, achievement) similar motion patterns ... */}
                  {postType === "article" && (
                    <motion.div key="article" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <motion.div whileHover={{ scale: 1.01 }} className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-all cursor-pointer">
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="text-sm font-bold">Add a cover image</span>
                      </motion.div>
                      <input
                        className="w-full px-0 py-2 text-3xl font-extrabold placeholder-gray-300 focus:outline-none"
                        placeholder="Article Title"
                        value={articleData.title}
                        onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
                      />
                      <input
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none"
                        placeholder="Short Summary (SEO)"
                        value={articleData.summary}
                        onChange={(e) => setArticleData({ ...articleData, summary: e.target.value })}
                      />
                      <input
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none"
                        placeholder="Tags (comma separated)"
                        value={articleData.tags}
                        onChange={(e) => setArticleData({ ...articleData, tags: e.target.value })}
                      />
                      <textarea
                        className="w-full min-h-[250px] text-lg focus:outline-none resize-none leading-relaxed"
                        placeholder="Write your thoughts..."
                        value={articleData.content}
                        onChange={(e) => setArticleData({ ...articleData, content: e.target.value })}
                      />
                    </motion.div>
                  )}

                  {postType === "project" && (
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
                          <option value="beta">Beta</option>
                        </select>
                      </div>
                      <input
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none"
                        placeholder="Tech Stack (comma separated)"
                        value={projectData.tech}
                        onChange={(e) => setProjectData({ ...projectData, tech: e.target.value })}
                      />
                      <textarea
                        className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="Project description..."
                        value={projectData.description}
                        onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                      />
                    </motion.div>
                  )}

                  {postType === "achievement" && (
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
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <ToolbarButton icon={<ImageIcon className="w-6 h-6" />} color="blue" />
                  <ToolbarButton icon={<Video className="w-6 h-6" />} color="green" />
                  <ToolbarButton icon={<Calendar className="w-6 h-6" />} color="orange" />
                  <ToolbarButton icon={<MoreHorizontal className="w-6 h-6" />} color="gray" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePost}
                  className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Post
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ToolbarButton = ({ icon, color }) => {
  const colors = {
    blue: "text-blue-500 hover:bg-blue-50",
    green: "text-green-600 hover:bg-green-50",
    orange: "text-orange-500 hover:bg-orange-50",
    gray: "text-gray-500 hover:bg-gray-100",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2.5 rounded-full transition-colors ${colors[color]}`}
    >
      {icon}
    </motion.button>
  );
};

export default CreatePostModal;
