import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import useCommentStore from "../../store/commentStore";

const CommentItem = ({ comment }) => {
  const isCompany = comment.user?.role === "company";
  const authorName = isCompany 
    ? (comment.user?.companyName || "Company") 
    : (`${comment.user?.firstName || ""} ${comment.user?.lastName || ""}`.trim() || "User");
  const authorAvatar = isCompany 
    ? (comment.user?.companyLogo || "/avatar.svg") 
    : (comment.user?.avatar || "/avatar.svg");
  const authorHeadline = isCompany 
    ? (comment.user?.companyTagline || "") 
    : (comment.user?.headline || "");

  // Helper to format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex gap-3 mb-4 last:mb-4">
      <img
        src={authorAvatar}
        alt={authorName}
        className="w-10 h-10 rounded-full object-cover border border-gray-100 p-0.5 shrink-0"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/avatar.svg";
        }}
      />
      <div className="flex-1 bg-gray-50 rounded-xl rounded-tl-none p-3 relative group">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h4 className="text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer hover:underline">
              {authorName}
            </h4>
            {/* {authorHeadline && (
              <p className="text-xs text-gray-500 line-clamp-1">{authorHeadline}</p>
            )} */}
          </div>
          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
            {getTimeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="text-[13px] text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

const CommentSection = ({ postId, currentUserAvatar }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile, company } = useAuthStore();
  const { commentsByPost, fetchComments, addComment } = useCommentStore();

  const postCommentsData = commentsByPost[postId];
  const comments = postCommentsData?.comments || [];
  const loading = postCommentsData?.loading;

  useEffect(() => {
    if (!postCommentsData) {
      fetchComments(postId, 1);
    }
  }, [postId, postCommentsData, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await addComment(postId, content.trim());
    setContent("");
    setIsSubmitting(false);
  };

  const defaultAvatar = profile?.avatar || company?.logo || "/avatar.svg";
  const avatarToShow = currentUserAvatar || defaultAvatar;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-4 bg-white border-t border-gray-100"
      onClick={(e) => e.stopPropagation()} // Prevent opening post modal
    >
      {/* Comment Input */}
      <div className="flex gap-3 py-3 items-center">
        <img
          src={avatarToShow}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-100 p-0.5 shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/avatar.svg";
          }}
        />
        <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
          />
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="absolute right-2 p-1.5 text-blue-600 rounded-full hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="mt-2 space-y-1">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : comments.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2 pb-2">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CommentItem comment={comment} />
                </motion.div>
              ))}
            </AnimatePresence>
            {/* Load more can be implemented here if needed */}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-gray-500 font-medium">
            Be the first to comment on this post.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentSection;
