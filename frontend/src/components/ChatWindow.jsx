import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  MoreHorizontal,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";
import useSocketStore from "../store/socketStore";
import SystemMessage from "./SystemMessage";
import GroupMembersModal from "./GroupMembersModal";

const ChatWindow = () => {
  const {
    isChatOpen,
    activeConversation,
    messages,
    closeChat,
    sendMessage,
    onlineUsers,
    isMessagingPopupOpen,
    exitGroup,
  } = useMessageStore();
  const { user } = useAuthStore();
  const { socket } = useSocketStore();

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  const isGroup =
    activeConversation?.type === "group" ||
    activeConversation?.headline === "Group Chat";

  const isGroupChat =
    activeConversation?.isGroup === true ||
    activeConversation?.type === "group";

  const isParticipant =
    !isGroupChat ||
    (activeConversation?.participants &&
      activeConversation.participants.includes(user?._id));

  const isOnline =
    activeConversation && !isGroup
      ? onlineUsers.includes(activeConversation._id)
      : false;

  useEffect(() => {
    if (activeConversation?._id) {
      setIsMinimized(false);
    }
  }, [activeConversation?._id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    // Listen for typing events
    if (socket && !isGroup) {
      socket.on("userTyping", ({ userId, isTyping: typingStatus }) => {
        if (activeConversation && userId === activeConversation._id) {
          setIsTyping(typingStatus);
        }
      });
    }
    return () => {
      if (socket) socket.off("userTyping");
    };
  }, [socket, activeConversation, isGroup]);

  const handleTyping = (e) => {
    setText(e.target.value);

    e.target.style.height = "44px";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

    if (socket && activeConversation && !isGroup) {
      socket.emit("typing", {
        receiverId: activeConversation._id,
        isTyping: true,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", {
          receiverId: activeConversation._id,
          isTyping: false,
        });
      }, 1500);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConversation) return;

    sendMessage(activeConversation._id, text, isGroup);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }

    if (socket && !isGroup) {
      socket.emit("typing", {
        receiverId: activeConversation._id,
        isTyping: false,
      });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleExitGroup = async () => {
    if (window.confirm("Are you sure you want to exit this group?")) {
      setShowMenu(false);
      await exitGroup(activeConversation._id);
    }
  };

  if (!isChatOpen || !activeConversation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 500, opacity: 0, top: "20%" }}
        animate={{
          x: 0,
          opacity: 1,
          height: isMinimized ? 58 : 560,
          width: isMinimized ? 60 : 420,
          right: isMessagingPopupOpen ? 340 : 0,
          top: isMinimized
            ? isMessagingPopupOpen
              ? "calc(100vh - 58px)"
              : "calc(20% + 75px)"
            : "calc(100vh - 560px)",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        exit={{
          height: 58,
          x: 800,
          opacity: 0,
          transition: {
            height: { duration: 0.3 },
            x: { delay: 0.3, duration: 0.3 },
            opacity: { delay: 0.5, duration: 0.1 },
          },
        }}
        className={`fixed bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-[95] flex flex-col border border-gray-200 overflow-hidden ${
          isMinimized && !isMessagingPopupOpen
            ? "rounded-l-xl border-r-0 shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
            : "rounded-t-xl"
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src={activeConversation.avatar}
                alt="Avatar"
                className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                onError={(e) => {
                  const fallback = isGroup
                    ? "/group-avatar.svg"
                    : "/avatar.svg";
                  if (!e.target.src.endsWith(fallback)) {
                    e.target.src = fallback;
                  }
                }}
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <h4 className="text-[15px] font-bold text-gray-900 truncate leading-tight hover:text-blue-600 hover:underline transition-colors">
                    {activeConversation.fullName}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5 text-[12px]">
                    <span
                      className={`font-medium shrink-0 ${isGroup ? "text-blue-600 font-semibold" : isOnline ? "text-green-600" : "text-gray-500"}`}
                    >
                      {isGroup ? "Group Chat" : isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!isMinimized && (
            <div className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {/* Three-Dot Menu (Group Only) */}
              {isGroupChat && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={`p-1.5 rounded-full transition-colors ${
                      showMenu ? "bg-gray-100 text-[#0a66c2]" : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {showMenu && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-200 shadow-lg rounded-xl py-1.5 z-30 overflow-hidden flex flex-col"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowMenu(false);
                              setIsMembersOpen(true);
                            }}
                            className="px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                          >
                            See all group members
                          </button>
                          <button
                            type="button"
                            onClick={handleExitGroup}
                            className="px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold border-t border-gray-100"
                          >
                            Exit from group
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <button
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  closeChat();
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f4f2ee] hide-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center mt-8">
              <img
                src={activeConversation.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full mb-3 shadow-sm object-cover border-2 border-white"
                onError={(e) => {
                  const fallback = isGroup
                    ? "/group-avatar.svg"
                    : "/avatar.svg";
                  if (!e.target.src.endsWith(fallback)) {
                    e.target.src = fallback;
                  }
                }}
              />
              <h3 className="font-bold text-gray-900 text-[16px]">
                {activeConversation.fullName}
              </h3>
              <p className="text-[13px] text-gray-500 mt-1 max-w-[80%]">
                {activeConversation.headline}
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              if (msg.messageType === "system") {
                return (
                  <SystemMessage
                    key={msg._id}
                    message={msg.message}
                    isMe={msg.senderId === user?._id}
                  />
                );
              }

              const isMe = msg.senderId === user?._id;

              return (
                <div
                  key={msg._id}
                  className={`flex flex-col max-w-[80%] ${isMe ? "self-end" : "self-start"}`}
                >
                  <div
                    className={`px-3 py-1.5 rounded-2xl text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] break-words ${
                      isMe
                        ? "bg-white text-gray-800 rounded-tr-sm border border-gray-200"
                        : "bg-white text-gray-800 rounded-tl-sm border border-gray-200"
                    }`}
                  >
                    <div className="flow-root">
                      {!isMe && isGroup && msg.sender && (
                        <div className="text-[11px] font-bold text-[#0a66c2] mb-1 select-none leading-none">
                          {msg.sender.fullName}
                        </div>
                      )}
                      <span className="whitespace-pre-wrap">{msg.message}</span>
                      <div
                        className={`inline-flex items-center gap-1 text-[10px] float-right mt-1.5 ml-2 ${
                          isMe ? "text-gray-400" : "text-gray-400"
                        }`}
                      >
                        <span>{formatTime(msg.createdAt)}</span>
                        {isMe && (
                          <span className="flex items-center">
                            {msg.isSeen ? (
                              <CheckCheck className="w-3.5 h-3.5 text-[#4fc3f7]" />
                            ) : isOnline ? (
                              <CheckCheck className="w-3.5 h-3.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="self-start px-4 py-2 bg-white text-gray-500 rounded-2xl rounded-tl-sm text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-200 flex items-center gap-1 w-16">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        {!isParticipant ? (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500 font-semibold select-none">
            You left the group
          </div>
        ) : (
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-gray-200 flex items-end gap-2"
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTyping}
              rows={1}
              style={{ height: "44px" }}
              placeholder="Write a message..."
              className="flex-1 max-h-[120px] bg-[#f4f2ee] resize-none outline-none text-[14px] text-gray-900 rounded-xl px-3.5 py-2.5 hide-scrollbar transition-colors focus:bg-gray-100 border border-transparent focus:border-gray-200 overflow-y-auto"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="p-2.5 bg-[#0a66c2] text-white rounded-full hover:bg-[#004182] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex-shrink-0 mb-0.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </motion.div>

      {/* Group Members Modal */}
      <GroupMembersModal
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        groupId={activeConversation._id}
      />
    </AnimatePresence>
  );
};

export default ChatWindow;
