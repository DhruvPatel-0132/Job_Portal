import React, { useState } from "react";
import {
  ChevronRight,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const contacts = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "online",
    message: "Hey, are you available for a chat?",
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "offline",
    message: "Sent an attachment",
  },
  {
    id: 3,
    name: "Charlie Brown",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "online",
    message: "Thanks for the update.",
  },
  {
    id: 4,
    name: "Diana Prince",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "online",
    message: "Let's connect next week.",
  },
  {
    id: 5,
    name: "Evan Wright",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "offline",
    message: "Sounds good!",
  },
];

const MessagingPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            className="fixed top-1/5 right-0 -translate-y-1/2 z-[90] cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="bg-white border border-gray-200 border-r-0 rounded-l-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] py-4 px-3 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors group">
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
            className="fixed top-0 right-0 h-screen w-[320px] bg-white shadow-[-5px_0_25px_rgba(0,0,0,0.15)] z-[100] flex flex-col font-sans border-l border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Me"
                    className="w-9 h-9 rounded-full border border-gray-200"
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
                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100 bg-white">
              <div className="relative bg-[#eef3f8] rounded-md flex items-center px-3 py-2 border border-transparent focus-within:border-[#0a66c2] focus-within:bg-white transition-colors">
                <Search className="w-4 h-4 text-gray-600 mr-2" />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-600 text-gray-900"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto hide-scrollbar bg-white">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full border border-gray-200"
                    />
                    {contact.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-[15px] font-semibold text-gray-900 truncate">
                        {contact.name}
                      </h4>
                      <span className="text-[11px] text-gray-500">Mar 12</span>
                    </div>
                    <p className="text-[13px] text-gray-500 truncate">
                      {contact.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MessagingPopup;
