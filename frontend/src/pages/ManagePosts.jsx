import React, { useEffect, useState } from "react";
import SidebarContent from "../components/dashboard/SidebarContent";
import PostCard from "../components/dashboard/PostCard";
import PostDetailModal from "../components/dashboard/PostDetailModal";
import usePostStore from "../store/postStore";
import { useAuthStore } from "../store/authStore";
import { Loader2, AlertCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ManagePosts = () => {
  const { userPosts, loading, error, fetchUserPosts, incrementViews } = usePostStore();
  const { user } = useAuthStore();

  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handleOpenDetail = async (post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);

    // Increment views in backend (optional for self, but usually counted)
    await incrementViews(post._id);
  };

  return (
    <main className="max-w-[1080px] mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 justify-center">
        <SidebarContent />

        <div className="w-full lg:w-[540px] xl:w-[600px] flex-shrink-0 self-start space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-7 h-7 text-blue-600" />
              Manage Your Posts
            </h1>
            <p className="text-gray-500 mt-1">
              View your posts and see how they are performing with the community.
            </p>
          </div>

          {loading && userPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="mt-4 text-gray-500 font-medium">Loading your posts...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-100 rounded-xl flex items-center gap-4 text-red-700">
              <AlertCircle className="w-6 h-6" />
              <p>{error}</p>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 text-center px-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No posts yet</h3>
              <p className="text-gray-500 mt-2 max-w-xs">
                You haven't created any posts yet. Start sharing your thoughts or opportunities with your network!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {userPosts.map((post) => (
                  <motion.div
                    key={post._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    <PostCard post={post} onOpen={handleOpenDetail} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[300px] flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Post Analytics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-sm font-medium text-blue-700">Total Posts</span>
                <span className="text-lg font-bold text-blue-900">{userPosts.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-sm font-medium text-green-700">Total Reach (Views)</span>
                <span className="text-lg font-bold text-green-900">
                  {userPosts.reduce((acc, p) => acc + (p.stats?.viewsCount || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-sm font-medium text-amber-700">Total Likes</span>
                <span className="text-lg font-bold text-amber-900">
                  {userPosts.reduce((acc, p) => acc + (p.stats?.likesCount || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        post={selectedPost}
      />
    </main>
  );
};

export default ManagePosts;
