import React, { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const GroupMembersModal = ({ isOpen, onClose, groupId }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150">
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

          {/* Members List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[250px] hide-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500 font-medium">Loading members...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No members found in this group.
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member._id}
                  onClick={() => {
                    onClose();
                    navigate(`/profile/${member._id}`);
                  }}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer transition-all duration-200"
                >
                  <img
                    src={member.avatar || "/avatar.svg"}
                    alt={member.fullName}
                    className="w-11 h-11 rounded-full object-cover border border-gray-150 bg-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/avatar.svg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-gray-900 truncate">
                      {member.fullName}
                    </h4>
                    <p className="text-[11.5px] text-gray-500 truncate mt-0.5">
                      {member.headline || "LinkedIn Member"}
                    </p>
                  </div>
                  <User className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GroupMembersModal;
