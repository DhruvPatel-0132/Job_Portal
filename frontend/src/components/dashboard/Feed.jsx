/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "motion/react";
import { useProfileStore } from "../../store/profileStore";

const dummyPosts = [
  {
    id: 1,
    author: {
      firstName: "John",
      lastName: "Doe",
      avatar: "/avatar.svg",
      headline: "Software Engineer | Tech Enthusiast",
    },
    authorModel: "User",
    postType: "regular",
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2h ago
    content:
      "Just deployed my first React application to production! The developer experience with modern tools is incredible. #reactjs #webdev #milestone",
    stats: { likesCount: 124, commentsCount: 15, sharesCount: 5 },
  },
  {
    id: 2,
    author: {
      name: "TechCorp",
      avatar: "/post-image.svg",
      logo: "/post-image.svg",
      headline: "Innovating the Future",
    },
    authorModel: "Company",
    postType: "job_post",
    createdAt: new Date(Date.now() - 18000000).toISOString(), // 5h ago
    content:
      "We are looking for talented frontend engineers to join our growing team!",
    stats: { likesCount: 342, commentsCount: 45, sharesCount: 82 },
    referenceId: {
      title: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      employmentType: "Full-time",
      salaryRange: { min: 120000, max: 180000, currency: "USD" },
      skillsRequired: ["React", "TypeScript", "Tailwind CSS"],
    },
  },
  {
    id: 3,
    author: {
      firstName: "Alex",
      lastName: "Johnson",
      avatar: "/avatar.svg",
      headline: "UX/UI Designer",
    },
    authorModel: "User",
    postType: "showcase_project",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1d ago
    content:
      "Excited to share my latest project: A decentralized marketplace for digital assets.",
    stats: { likesCount: 89, commentsCount: 12, sharesCount: 3 },
    referenceId: {
      title: "NFT Marketplace",
      description:
        "A secure and transparent platform for trading unique digital collectibles using blockchain technology.",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      techStack: [
        { name: "Solidity" },
        { name: "React" },
        { name: "Ether.js" },
      ],
    },
  },
  {
    id: 4,
    author: {
      firstName: "Sarah",
      lastName: "Williams",
      avatar: "/avatar.svg",
      headline: "Data Scientist",
    },
    authorModel: "User",
    postType: "article",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2d ago
    content: "Thoughts on the future of AI in healthcare.",
    stats: { likesCount: 567, commentsCount: 82, sharesCount: 45 },
    referenceId: {
      title: "AI in Healthcare: A New Era",
      bannerImage: "/post-image.svg",
      readTime: 8,
      tags: ["AI", "Healthcare", "Technology"],
    },
  },
  {
    id: 5,
    author: {
      firstName: "Michael",
      lastName: "Brown",
      avatar: "/avatar.svg",
      headline: "Frontend Architect",
    },
    authorModel: "User",
    postType: "achievement",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3d ago
    content:
      "Honored to receive the Google Developer Expert certification in Web Technologies!",
    stats: { likesCount: 210, commentsCount: 24, sharesCount: 12 },
    referenceId: {
      title: "Google Developer Expert",
      issuer: "Google",
      issueDate: new Date().toISOString(),
    },
  },
];

const Feed = () => {
  const { user, company, profile: authProfile } = useAuthStore();
  const { profile: storeProfile } = useProfileStore();
  const profile = storeProfile || authProfile;
  const role = user?.role;

  const [posts, setPosts] = useState(dummyPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialType, setInitialType] = useState("regular");
  const observer = useRef();

  // Infinite scroll functionality defined (without actual implementation)
  const loadMorePosts = useCallback(() => {
    if (loading) return;

    // TODO: Implement actual API call for infinite scrolling here
    /*
    setLoading(true);
    fetch(`/api/posts?page=${page + 1}`)
      .then(res => res.json())
      .then(data => {
        setPosts(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setLoading(false);
      });
    */
  }, [loading, page]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // loadMorePosts(); // Uncomment when API is ready
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadMorePosts],
  );

  return (
    <div className="flex flex-col w-full">
      {/* Create Post Box (simplified for UI) */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4 p-4 shadow-sm">
        <div className="flex space-x-3">
          <img
            src={profile?.avatar || company?.logo || "/avatar.svg"}
            alt="Current User"
            className="w-12 h-12 rounded-full object-cover p-1 border border-gray-200"
          />
          <button
            onClick={() => {
              setInitialType("regular");
              setIsModalOpen(true);
            }}
            className="flex-1 bg-white border border-gray-300 rounded-full text-left px-4 text-gray-500 font-medium hover:bg-gray-50 transition-colors"
          >
            Start a post
          </button>
        </div>
        <div className="flex justify-between mt-3 px-2 sm:px-6">
          {role === "job_seeker" ? (
            <>
              <button
                onClick={() => {
                  setInitialType("project");
                  setIsModalOpen(true);
                }}
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
                onClick={() => {
                  setInitialType("achievement");
                  setIsModalOpen(true);
                }}
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
                onClick={() => {
                  setInitialType("media");
                  setIsModalOpen(true);
                }}
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
                onClick={() => {
                  setInitialType("article");
                  setIsModalOpen(true);
                }}
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
                onClick={() => {
                  setInitialType("job_post");
                  setIsModalOpen(true);
                }}
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
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              ref={posts.length === index + 1 ? lastPostElementRef : null}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
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
    </div>
  );
};

export default Feed;
