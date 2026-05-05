import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MoreHorizontal,
  UserPlus,
  Briefcase,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import SidebarProfile from "../components/dashboard/SidebarProfile";
import Footer from "../components/dashboard/Footer";
import { useProfileStore } from "../store/profileStore";

// Static dummy data for informative notifications
const notificationsData = [
  {
    id: 1,
    type: "hiring",
    title: "Hiring Update",
    content:
      "**Google** is hiring for **Senior React Developer** roles. Check out the latest openings.",
    time: "2h",
    isRead: false,
    avatar: "/company.svg",
    action: "View Job",
  },
  {
    id: 2,
    type: "post",
    title: "New Post",
    content:
      "**Jane Smith** shared a new post: 'Excited to share our latest project deployment using Vite and Tailwind.'",
    time: "5h",
    isRead: true,
    avatar: "/avatar.svg",
    action: "View Post",
  },
  {
    id: 3,
    type: "hiring",
    title: "Hiring Update",
    content:
      "**Microsoft** started hiring for **Full Stack Engineer** positions in your area.",
    time: "1d",
    isRead: true,
    avatar: "/company.svg",
    action: "View Job",
  },
  {
    id: 4,
    type: "post",
    title: "New Post",
    content:
      "**Michael Brown** uploaded a new post: 'Tips for mastering React 19 features.'",
    time: "1d",
    isRead: true,
    avatar: "/avatar.svg",
    action: "View Post",
  },
];

const NotificationItem = ({ notification }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
      className={`p-4 flex gap-4 border-b border-gray-100 transition-all cursor-pointer relative group ${!notification.isRead ? "bg-blue-50/30" : "bg-white"}`}
    >
      {!notification.isRead && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
      )}

      <div className="relative flex-shrink-0">
        <img
          src={notification.avatar || "/avatar.svg"}
          alt="Avatar"
          className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm bg-white"
        />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-50 flex items-center justify-center">
          {notification.icon}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="text-[14px] text-gray-700 leading-snug">
            <span
              dangerouslySetInnerHTML={{
                __html: notification.content.replace(
                  /\*\*(.*?)\*\*/g,
                  '<span class="font-bold text-gray-900">$1</span>',
                ),
              }}
            />
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-[12px] text-gray-500 font-medium whitespace-nowrap">
              {notification.time}
            </span>
            <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 group-hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {notification.action && (
          <div className="mt-3">
            <button className="px-5 py-1.5 rounded-full text-sm font-bold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200">
              {notification.action}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const tabs = ["ALL", "Posts"];

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[225px] flex-shrink-0 space-y-3 self-start lg:sticky lg:top-[72px]">
            <SidebarProfile profile={profile} />
          </div>

          {/* Center Feed */}
          <div className="flex-1 max-w-[600px]">
            {/* Notifications Feed Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header & Tabs */}
              <div className="border-b border-gray-100">
                <div className="px-4 py-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    Notifications
                  </h1>
                </div>
                <div className="flex px-4 overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-bold transition-all relative whitespace-nowrap ${
                        activeTab === tab
                          ? "text-black"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-t-full"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification List */}
              <div className="flex flex-col min-h-[300px]">
                <AnimatePresence mode="popLayout">
                  {notificationsData
                    .filter((n) => {
                      if (activeTab === "Posts") return n.type === "post";
                      return n.type === "post" || n.type === "hiring";
                    })
                    .map((notif) => (
                      <NotificationItem key={notif.id} notification={notif} />
                    ))}
                </AnimatePresence>

                {/* Empty State */}
                {notificationsData.filter((n) => {
                  if (activeTab === "Posts") return n.type === "post";
                  return n.type === "post" || n.type === "hiring";
                }).length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 px-10 text-center"
                  >
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Bell className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      No notifications yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      Informative updates and connection posts will appear here.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Load More */}
              <div className="p-4 border-t border-gray-50 text-center bg-gray-50/30">
                <button className="px-4 py-1.5 text-[14px] font-bold text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center mx-auto gap-1">
                  Load earlier notifications
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[300px] flex-shrink-0 hidden lg:block">
            <div className="sticky top-[72px]">
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;
