import React, { useState, useEffect } from "react";
import { X, Search, Check, Users, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNetworkStore } from "../store/networkStore";
import { useMessageStore } from "../store/messageStore";
import useSocketStore from "../store/socketStore";
import api from "../api/axios";
import { uploadToCloudinary } from "../utils/cloudinary";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { connections, fetchNetworkingData, isLoading: networkLoading } = useNetworkStore();
  const { fetchConversations, setActiveConversation } = useMessageStore();
  const { socket } = useSocketStore();

  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchNetworkingData();
    }
  }, [isOpen, fetchNetworkingData]);

  if (!isOpen) return null;

  // Filter connections by search query
  const filteredConnections = connections.filter((conn) =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleParticipant = (userId) => {
    if (selectedParticipants.includes(userId)) {
      setSelectedParticipants(selectedParticipants.filter((id) => id !== userId));
    } else {
      setSelectedParticipants([...selectedParticipants, userId]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setGroupAvatar(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Please enter a group name");
      return;
    }
    if (selectedParticipants.length < 2) {
      setError("A group chat requires a minimum of three members (you and at least two others).");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let avatarUrl = "";
      if (avatarFile) {
        const uploadResult = await uploadToCloudinary(avatarFile, "group_avatar", "image");
        avatarUrl = uploadResult.url;
      }

      const res = await api.post("/messages/groups", {
        name: groupName.trim(),
        avatar: avatarUrl || "/group-avatar.svg",
        participantIds: selectedParticipants,
      });

      if (res.data.success) {
        const newGroup = res.data.group;

        // Join the Socket room
        socket?.emit("group:join", { conversationId: newGroup._id });

        // Refresh conversation list
        await fetchConversations();

        // Immediately open the newly created group chat
        setActiveConversation({
          _id: newGroup._id,
          fullName: newGroup.groupName,
          avatar: newGroup.groupAvatar || "/group-avatar.svg",
          headline: "Group Chat",
          type: "group",
        });

        // Clear and close
        setGroupName("");
        setGroupAvatar("");
        setAvatarFile(null);
        setSelectedParticipants([]);
        onClose();
      }
    } catch (err) {
      console.error("Create group error:", err);
      setError(err.response?.data?.message || "Failed to create group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-[480px] h-[620px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-[#0a66c2] rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Create Group Chat</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form and Content */}
          <form onSubmit={handleCreate} className="flex-1 flex flex-col min-h-0 bg-[#f8f9fa]">
            <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-1 hide-scrollbar">
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-2.5 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Group Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Superstars"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all placeholder-gray-400 font-medium"
                  required
                />
              </div>

              {/* Group Avatar URL Input */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={groupAvatar || "/group-avatar.svg"}
                    alt="Group Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      const fallback = "/group-avatar.svg";
                      if (!e.target.src.endsWith(fallback)) {
                        e.target.src = fallback;
                      }
                    }}
                  />
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-[#0a66c2] transition-colors cursor-pointer">
                    <ImageIcon className="w-4 h-4" />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-xs text-gray-500 font-medium">Upload Group Image</span>
              </div>

              {/* Participants Selector */}
              <div className="flex flex-col gap-2 flex-1 min-h-0 mt-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex justify-between items-center">
                  <span>Add Connections</span>
                  {selectedParticipants.length > 0 && (
                    <span className="text-[#0a66c2] font-bold normal-case">
                      {selectedParticipants.length} selected
                    </span>
                  )}
                </label>

                {/* Search Connections */}
                <div className="relative bg-white border border-gray-200 rounded-xl flex items-center px-3.5 py-2.5 focus-within:border-[#0a66c2] transition-all flex-shrink-0">
                  <Search className="w-4.5 h-4.5 text-gray-400 mr-2.5" />
                  <input
                    type="text"
                    placeholder="Search connections by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>

                {/* Connections List */}
                <div className="flex-1 overflow-y-auto bg-white border border-gray-100 rounded-xl divide-y divide-gray-100 hide-scrollbar mt-1">
                  {networkLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2.5">
                      <Loader2 className="w-6 h-6 text-[#0a66c2] animate-spin" />
                      <span className="text-xs text-gray-500 font-medium">Loading connections...</span>
                    </div>
                  ) : filteredConnections.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500 font-medium">
                      {searchQuery ? "No matching connections found." : "No connections to add. Start connecting with others!"}
                    </div>
                  ) : (
                    filteredConnections.map((conn) => {
                      const isChecked = selectedParticipants.includes(conn._id);
                      return (
                        <div
                          key={conn._id}
                          onClick={() => toggleParticipant(conn._id)}
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={conn.avatar || "/avatar.svg"}
                              alt={conn.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0"
                              onError={(e) => {
                                const fallback = "/avatar.svg";
                                if (!e.target.src.endsWith(fallback)) {
                                  e.target.src = fallback;
                                }
                              }}
                            />
                            <div className="min-w-0">
                              <h5 className="text-sm font-bold text-gray-900 truncate">
                                {conn.name}
                              </h5>
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {conn.headline || "Network Connection"}
                              </p>
                            </div>
                          </div>

                          {/* Checkbox circle */}
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isChecked
                                ? "bg-[#0a66c2] border-[#0a66c2] text-white shadow-sm"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4.5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !groupName.trim() || selectedParticipants.length < 2}
                className="px-5 py-2.5 bg-[#0a66c2] text-white rounded-xl text-sm font-semibold hover:bg-[#004182] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Group"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateGroupModal;
