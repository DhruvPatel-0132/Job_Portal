import React from "react";
import PostCard from "../components/dashboard/PostCard";
import {
  Pencil,
  ShieldCheck,
  Building2,
  GraduationCap,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";

const userPosts = [
  {
    id: 101,
    author: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/300?img=11",
      headline: "Student at L J University",
    },
    timeAgo: "1w",
    content:
      "Excited to share that I've started working on a new project! Stay tuned for updates. 🚀 #webdevelopment #reactjs",
    image: null,
    likesCount: 45,
    commentsCount: 12,
    sharesCount: 2,
  },
];

const Profile = () => {
  return (
    <>
      <main className="max-w-[1080px] mx-auto px-0 md:px-4 py-6 flex justify-center">
        {/* Main Profile Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[780px] flex-shrink-0 flex flex-col gap-4"
        >
          {/* Profile Card */}
          <div className="bg-white md:rounded-lg shadow-sm border-t border-b md:border border-gray-200 overflow-hidden relative">
            {/* Banner */}
            <div className="relative h-48 bg-gray-200 group">
              <img
                src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition text-[#0a66c2]">
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="px-6 pb-6 pt-[85px] relative">
              {/* Profile Picture */}
              <div className="absolute -top-[76px] left-6">
                <div className="w-[152px] h-[152px] rounded-full border-[4px] border-white bg-white overflow-hidden relative shadow-sm cursor-pointer group">
                  <img
                    src="https://i.pravatar.cc/300?img=11"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center transition-colors">
                    <Pencil className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button className="absolute right-6 top-4 p-2 rounded-full hover:bg-gray-100 transition">
                <Pencil className="w-5 h-5 text-gray-600" />
              </button>

              {/* Top info section */}
              <div className="flex flex-col md:flex-row justify-between gap-6 mt-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      John Doe
                    </h1>
                  </div>
                  <p className="text-gray-900 text-[16px] mt-1">
                    Student at L J University
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Ahmedabad, Gujarat, India ·{" "}
                    <a
                      href="#"
                      className="text-[#0a66c2] font-semibold hover:underline"
                    >
                      Contact info
                    </a>
                  </p>
                  <p className="text-[#0a66c2] text-sm font-semibold mt-2 hover:underline cursor-pointer">
                    229 connections
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:min-w-[230px]">
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline group">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                      <Building2 className="w-5 h-5 text-gray-700" />
                    </div>
                    IndiaNIC Infotech Limited
                  </p>
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline group">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                      <GraduationCap className="w-5 h-5 text-gray-700" />
                    </div>
                    L J University
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white md:rounded-lg shadow-sm border-t border-b md:border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Activity
                </h2>
                <p className="text-sm text-[#0a66c2] font-semibold mt-1 hover:underline cursor-pointer">
                  229 followers
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-1.5 px-4 rounded-full transition text-sm box-border h-8 flex items-center justify-center">
                  Create a post
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-full transition text-gray-600">
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="flex flex-col">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="border-t border-gray-200 mt-2 pt-3 flex justify-center">
              <button className="text-gray-500 font-semibold text-sm hover:bg-gray-100 px-4 py-1.5 rounded-md transition-colors w-full flex items-center justify-center gap-1">
                Show all activity <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default Profile;
