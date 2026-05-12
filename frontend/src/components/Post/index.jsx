import React, { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import PostFormRenderer from "./PostFormRenderer";
import usePostStore from "../../store/postStore";
import { uploadToCloudinary } from "../../utils/cloudinary";


const PostModal = ({ isOpen, onClose, role, profile, company, initialType = "regular" }) => {
  const [postType, setPostType] = useState(initialType);
  const [content, setContent] = useState("");
  const { createPost, loading } = usePostStore();

  const [selectedMedia, setSelectedMedia] = useState([]);
  const fileInputRef = useRef(null);
  const projectImageRef = useRef(null);
  const articleImageRef = useRef(null);

  const [jobData, setJobData] = useState({
    title: "", location: "", type: "full_time", workMode: "on_site",
    experienceLevel: "fresher", salaryMin: "", salaryMax: "", description: "", skills: [],
    industry: "", category: "", educationLevel: "", isNegotiable: false, hideSalary: false,
    applicationUrl: "", applicationDeadline: "", benefits: ""
  });
  const [skillInput, setSkillInput] = useState("");

  const [projectData, setProjectData] = useState({
    title: "", tech: [], live: "", status: "completed", description: "", images: [],
    githubUrl: "", demoVideoUrl: "", startDate: "", endDate: ""
  });
  const [techInput, setTechInput] = useState("");

  const [articleData, setArticleData] = useState({ title: "", summary: "", tags: [], content: "", coverImage: null });
  const [tagInput, setTagInput] = useState("");

  const [achievementData, setAchievementData] = useState({
    title: "", type: "certification", issuer: "", date: "", credentialUrl: "",
    expiryDate: "", doesNotExpire: false, credentialId: "", description: ""
  });
  
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

    setIsMediaUploading(true);
    setUploadProgress(10);

    try {
      let finalObjectId = null;

      // 1. Upload Main Media
      const uploadedMedia = await Promise.all(
        selectedMedia.map(async (m, index) => {
          if (m.file) {
            const result = await uploadToCloudinary(m.file, "post", postType, finalObjectId);
            if (!finalObjectId) finalObjectId = result.objectId;
            setUploadProgress(prev => Math.min(prev + 20, 90));
            return { url: result.url, type: m.type, publicId: result.publicId };
          }
          return { url: m.url, type: m.type };
        })
      );

      // 2. Upload Project Images
      let uploadedProjectImages = [];
      if (postType === "project" && projectData.images.length > 0) {
        uploadedProjectImages = await Promise.all(
          projectData.images.map(async (img) => {
            if (img.file) {
              const result = await uploadToCloudinary(img.file, "post", "project", finalObjectId);
              if (!finalObjectId) finalObjectId = result.objectId;
              setUploadProgress(prev => Math.min(prev + 20, 90));
              return { url: result.url, publicId: result.publicId };
            }
            return { url: img.url };
          })
        );
      }

      // 3. Upload Article Cover
      let uploadedArticleCover = null;
      if (postType === "article" && articleData.coverImage?.file) {
        const result = await uploadToCloudinary(articleData.coverImage.file, "post", "article", finalObjectId);
        if (!finalObjectId) finalObjectId = result.objectId;
        setUploadProgress(prev => Math.min(prev + 20, 90));
        uploadedArticleCover = { url: result.url, publicId: result.publicId };
      } else if (articleData.coverImage?.url) {
        uploadedArticleCover = { url: articleData.coverImage.url };
      }

      setUploadProgress(95);

      const postData = {
        _id: finalObjectId, // Use the pre-generated ID
        postType,
        content,
        media: uploadedMedia,
        jobData: postType === "job_post" ? jobData : null,
        projectData: postType === "project" ? { ...projectData, images: uploadedProjectImages } : null,
        articleData: postType === "article" ? { ...articleData, coverImage: uploadedArticleCover } : null,
        achievementData: postType === "achievement" ? achievementData : null,
      };

      const result = await createPost(postData);
      setUploadProgress(100);
      if (result.success) {
        setContent("");
        setSelectedMedia([]);
        setProjectData(prev => ({ ...prev, images: [] }));
        setArticleData(prev => ({ ...prev, coverImage: null }));
        onClose();
      }
    } catch (error) {
      console.error("Failed to upload media or create post:", error);
      alert("Something went wrong while uploading media. Please try again.");
    } finally {
      setIsMediaUploading(false);
      setUploadProgress(0);
    }
  };


  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Only allow one media item
    const file = files[0];
    const newMedia = [{
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }];
    
    // Revoke old URLs to prevent memory leaks
    selectedMedia.forEach(m => URL.revokeObjectURL(m.url));
    setSelectedMedia(newMedia);
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
    if (files.length === 0) return;

    // Only allow one project image
    const file = files[0];
    const newImages = [{
      file,
      url: URL.createObjectURL(file)
    }];
    
    projectData.images.forEach(img => URL.revokeObjectURL(img.url));
    setProjectData(prev => ({
      ...prev,
      images: newImages
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
  
  const handleArticleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArticleData(prev => ({
        ...prev,
        coverImage: {
          file,
          url: URL.createObjectURL(file)
        }
      }));
    }
  };

  const removeArticleCover = () => {
    setArticleData(prev => {
      if (prev.coverImage) URL.revokeObjectURL(prev.coverImage.url);
      return { ...prev, coverImage: null };
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

            {/* Uploading Overlay */}
            <AnimatePresence>
              {isMediaUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[110] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center p-6"
                >
                  <div className="w-full max-w-[300px] space-y-4 text-center">
                    <div className="relative w-20 h-20 mx-auto">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-100 stroke-current"
                          strokeWidth="8"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                        ></circle>
                        <motion.circle
                          className="text-black stroke-current"
                          strokeWidth="8"
                          strokeLinecap="round"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          initial={{ strokeDasharray: "0 251.2" }}
                          animate={{ strokeDasharray: `${(uploadProgress / 100) * 251.2} 251.2` }}
                        ></motion.circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">
                        {Math.round(uploadProgress)}%
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">Uploading your post...</h3>
                      <p className="text-gray-500 text-sm mt-1">Please wait while we process your media.</p>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-black"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                    articleImageRef={articleImageRef}
                    handleArticleCoverSelect={handleArticleCoverSelect}
                    removeArticleCover={removeArticleCover}
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
              loading={loading || isMediaUploading}
            />

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
