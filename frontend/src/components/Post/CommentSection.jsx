import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, Trash2, CornerDownRight, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import useCommentStore from "../../store/commentStore";

// ─── Helper ─────────────────────────────────────────────────────────────────
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((new Date() - date) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return date.toLocaleDateString();
};

const getAuthorInfo = (commentUser) => {
  const isCompany = commentUser?.role === "company";
  return {
    name: isCompany
      ? commentUser?.companyName || "Company"
      : `${commentUser?.firstName || ""} ${commentUser?.lastName || ""}`.trim() || "User",
    avatar: isCompany
      ? commentUser?.companyLogo || "/avatar.svg"
      : commentUser?.avatar || "/avatar.svg",
  };
};

// ─── Inline Delete Confirm ────────────────────────────────────────────────────
const DeleteConfirm = ({ onConfirm, onCancel, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: -4, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -4, scale: 0.97 }}
    transition={{ duration: 0.15 }}
    className="flex items-center gap-2 mt-1.5 px-2.5 py-1.5 bg-red-50 border border-red-100 rounded-lg"
  >
    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
    <span className="text-[11px] text-red-600 font-semibold flex-1">Delete this?</span>
    <button
      onClick={onCancel}
      className="text-[11px] font-semibold text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded hover:bg-gray-100 transition-colors"
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      disabled={loading}
      className="text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 px-2.5 py-0.5 rounded transition-colors disabled:opacity-60 flex items-center gap-1"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
      Delete
    </button>
  </motion.div>
);

// ─── Reply Input ─────────────────────────────────────────────────────────────
const ReplyInput = ({ postId, commentId, onDone, currentUserAvatar }) => {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addReply } = useCommentStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitting(true);
    await addReply(postId, commentId, value.trim());
    setValue("");
    setSubmitting(false);
    if (onDone) onDone();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-2 mt-2 items-center pl-1"
    >
      <img
        src={currentUserAvatar}
        alt="You"
        className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0"
        onError={(e) => { e.target.onerror = null; e.target.src = "/avatar.svg"; }}
      />
      <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write a reply…"
          className="w-full bg-white border border-blue-200 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 pr-9 transition-all"
        />
        <button
          type="submit"
          disabled={!value.trim() || submitting}
          className="absolute right-1.5 p-1 text-blue-500 rounded-full hover:bg-blue-50 disabled:opacity-40 transition-colors"
        >
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </form>
    </motion.div>
  );
};

// ─── Reply Item ───────────────────────────────────────────────────────────────
const ReplyItem = ({ reply, parentCommentId, postId, currentUserId }) => {
  const { deleteReply } = useCommentStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { name, avatar } = getAuthorInfo(reply.user);
  const isOwner = currentUserId && reply.user?._id === currentUserId;

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await deleteReply(reply._id, parentCommentId, postId);
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -6 }}
      className="flex gap-2 mt-2"
    >
      <img
        src={avatar}
        alt={name}
        className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0 mt-0.5"
        onError={(e) => { e.target.onerror = null; e.target.src = "/avatar.svg"; }}
      />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-xl rounded-tl-none px-3 py-2 group relative">
          <div className="flex justify-between items-start">
            <h5 className="text-xs font-bold text-gray-900 hover:text-blue-600 cursor-pointer">{name}</h5>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-[10px] text-gray-400">{getTimeAgo(reply.createdAt)}</span>
              {isOwner && !confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-red-400 hover:text-red-600 p-0.5 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <p className="text-[12px] text-gray-700 leading-relaxed mt-0.5 break-words whitespace-pre-wrap">{reply.content}</p>
        </div>

        {/* Inline delete confirmation */}
        <AnimatePresence>
          {confirmDelete && (
            <DeleteConfirm
              onConfirm={handleConfirmDelete}
              onCancel={() => setConfirmDelete(false)}
              loading={deleting}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Comment Item ─────────────────────────────────────────────────────────────
const CommentItem = ({ comment, postId, currentUserAvatar, currentUserId }) => {
  const { deleteComment, fetchReplies, repliesByComment } = useCommentStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { name, avatar } = getAuthorInfo(comment.user);
  const isOwner = currentUserId && comment.user?._id === currentUserId;
  const repliesData = repliesByComment[comment._id];
  const replies = repliesData?.replies || [];
  const repliesLoading = repliesData?.loading;
  // Use actual loaded count as source of truth; fall back to server-side repliesCount
  const repliesCount = repliesData ? replies.length : (comment.repliesCount || 0);

  const handleToggleReplies = async () => {
    if (!showReplies && !repliesData) {
      await fetchReplies(comment._id);
    }
    setShowReplies((prev) => !prev);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await deleteComment(comment._id, postId);
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div className="flex gap-3 mb-3 last:mb-0">
      <img
        src={avatar}
        alt={name}
        className="w-9 h-9 rounded-full object-cover border border-gray-100 p-0.5 shrink-0 mt-0.5"
        onError={(e) => { e.target.onerror = null; e.target.src = "/avatar.svg"; }}
      />
      <div className="flex-1 min-w-0">
        {/* Comment bubble */}
        <div className="bg-gray-50 rounded-xl rounded-tl-none px-3 py-2.5 group relative">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer hover:underline">
              {name}
            </h4>
            <div className="flex items-center gap-1 ml-2 shrink-0">
              <span className="text-[10px] text-gray-400 whitespace-nowrap">{getTimeAgo(comment.createdAt)}</span>
              {isOwner && !confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-red-400 hover:text-red-600 p-0.5 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <p className="text-[13px] text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>

        {/* Inline delete confirmation */}
        <AnimatePresence>
          {confirmDelete && (
            <DeleteConfirm
              onConfirm={handleConfirmDelete}
              onCancel={() => setConfirmDelete(false)}
              loading={deleting}
            />
          )}
        </AnimatePresence>

        {/* Comment Actions */}
        {!confirmDelete && (
          <div className="flex items-center gap-3 mt-1 pl-1">
            <button
              onClick={() => setShowReplyInput((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-blue-600 transition-colors"
            >
              <CornerDownRight className="w-3 h-3" />
              Reply
            </button>

            {repliesCount > 0 && (
              <button
                onClick={handleToggleReplies}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
              >
                {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {showReplies ? "Hide" : `${repliesCount} ${repliesCount === 1 ? "reply" : "replies"}`}
              </button>
            )}
          </div>
        )}

        {/* Reply Input */}
        <AnimatePresence>
          {showReplyInput && (
            <ReplyInput
              postId={postId}
              commentId={comment._id}
              currentUserAvatar={currentUserAvatar}
              onDone={() => {
                setShowReplyInput(false);
                if (!showReplies) {
                  fetchReplies(comment._id).then(() => setShowReplies(true));
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Replies List */}
        <AnimatePresence>
          {showReplies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-1 pl-2 border-l-2 border-blue-100"
            >
              {repliesLoading ? (
                <div className="flex justify-center py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              ) : (
                <AnimatePresence>
                  {replies.map((reply) => (
                    <ReplyItem
                      key={reply._id}
                      reply={reply}
                      parentCommentId={comment._id}
                      postId={postId}
                      currentUserId={currentUserId}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Comment Section ──────────────────────────────────────────────────────────
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
  const currentUserId = user?._id;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-4 bg-white border-t border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Comment Input */}
      <div className="flex gap-3 py-3 items-center">
        <img
          src={avatarToShow}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-100 p-0.5 shrink-0"
          onError={(e) => { e.target.onerror = null; e.target.src = "/avatar.svg"; }}
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
      <div className="mt-1 space-y-1">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : comments.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-1 pb-2">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CommentItem
                    comment={comment}
                    postId={postId}
                    currentUserAvatar={avatarToShow}
                    currentUserId={currentUserId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
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
