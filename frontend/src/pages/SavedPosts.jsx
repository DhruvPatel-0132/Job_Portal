import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Briefcase, FileText, LayoutGrid } from "lucide-react";
import usePostStore from "../store/postStore";
import PostCard from "../components/Dashboard/PostCard";
import PostDetailModal from "../components/Dashboard/PostDetailModal";
import SidebarContent from "../components/Dashboard/SidebarContent";

const TABS = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "job_post", label: "Jobs", icon: Briefcase },
  { key: "article", label: "Articles", icon: FileText },
];

const SavedPosts = () => {
  const { savedPosts, fetchSavedPosts, loading, incrementViews } = usePostStore();
  const [activeTab, setActiveTab] = useState("all");

  // Post Detail Modal State
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  const selectedPost = savedPosts.find((p) => p._id === selectedPostId) || null;

  const handleOpenDetail = async (post) => {
    setSelectedPostId(post._id);
    setIsDetailModalOpen(true);
    await incrementViews(post._id);
  };

  // Filter posts based on active tab
  const filteredPosts =
    activeTab === "all"
      ? savedPosts
      : savedPosts.filter((post) => post.postType === activeTab);

  // Count per tab
  const counts = {
    all: savedPosts.length,
    job_post: savedPosts.filter((p) => p.postType === "job_post").length,
    article: savedPosts.filter((p) => p.postType === "article").length,
  };

  const emptyMessages = {
    all: { title: "No saved posts", desc: "When you save a post to read later, it will show up here." },
    job_post: { title: "No saved jobs", desc: "Save job posts to revisit and apply later." },
    article: { title: "No saved articles", desc: "Save articles to read and reference later." },
  };

  return (
    <main className="max-w-[1080px] mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 justify-center">
        <SidebarContent />

        <div className="w-full lg:w-[540px] xl:w-[600px] flex-shrink-0 self-start">
          {/* Page Header */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900">Saved Posts</h1>
            <p className="text-gray-500 mt-1">View all the posts you've saved for later.</p>
          </div>

          {/* Filter Navbar */}
          <div className="relative flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors duration-200 z-10 ${
                    isActive ? "text-blue-700" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                  {counts[tab.key] > 0 && (
                    <span
                      className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {counts[tab.key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Post List */}
          <div className="flex flex-col gap-4">
            {loading && savedPosts.length === 0 ? (
              <div className="flex flex-col gap-4 mt-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
                    <div className="h-40 bg-gray-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredPosts.length > 0 ? (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    {filteredPosts.map((post, index) => (
                      <motion.div
                        key={post._id || post.id || index}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <PostCard post={post} onOpen={handleOpenDetail} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`empty-${activeTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      {activeTab === "job_post" ? (
                        <Briefcase className="w-9 h-9 text-blue-400" />
                      ) : activeTab === "article" ? (
                        <FileText className="w-9 h-9 text-blue-400" />
                      ) : (
                        <Bookmark className="w-9 h-9 text-blue-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {emptyMessages[activeTab].title}
                    </h3>
                    <p className="text-gray-500 text-center mt-2 max-w-sm">
                      {emptyMessages[activeTab].desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Dummy 3rd column to maintain perfect alignment with Dashboard's 3-column layout */}
        <div className="w-full lg:w-[300px] flex-shrink-0 hidden lg:block"></div>
      </div>

      <PostDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPostId(null);
        }}
        post={selectedPost}
      />
    </main>
  );
};

export default SavedPosts;
