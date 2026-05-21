import React from "react";
import RegularForm from "./forms/RegularForm";
import MediaForm from "./forms/MediaForm";
import JobForm from "./forms/JobForm";
import ProjectForm from "./forms/ProjectForm";
import ArticleForm from "./forms/ArticleForm";
import AchievementForm from "./forms/AchievementForm";

const PostFormRenderer = ({ 
  postType, 
  content, 
  setContent, 
  selectedMedia, 
  handleMediaSelect, 
  removeMedia, 
  fileInputRef, 
  setPostType,
  jobData,
  setJobData,
  skillInput,
  setSkillInput,
  handleAddSkill,
  removeSkill,
  projectData,
  setProjectData,
  techInput,
  setTechInput,
  handleAddTech,
  removeTech,
  projectImageRef,
  handleProjectImageSelect,
  removeProjectImage,
  articleData,
  setArticleData,
  tagInput,
  setTagInput,
  handleAddTag,
  removeTag,
  articleImageRef,
  handleArticleCoverSelect,
  removeArticleCover,
  achievementData,
  setAchievementData
}) => {
  switch (postType) {
    case "media":
      return (
        <MediaForm 
          content={content}
          setContent={setContent}
          selectedMedia={selectedMedia}
          handleMediaSelect={handleMediaSelect}
          removeMedia={removeMedia}
          fileInputRef={fileInputRef}
          setPostType={setPostType}
        />
      );
    case "job_post":
      return (
        <JobForm 
          jobData={jobData}
          setJobData={setJobData}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          handleAddSkill={handleAddSkill}
          removeSkill={removeSkill}
        />
      );
    case "project":
    case "showcase_project":
      return (
        <ProjectForm 
          projectData={projectData}
          setProjectData={setProjectData}
          techInput={techInput}
          setTechInput={setTechInput}
          handleAddTech={handleAddTech}
          removeTech={removeTech}
          projectImageRef={projectImageRef}
          handleProjectImageSelect={handleProjectImageSelect}
          removeProjectImage={removeProjectImage}
        />
      );
    case "article":
      return (
        <ArticleForm 
          articleData={articleData}
          setArticleData={setArticleData}
          tagInput={tagInput}
          setTagInput={setTagInput}
          handleAddTag={handleAddTag}
          removeTag={removeTag}
          articleImageRef={articleImageRef}
          handleArticleCoverSelect={handleArticleCoverSelect}
          removeArticleCover={removeArticleCover}
        />
      );
    case "achievement":
      return (
        <AchievementForm 
          achievementData={achievementData}
          setAchievementData={setAchievementData}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          handleAddSkill={handleAddSkill}
          removeSkill={removeSkill}
        />
      );
    case "regular":
    default:
      return <RegularForm content={content} setContent={setContent} />;
  }
};

export default PostFormRenderer;
