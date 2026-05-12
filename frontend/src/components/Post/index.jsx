import React, { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import PostFormRenderer from "./PostFormRenderer";
import usePostStore from "../../store/postStore";


const PostModal = ({ isOpen, onClose, role, profile, company, initialType = "regular" }) => {
  const [postType, setPostType] = useState(initialType);
  const [content, setContent] = useState("");
  const { createPost, loading } = usePostStore();

  const [selectedMedia, setSelectedMedia] = useState([]);
  const fileInputRef = useRef(null);
  const projectImageRef = useRef(null);

  const [jobData, setJobData] = useState({
    title: "", location: "", type: "full_time", workMode: "on_site",
    experienceLevel: "fresher", salaryMin: "", salaryMax: "", description: "", skills: []
  });
  const [skillInput, setSkillInput] = useState("");

  const [projectData, setProjectData] = useState({
    title: "", tech: [], live: "", status: "completed", description: "", images: []
  });
  const [techInput, setTechInput] = useState("");

  const [articleData, setArticleData] = useState({ title: "", summary: "", tags: [], content: "" });
  const [tagInput, setTagInput] = useState("");

  const [achievementData, setAchievementData] = useState({
    title: "", type: "certification", issuer: "", date: "", credentialUrl: ""
  });

  useEffect(() => {
    if (isOpen) setPostType(initialType);
  }, [isOpen, initialType]);

  const handlePost = async () => {
    // Basic guard: Allow if there's content OR media OR specialized data
    const hasSpecializedData = 
      (postType === "job_post" && jobData.title) || 
      (postType === "project" && projectData.title) || 
      (postType === "article" && articleData.title) || 
      (postType === "achievement" && achievementData.title);

    if (!content.trim() && selectedMedia.length === 0 && !hasSpecializedData) return;


    const postData = {
      postType,
      content,
      media: selectedMedia.map(m => ({
        url: m.url, 
        type: m.type
      })),
      jobData: postType === "job_post" ? jobData : null,
      projectData: postType === "project" ? projectData : null,
      articleData: postType === "article" ? articleData : null,
      achievementData: postType === "achievement" ? achievementData : null,
    };


    const result = await createPost(postData);
    if (result.success) {
      setContent("");
      setSelectedMedia([]);
      onClose();
    }
  };


  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
    setSelectedMedia(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (index) => {
    setSelectedMedia(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleProjectImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setProjectData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeProjectImage = (index) => {
    setProjectData(prev => {
      const updatedImages = [...prev.images];
      URL.revokeObjectURL(updatedImages[index].url);
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!jobData.skills.includes(skillInput.trim())) {
        setJobData({ ...jobData, skills: [...jobData.skills, skillInput.trim()] });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setJobData({
      ...jobData,
      skills: jobData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAddTech = (e) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!projectData.tech.includes(techInput.trim())) {
        setProjectData({ ...projectData, tech: [...projectData.tech, techInput.trim()] });
      }
      setTechInput("");
    }
  };

  const removeTech = (techToRemove) => {
    setProjectData({
      ...projectData,
      tech: projectData.tech.filter(t => t !== techToRemove)
    });
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!articleData.tags.includes(tagInput.trim())) {
        setArticleData({ ...articleData, tags: [...articleData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setArticleData({
      ...articleData,
      tags: articleData.tags.filter(t => t !== tagToRemove)
    });
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
            <PostHeader postType={postType} onClose={onClose} />

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="flex items-center gap-3 mb-6">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={avatar}
                  alt="Avatar"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "/avatar.svg";
                  }}
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

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <PostFormRenderer 
                    postType={postType}
                    content={content}
                    setContent={setContent}
                    selectedMedia={selectedMedia}
                    handleMediaSelect={handleMediaSelect}
                    removeMedia={removeMedia}
                    fileInputRef={fileInputRef}
                    setPostType={setPostType}
                    jobData={jobData}
                    setJobData={setJobData}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                    handleAddSkill={handleAddSkill}
                    removeSkill={removeSkill}
                    projectData={projectData}
                    setProjectData={setProjectData}
                    techInput={techInput}
                    setTechInput={setTechInput}
                    handleAddTech={handleAddTech}
                    removeTech={removeTech}
                    projectImageRef={projectImageRef}
                    handleProjectImageSelect={handleProjectImageSelect}
                    removeProjectImage={removeProjectImage}
                    articleData={articleData}
                    setArticleData={setArticleData}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    handleAddTag={handleAddTag}
                    removeTag={removeTag}
                    achievementData={achievementData}
                    setAchievementData={setAchievementData}
                  />
                </AnimatePresence>
              </div>
            </div>

            <PostFooter 
              postType={postType} 
              setPostType={setPostType} 
              role={role} 
              handlePost={handlePost} 
              loading={loading}
            />

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
