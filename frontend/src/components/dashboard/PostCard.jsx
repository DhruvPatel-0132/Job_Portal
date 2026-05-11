import React from "react";
import { ThumbsUp, MessageSquare, Send, MoreHorizontal, Briefcase, Award, Code, FileText, ExternalLink, Clock, MapPin } from "lucide-react";
import { motion } from "motion/react";

const PostCard = ({ post }) => {
  const isCompany = post.authorModel === "Company";
  const authorName = isCompany
    ? post.author.name
    : `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim();
  const authorAvatar = post.author.avatar || post.author.logo || "/avatar.svg";

  // Format relative time if createdAt exists
  const timeAgo = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : post.timeAgo;

  const renderSpecializedContent = () => {
    if (!post.referenceId) return null;

    switch (post.postType) {
      case "job_post":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 group cursor-pointer hover:bg-blue-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {post.referenceId.title}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-blue-700 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {post.referenceId.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.referenceId.employmentType}</span>
                </div>
                {post.referenceId.skillsRequired && post.referenceId.skillsRequired.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.referenceId.skillsRequired.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-blue-200 text-blue-600 text-[10px] font-bold rounded-lg shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-200"
              >
                Apply
              </motion.button>
            </div>
          </motion.div>
        );

      case "showcase_project":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 group"
          >
            <h4 className="font-bold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
              <Code className="w-4 h-4 text-indigo-600" />
              {post.referenceId.title}
            </h4>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
              {post.referenceId.description}
            </p>
            <div className="mt-4 flex items-center gap-4">
              {post.referenceId.liveUrl && (
                <a href={post.referenceId.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline">
                  <ExternalLink className="w-3 h-3" /> Live Demo
                </a>
              )}
              {post.referenceId.techStack && post.referenceId.techStack.length > 0 && (
                <div className="flex gap-2">
                  {post.referenceId.techStack.map((tech, i) => (
                    <span key={i} className="text-[10px] bg-white border px-2 py-0.5 rounded text-gray-500 font-medium">
                      {tech.name || tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );

      case "article":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group bg-white"
          >
            {post.referenceId.bannerImage && (
              <div className="relative h-40 overflow-hidden">
                <img src={post.referenceId.bannerImage} alt={post.referenceId.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase tracking-wider">Article</div>
              </div>
            )}
            <div className="p-4">
              <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">
                {post.referenceId.title}
              </h4>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.referenceId.readTime} min read</span>
                <span>•</span>
                {post.referenceId.tags && post.referenceId.tags.length > 0 && (
                  <div className="flex gap-2">
                    {post.referenceId.tags.map((tag, i) => <span key={i}>#{tag}</span>)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case "achievement":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex gap-4 items-center"
          >
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 leading-tight">{post.referenceId.title}</h4>
              <p className="text-sm text-amber-800/80 font-medium">{post.referenceId.issuer}</p>
              <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase">Achievement Unlocked</p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 mb-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Post Header */}
      <div className="flex items-center px-4 py-3">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={authorAvatar}
          alt={authorName}
          className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-100 p-0.5"
        />
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors">
            {authorName}
          </h3>
          <p className="text-xs text-gray-500 font-medium line-clamp-1">{post.author.headline}</p>
          <div className="flex items-center mt-0.5 space-x-1">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{timeAgo}</p>
            <span className="text-gray-300 text-[10px]">•</span>
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
        </div>
        <motion.button
          whileHover={{ backgroundColor: "#f3f4f6" }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 p-2 rounded-full transition-colors focus:outline-none"
        >
          <MoreHorizontal className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Post Content */}
      {(post.content || post.referenceId) && (
        <div className="px-4 pb-3 space-y-3">
          {post.content && (
            <p className="text-[14.5px] leading-relaxed text-gray-800 whitespace-pre-line font-normal">
              {post.content}
            </p>
          )}

          {/* Render polymorphic content based on postType */}
          {renderSpecializedContent()}
        </div>
      )}

      {/* Post Image (optional - for media posts) */}
      {post.image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 relative group overflow-hidden bg-gray-50 border-y border-gray-100"
        >
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-auto object-contain max-h-[500px] transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </motion.div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-50 text-[11px] font-medium text-gray-500">
        <div className="flex items-center space-x-1.5">
          <div className="flex -space-x-1">
            <span className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full ring-2 ring-white">
              <ThumbsUp className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="flex items-center justify-center w-4 h-4 bg-red-500 rounded-full ring-2 ring-white">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </span>
          </div>
          <span className="hover:text-blue-600 hover:underline cursor-pointer">{post.stats?.likesCount || 0}</span>
        </div>
        <div className="flex space-x-3">
          <span className="hover:text-blue-600 hover:underline cursor-pointer">
            {post.stats?.commentsCount || 0} comments
          </span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-2 py-1 flex items-center justify-around sm:justify-start sm:space-x-1">
        <ActionButton icon={<ThumbsUp className="w-5 h-5" />} label="Like" />
        <ActionButton
          icon={<MessageSquare className="w-5 h-5" />}
          label="Comment"
        />
        <ActionButton icon={<Send className="w-5 h-5" />} label="Send" />
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, label }) => (
  <motion.button
    whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
    whileTap={{ scale: 0.95 }}
    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-gray-600 font-semibold transition-all group"
  >
    <span className="group-hover:text-blue-600 transition-colors">{icon}</span>
    <span className="text-sm hidden sm:block group-hover:text-blue-600 transition-colors">{label}</span>
  </motion.button>
);

export default PostCard;
