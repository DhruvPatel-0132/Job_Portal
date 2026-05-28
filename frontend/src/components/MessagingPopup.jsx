import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Search,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";
import CreateGroupModal from "./CreateGroupModal";

const MessagingPopup = () => {
  const {
    isMessagingPopupOpen: isOpen,
    setMessagingPopupOpen: setIsOpen,
    conversations,
    fetchConversations,
    setActiveConversation,
    onlineUsers,
  } = useMessageStore();
  const { profile, company } = useAuthStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, fetchConversations]);

  return (
    <>
      {/* Toggle Button (visible when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[20%] right-0 -translate-y-1/2 z-[90] cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="bg-white border border-gray-200 border-r-0 rounded-l-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] py-4 w-[60px] flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors group">
              <MessageSquare className="w-5 h-5 text-gray-500 group-hover:text-[#0a66c2] transition-colors" />
              <span
                className="text-[13px] font-semibold text-gray-700 tracking-wider group-hover:text-[#0a66c2] transition-colors"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                Messaging
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Panel sliding from right */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-screen w-[320px] bg-whitez shadow-[-5px_0_25px_rgba(0,0,0,0.15)] z-[100] flex flex-col font-sans border-l border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white relative flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={profile?.avatar || company?.logo || "/avatar.svg"}
                    alt="Me"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/avatar.svg";
                    }}
                    className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                  />

                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <span className="font-semibold text-[15px] text-gray-900">
                  Messaging
                </span>
              </div>
              <div className="flex items-center text-gray-500 gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Pencil / Edit button dropdown menu container */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`p-1.5 rounded-full transition-colors ${
                      showDropdown
                        ? "bg-gray-100 text-[#0a66c2]"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <>
                        {/* Invisible backdrop to dismiss dropdown */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowDropdown(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 shadow-lg rounded-xl py-1.5 z-20 overflow-hidden flex flex-col"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowDropdown(false);
                              setIsGroupModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                          >
                            <Users className="w-4 h-4 text-gray-400" />
                            Create Group Chat
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100 bg-white flex-shrink-0">
              <div className="relative bg-[#eef3f8] rounded-md flex items-center px-3 py-2 border border-transparent focus-within:border-[#0a66c2] focus-within:bg-white transition-colors">
                <Search className="w-4 h-4 text-gray-600 mr-2" />
                <input
                  type="text"
                  placeholder="Search messages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-600 text-gray-900"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto hide-scrollbar bg-white">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No conversations yet. Start a chat with your connections!
                </div>
              ) : (
                (() => {
                  const filteredConversations = conversations.filter((conv) => {
                    if (!searchQuery.trim()) return true;
                    const name =
                      conv.otherParticipant?.fullName?.toLowerCase() || "";
                    return name.includes(searchQuery.toLowerCase());
                  });

                  if (filteredConversations.length === 0) {
                    return (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        No matching conversations found.
                      </div>
                    );
                  }

                  return filteredConversations.map((conv, index) => {
                    const isGroup = conv.type === "group";
                    const isOnline =
                      !isGroup &&
                      onlineUsers.includes(conv.otherParticipant?._id);

                    return (
                      <div
                        key={`${conv._id || "conv"}-${index}`}
                        onClick={() =>
                          setActiveConversation(conv.otherParticipant)
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none transition-colors"
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={conv.otherParticipant?.avatar || "/avatar.svg"}
                            alt={
                              conv.otherParticipant?.fullName || "Chat Avatar"
                            }
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const fallback = isGroup
                                ? "/group-avatar.svg"
                                : "/avatar.svg";
                              if (!e.target.src.endsWith(fallback)) {
                                e.target.src = fallback;
                              }
                            }}
                            className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                          />
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="text-[15px] font-semibold text-gray-900 truncate">
                              {conv.otherParticipant?.fullName}
                            </h4>
                            <span className="text-[11px] text-gray-500">
                              {conv.updatedAt
                                ? new Date(conv.updatedAt).toLocaleDateString(
                                    undefined,
                                    { month: "short", day: "numeric" },
                                  )
                                : ""}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p
                              className={`text-[13px] truncate pr-2 ${conv.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-500"}`}
                            >
                              {conv.lastMessage?.message || "No messages yet"}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-[#0a66c2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Group Creation Modal */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </>
  );
};

export default MessagingPopup;
