import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";
import useSocketStore from "../store/socketStore";

const ChatWindow = () => {
  const {
    isChatOpen,
    activeConversation,
    messages,
    closeChat,
    sendMessage,
    onlineUsers,
    isMessagingPopupOpen,
  } = useMessageStore();
  const { user } = useAuthStore();
  const { socket } = useSocketStore();

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  const isOnline = activeConversation
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
    if (socket) {
      socket.on("userTyping", ({ userId, isTyping: typingStatus }) => {
        if (activeConversation && userId === activeConversation._id) {
          setIsTyping(typingStatus);
        }
      });
    }
    return () => {
      if (socket) socket.off("userTyping");
    };
  }, [socket, activeConversation]);

  const handleTyping = (e) => {
    setText(e.target.value);

    e.target.style.height = "44px";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

    if (socket && activeConversation) {
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

    sendMessage(activeConversation._id, text);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }

    if (socket) {
      socket.emit("typing", {
        receiverId: activeConversation._id,
        isTyping: false,
      });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
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
                  e.target.src = "/avatar.svg";
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
                      className={`font-medium shrink-0 ${isOnline ? "text-green-600" : "text-gray-500"}`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!isMinimized && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
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
                  e.target.src = "/avatar.svg";
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
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWindow;
