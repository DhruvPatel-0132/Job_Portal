import React, { useEffect, useState } from "react";
import { X, User, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const GroupMembersModal = ({ isOpen, onClose, groupId, groupAdmins }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && groupId) {
      const fetchMembers = async () => {
        setIsLoading(true);
        try {
          const res = await api.get(`/messages/groups/${groupId}/members`);
          if (res.data.success) {
            setMembers(res.data.members);
          }
        } catch (err) {
          console.error("Error fetching group members:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMembers();
    }
  }, [isOpen, groupId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden font-sans z-10 border border-gray-100 flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
            <h3 className="font-bold text-[18px] text-gray-900">
              Group Members ({members.length})
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pt-4 pb-2 border-b border-gray-100 bg-gray-50 shrink-0">
            <div className="relative bg-white border border-gray-200 rounded-xl flex items-center px-3.5 py-2.5 focus-within:border-[#0a66c2] focus-within:ring-1 focus-within:ring-[#0a66c2] transition-all">
              <Search className="w-4.5 h-4.5 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search members by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto flex flex-col max-h-[400px] bg-white hide-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500 font-medium">
                  Loading members...
                </span>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No members found in this group.
              </div>
            ) : (
              members
                .filter((member) =>
                  member.fullName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                )
                .sort((a, b) => {
                  const aIndex = groupAdmins?.indexOf(a._id) ?? -1;
                  const bIndex = groupAdmins?.indexOf(b._id) ?? -1;
                  if (aIndex !== -1 && bIndex === -1) return -1;
                  if (aIndex === -1 && bIndex !== -1) return 1;
                  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                  return 0;
                })
                .map((member) => (
                  <div
                    key={member._id}
                    onClick={() => {
                      onClose();
                      navigate(`/profile/${member.slug || member._id}`);
                    }}
                    className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <img
                      src={member.avatar || "/avatar.svg"}
                      alt={member.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-white shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar.svg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[14px] font-bold text-gray-900 truncate">
                          {member.fullName}
                        </h4>
                        {groupAdmins?.includes(member._id) && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-[#0a66c2] text-[10px] font-bold rounded-md uppercase tracking-wider shrink-0 border border-blue-200 shadow-sm">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-gray-500 truncate mt-0.5">
                        {member.headline || "LinkedIn Member"}
                      </p>
                    </div>
                    <User className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                ))
            )}
            {!isLoading &&
              members.length > 0 &&
              members.filter((m) =>
                m.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
              ).length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">
                  No members found matching "{searchQuery}"
                </div>
              )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GroupMembersModal;
