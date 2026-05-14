import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ThumbsUp, MessageSquare, Send, Briefcase, Award, Code, FileText, ExternalLink, Clock, MapPin, Calendar, Globe, User } from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import usePostStore from "../../store/postStore";

const PostDetailModal = ({ isOpen, onClose, post }) => {
  const [showReactions, setShowReactions] = React.useState(false);
  const reactionTimeoutRef = React.useRef(null);
  
  const { user } = useAuthStore();
  const { toggleReaction } = usePostStore();

  const REACTION_TYPES = [
    { type: "like", icon: "👍", label: "Like", color: "text-blue-600" },
    { type: "celebrate", icon: "👏", label: "Celebrate", color: "text-green-600" },
    { type: "support", icon: "🤝", label: "Support", color: "text-purple-600" },
    { type: "love", icon: "❤️", label: "Love", color: "text-red-600" },
    { type: "insightful", icon: "💡", label: "Insightful", color: "text-yellow-600" },
    { type: "funny", icon: "😄", label: "Funny", color: "text-orange-600" }
  ];

  if (!post) return null;

  const isCompany = post.authorModel === "Company";
  const authorName = isCompany
    ? post.author.name
    : `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim();
  const authorAvatar = post.author.avatar || post.author.logo || "/avatar.svg";
  const timeAgo = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "";

  const formatLabel = (key) => {
    const labels = {
      full_time: "Full-time",
      part_time: "Part-time",
      internship: "Internship",
      contract: "Contract",
      freelance: "Freelance",
      on_site: "On-site",
      remote: "Remote",
      hybrid: "Hybrid",
      fresher: "Fresher",
      junior: "Junior",
      mid: "Mid-level",
      senior: "Senior",
      lead: "Lead",
      executive: "Executive"
    };
    return labels[key] || key;
  };

  const renderSpecializedDetails = () => {
    switch (post.postType) {
      case "job_post":
        if (!post.referenceId) return null;
        const job = post.referenceId;
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">{job.title}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-blue-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" /> {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> {formatLabel(job.employmentType)}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-500" /> {formatLabel(job.workMode)}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" /> {job.industry}
                </div>
              </div>
              {job.salary && !job.salary.hideSalary && (
                <div className="mt-4 p-3 bg-green-100/50 rounded-xl inline-block text-green-700 font-bold">
                  ₹ {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} per year
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Job Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.skillsRequired && job.skillsRequired.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full border border-gray-200 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Benefits</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors mt-4">
              Apply Now
            </button>
          </div>
        );

      case "showcase_project":
        if (!post.referenceId) return null;
        const project = post.referenceId;
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">{project.title}</h2>
              <p className="text-sm text-indigo-700 font-medium">{project.projectStatus || "Active"}</p>
              
              <div className="flex gap-4 mt-4">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md">
                    <Globe className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold shadow-md">
                    <Code className="w-4 h-4" /> Source Code
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">About the Project</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>

            {project.techStack && project.techStack.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-lg border border-indigo-200 shadow-sm">
                      {tech.name || tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">Gallery</h3>
                <div className="grid grid-cols-2 gap-4">
                  {project.gallery.map((img, i) => (
                    <img key={i} src={img.url} className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm" alt={`Project slide ${i}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "article":
        if (!post.referenceId) return null;
        const article = post.referenceId;
        return (
          <article className="space-y-6">
            {article.bannerImage?.url && (
              <img src={article.bannerImage.url} className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-md" alt={article.title} />
            )}
            
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">{article.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {article.readTime || 5} min read</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-500" /> {new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="prose prose-blue max-w-none">
              <p className="text-xl text-gray-600 font-medium leading-relaxed italic border-l-4 border-gray-200 pl-6 my-8">
                {article.summary}
              </p>
              <div className="text-gray-800 leading-relaxed text-lg space-y-4 whitespace-pre-line">
                {article.content}
              </div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <span key={i} className="text-blue-600 font-bold hover:underline cursor-pointer">#{tag}</span>
                ))}
              </div>
            )}
          </article>
        );

      case "achievement":
        if (!post.referenceId) return null;
        const achievement = post.referenceId;
        return (
          <div className="space-y-8 py-4">
            <div className="flex flex-col items-center text-center space-y-4 p-8 bg-amber-50 rounded-3xl border border-amber-100 shadow-inner">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center shadow-lg ring-8 ring-white">
                <Award className="w-12 h-12 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-900">{achievement.title}</h2>
                <p className="text-lg font-semibold text-amber-700 mt-1">{achievement.issuer?.name || achievement.issuer}</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-amber-600 font-bold uppercase tracking-widest">
                   <Calendar className="w-4 h-4" /> {new Date(achievement.issueDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-amber-500 pl-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{achievement.description}</p>
            </div>

            {achievement.credentialUrl && (
              <a 
                href={achievement.credentialUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 border-2 border-amber-200 text-amber-700 font-bold rounded-2xl hover:bg-amber-50 transition-colors"
              >
                <ExternalLink className="w-5 h-5" /> View Credential
              </a>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
             {post.content && (
               <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">{post.content}</p>
             )}
             
             {post.media && post.media.length > 0 ? (
               <div className="space-y-4">
                 {post.media.map((item, i) => (
                   <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                      {item.type === "image" ? (
                        <img src={item.url} className="w-full h-auto" alt="Post content" />
                      ) : (
                        <video src={item.url} controls className="w-full h-auto" />
                      )}
                   </div>
                 ))}
               </div>
             ) : post.image && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                   <img src={post.image} className="w-full h-auto" alt="Post content" />
                </div>
             )}
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
               <div className="flex items-center gap-3">
                  <img src={authorAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt={authorName} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{authorName}</h4>
                    <p className="text-[11px] text-gray-500 font-medium">{timeAgo}</p>
                  </div>
               </div>
               <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
               >
                 <X className="w-6 h-6 text-gray-400" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
               {renderSpecializedDetails()}

               {/* Standard Post Footer inside detail */}
               <div className="mt-12 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                       <div className="flex -space-x-1">
                          <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                            <ThumbsUp className="w-3 h-3 text-white" />
                          </span>
                       </div>
                       <span className="font-semibold text-gray-700">{post.stats?.likesCount || 0} Likes</span>
                    </div>
                    <div className="flex gap-4 font-semibold">
                       <span>{post.stats?.commentsCount || 0} Comments</span>
                       <span>{post.stats?.viewsCount || 0} Views</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 relative">
                    <AnimatePresence>
                      {showReactions && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center px-3 py-2 z-50 gap-2"
                          onMouseEnter={() => {
                            clearTimeout(reactionTimeoutRef.current);
                            setShowReactions(true);
                          }}
                          onMouseLeave={() => {
                            reactionTimeoutRef.current = setTimeout(() => setShowReactions(false), 300);
                          }}
                        >
                          {REACTION_TYPES.map((reaction) => (
                            <motion.button
                              key={reaction.type}
                              whileHover={{ scale: 1.3, originY: 1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setShowReactions(false);
                                toggleReaction(post._id, reaction.type);
                              }}
                              className="text-2xl hover:bg-gray-50 rounded-full p-1 transition-colors relative group/reaction"
                            >
                              {reaction.icon}
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/reaction:opacity-100 whitespace-nowrap transition-opacity">
                                {reaction.label}
                              </span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div 
                      className="flex-1"
                      onMouseEnter={() => {
                        clearTimeout(reactionTimeoutRef.current);
                        setShowReactions(true);
                      }}
                      onMouseLeave={() => {
                        reactionTimeoutRef.current = setTimeout(() => setShowReactions(false), 300);
                      }}
                    >
                      <button 
                        onClick={() => toggleReaction(post._id, "like")}
                        className={`w-full py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-xl font-bold transition-colors ${post.stats?.likedBy?.includes(user?._id) ? 'text-blue-600' : 'text-gray-600'}`}
                      >
                        <ThumbsUp className={`w-5 h-5 ${post.stats?.likedBy?.includes(user?._id) ? 'fill-current' : ''}`} /> 
                        Like
                      </button>
                    </div>
                    <button className="flex-1 py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-xl font-bold text-gray-600 transition-colors">
                      <MessageSquare className="w-5 h-5" /> Comment
                    </button>
                    <button className="flex-1 py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-xl font-bold text-gray-600 transition-colors">
                      <Send className="w-5 h-5" /> Send
                    </button>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostDetailModal;
