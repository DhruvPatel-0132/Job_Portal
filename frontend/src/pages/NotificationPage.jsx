import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, UserPlus, CheckCircle2, Building2 } from "lucide-react";
import SidebarProfile from "../components/dashboard/SidebarProfile";
import Footer from "../components/dashboard/Footer";
import { useProfileStore } from "../store/profileStore";
import { useNotificationStore } from "../store/notificationStore";

const getNotificationMessage = (notification) => {
  const senderName = notification?.sender?.fullName || "Someone";

  switch (notification.type) {
    case "CONNECTION_REQUEST":
      return `${senderName} sent you a connection request.`;
    case "CONNECTION_ACCEPTED":
      return `${senderName} accepted your connection request.`;
    case "FOLLOW":
      return `${senderName} started following your company.`;
    case "POST":
      return `${senderName} published a new post.`;
    default:
      return `${senderName} sent you a notification.`;
  }
};

const formatTimeAgo = (dateValue) => {
  const now = new Date();
  const date = new Date(dateValue);
  const diffInSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSec < 60) return "Just now";
  if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m`;
  if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h`;
  return `${Math.floor(diffInSec / 86400)}d`;
};

const getNotificationIcon = (type) => {
  if (type === "CONNECTION_REQUEST") return <UserPlus className="w-3.5 h-3.5 text-blue-600" />;
  if (type === "CONNECTION_ACCEPTED") return <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />;
  if (type === "FOLLOW") return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
  return <Bell className="w-3.5 h-3.5 text-gray-600" />;
};

const NotificationItem = ({ notification, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
      onClick={onClick}
      className={`p-4 flex gap-4 border-b border-gray-100 transition-all cursor-pointer relative group ${!notification.isRead ? "bg-blue-50/30" : "bg-white"}`}
    >
      {!notification.isRead && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
      )}

      <div className="relative flex-shrink-0">
        <img
          src={notification.sender?.avatar || "/avatar.svg"}
          alt="Avatar"
          className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm bg-white"
        />
        {!notification.isRead && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-50 flex items-center justify-center">
            {getNotificationIcon(notification.type)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <p className="text-[14px] text-gray-700 leading-snug">{getNotificationMessage(notification)}</p>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-[12px] text-gray-500 font-medium whitespace-nowrap">
              {formatTimeAgo(notification.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const { profile, fetchProfile } = useProfileStore();
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead, fetchUnreadCount } =
    useNotificationStore();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  useEffect(() => {
    const category = activeTab === "CONNECTIONS" ? "CONNECTION" : undefined;
    fetchNotifications(category);
  }, [activeTab, fetchNotifications]);

  const tabs = [
    { key: "ALL", label: "All" },
    { key: "CONNECTIONS", label: "Connections" },
  ];

  const filteredNotifications = useMemo(() => {
    if (activeTab === "CONNECTIONS") {
      return notifications.filter((notification) => notification.category === "CONNECTION");
    }
    return notifications;
  }, [activeTab, notifications]);

  const unreadInView = filteredNotifications.filter((notification) => !notification.isRead).length;

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
                  <div className="flex items-center justify-between gap-3">
                    <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                    <button
                      onClick={async () => {
                        await markAllAsRead();
                        fetchUnreadCount();
                      }}
                      disabled={unreadInView === 0}
                      className="text-xs font-semibold text-black hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="flex px-4 overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-3 text-sm font-bold transition-all relative whitespace-nowrap ${
                        activeTab === tab.key
                          ? "text-black"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.key && (
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
                  {filteredNotifications.map((notif) => (
                    <NotificationItem
                      key={notif._id}
                      notification={notif}
                      onClick={async () => {
                        if (!notif.isRead) {
                          await markAsRead(notif._id);
                          fetchUnreadCount();
                        }
                      }}
                    />
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {!isLoading && filteredNotifications.length === 0 && (
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
                      Your latest updates will appear here.
                    </p>
                  </motion.div>
                )}
                {isLoading && (
                  <div className="py-20 text-center text-sm text-gray-500">Loading notifications...</div>
                )}
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
