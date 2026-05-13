/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import PostDetailModal from "./PostDetailModal";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "motion/react";
import { useProfileStore } from "../../store/profileStore";
import usePostStore from "../../store/postStore";

const Feed = () => {
  const { user, company, profile: authProfile } = useAuthStore();
  const { profile: storeProfile } = useProfileStore();
  const { posts, loading, fetchPosts, incrementViews } = usePostStore();
  
  const profile = storeProfile || authProfile;
  const role = user?.role;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialType, setInitialType] = useState("regular");
  
  // Post Detail Modal State
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const observer = useRef();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleOpenDetail = async (post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
    
    // Increment views in backend
    await incrementViews(post._id);
  };

  // Infinite scroll functionality (Placeholder for future implementation)
  const lastPostElementRef = useCallback(
    (node) => {
      // Logic for infinite scroll would go here
    },
    [],
  );


  return (
    <div className="flex flex-col w-full">
      {/* Create Post Box (simplified for UI) */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4 p-4 shadow-sm">
        <div className="flex space-x-3">
          <img
            src={profile?.avatar || company?.logo || "/avatar.svg"}
            alt="Current User"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "/avatar.svg";
            }}
            className="w-12 h-12 rounded-full object-cover p-1 border border-gray-200"
          />

          <button
            onClick={() => { setInitialType("regular"); setIsModalOpen(true); }}
            className="flex-1 bg-white border border-gray-300 rounded-full text-left px-4 text-gray-500 font-medium hover:bg-gray-50 transition-colors"
          >
            Start a post
          </button>
        </div>
        <div className="flex justify-between mt-3 px-2 sm:px-6">
          {role === "job_seeker" ? (
            <>
              <button
                onClick={() => { setInitialType("project"); setIsModalOpen(true); }}
                className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <span className="text-sm font-medium">Showcase Projects</span>
              </button>
              <button
                onClick={() => { setInitialType("achievement"); setIsModalOpen(true); }}
                className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2l2.09 4.26L17 7l-3.5 3.41L14.18 15 10 12.77 5.82 15l.68-4.59L3 7l4.91-.74L10 2z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="text-sm font-medium">
                  Achievement / Certification
                </span>
              </button>
            </>
          ) : role === "hire" || role === "company" ? (
            <>
              <button
                onClick={() => { setInitialType("media"); setIsModalOpen(true); }}
                className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Media</span>
              </button>
              <button
                onClick={() => { setInitialType("article"); setIsModalOpen(true); }}
                className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Write Article</span>
              </button>
              <button
                onClick={() => { setInitialType("job_post"); setIsModalOpen(true); }}
                className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
                <span className="text-sm font-medium">Post Job</span>
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="flex flex-col">
        <AnimatePresence>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post._id || post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                ref={posts.length === index + 1 ? lastPostElementRef : null}
              >
                <PostCard post={post} onOpen={handleOpenDetail} />
              </motion.div>
            ))
          ) : !loading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">No posts yet</h3>
              <p className="text-gray-500 text-center mt-1">Be the first to share something with your network!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={role}
        user={user}
        profile={profile}
        company={company}
        initialType={initialType}
      />

      {/* Post Detail Modal */}
      <PostDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};

export default Feed;
