/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "./PostCard";

const dummyPosts = [
  {
    id: 1,
    author: {
      name: "John Doe",
      avatar: "/avatar.svg",
      headline: "Software Engineer | Tech Enthusiast",
    },
    timeAgo: "2h",
    content:
      "Just deployed my first React application to production! The developer experience with modern tools is incredible. #reactjs #webdev #milestone",
    image: null,
    likesCount: 124,
    commentsCount: 15,
    sharesCount: 3,
  },
  {
    id: 2,
    author: {
      name: "Jane Smith",
      avatar: "/avatar.svg",
      headline: "Product Manager at TechCorp",
    },
    timeAgo: "5h",
    content:
      "We are looking for talented frontend engineers to join our growing team. If you are passionate about building great user experiences, let's connect!",
    image: "/post-image.svg",
    likesCount: 342,
    commentsCount: 45,
    sharesCount: 89,
  },
  {
    id: 3,
    author: {
      name: "Alex Johnson",
      avatar: "/avatar.svg",
      headline: "UX/UI Designer",
    },
    timeAgo: "1d",
    content:
      "Design systems are more than just component libraries. They are a shared language between design and engineering teams. Here are some thoughts on how to build them effectively.",
    image: null,
    likesCount: 89,
    commentsCount: 12,
    sharesCount: 5,
  },
  {
    id: 4,
    author: {
      name: "Sarah Williams",
      avatar: "/avatar.svg",
      headline: "Data Scientist",
    },
    timeAgo: "2d",
    content:
      "The latest advancements in large language models are opening up new possibilities for AI applications. I've been experimenting with some new frameworks and the results are promising.",
    image: "/post-image.svg",
    likesCount: 567,
    commentsCount: 82,
    sharesCount: 45,
  },
  {
    id: 5,
    author: {
      name: "Michael Brown",
      avatar: "/avatar.svg",
      headline: "Frontend Architect",
    },
    timeAgo: "3d",
    content:
      "Performance optimization in single-page applications is a continuous process. Remember to measure before you optimize! #webperformance #javascript",
    image: null,
    likesCount: 210,
    commentsCount: 24,
    sharesCount: 10,
  },
];

const role = "hire";

const Feed = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
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
            src="/avatar.svg"
            alt="Current User"
            className="w-12 h-12 rounded-full object-cover p-1 border border-gray-200"
          />
          <button className="flex-1 bg-white border border-gray-300 rounded-full text-left px-4 text-gray-500 font-medium hover:bg-gray-50 transition-colors">
            Start a post
          </button>
        </div>
        <div className="flex justify-between mt-3 px-2 sm:px-6">
          {role === "job_seeker" ? (
            <>
              <button className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <span className="text-sm font-medium">Showcase Projects</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Applied Job Applications
                </span>
              </button>
            </>
          ) : role === "hire" || role === "company" ? (
            <>
              <button className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors">
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
              <button className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors">
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
              <button className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 p-2 rounded-md transition-colors">
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
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.id}>
                <PostCard post={post} />
              </div>
            );
          } else {
            return <PostCard key={post.id} post={post} />;
          }
        })}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default Feed;
