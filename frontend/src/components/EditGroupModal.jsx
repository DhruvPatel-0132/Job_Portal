import React, { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Loader2, Trash2, Search, UserPlus, UserMinus, Shield, ShieldOff, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageStore } from "../store/messageStore";
import { useNetworkStore } from "../store/networkStore";
import { useAuthStore } from "../store/authStore";
import { uploadToCloudinary } from "../utils/cloudinary";
import api from "../api/axios";
import ConfirmDialog from "./ui/ConfirmDialog";

const EditGroupModal = ({ isOpen, onClose, group }) => {
  const { editGroupDetails, addGroupMembers, removeGroupMember, assignGroupAdmin, removeGroupAdmin } = useMessageStore();
  const { connections, fetchNetworkingData } = useNetworkStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState("details"); // "details" | "members"

  const [groupName, setGroupName] = useState(group?.fullName || "");
  const [groupAvatar, setGroupAvatar] = useState(group?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog state for removing members
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  // To track newly added/removed members in local state before refetching
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setGroupName(group?.fullName || "");
      setGroupAvatar(group?.avatar || "");
      setAvatarFile(null);
      setActiveTab("details");
      fetchNetworkingData();
      fetchMembers();
    }
  }, [isOpen, group]);

  const fetchMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const res = await api.get(`/messages/groups/${group._id}/members`);
      if (res.data.success) {
        setMembers(res.data.members);
      }
    } catch (err) {
      console.error("Error fetching members", err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  if (!isOpen) return null;

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

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Please enter a group name");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let avatarUrl = groupAvatar; 

      if (avatarFile) {
        const uploadResult = await uploadToCloudinary(avatarFile, "group_avatar", "image");
        avatarUrl = uploadResult.url;
      } else if (!groupAvatar || groupAvatar.endsWith("/group-avatar.svg")) {
        avatarUrl = ""; 
      }

      await editGroupDetails(group._id, groupName.trim(), avatarUrl);
      
      onClose();
    } catch (err) {
      console.error("Edit group error:", err);
      setError(err.response?.data?.message || "Failed to update group details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async (userId) => {
    setPendingAction(userId);
    try {
      await addGroupMembers(group._id, [userId]);
      await fetchMembers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add member.");
    } finally {
      setPendingAction(null);
    }
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    setPendingAction(memberToRemove._id);
    setIsRemoveDialogOpen(false);
    try {
      await removeGroupMember(group._id, memberToRemove._id);
      await fetchMembers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove member.");
    } finally {
      setPendingAction(null);
      setMemberToRemove(null);
    }
  };

  const handleRemoveMember = (member) => {
    setMemberToRemove(member);
    setIsRemoveDialogOpen(true);
  };

  const handleToggleAdmin = async (member) => {
    const isMemberAdmin = group?.groupAdmins?.includes(member._id);
    if (isMemberAdmin && group?.groupAdmins?.length === 1) {
      setError("Cannot remove the only admin of the group.");
      return;
    }
    
    setPendingAction(member._id);
    try {
      if (isMemberAdmin) {
        await removeGroupAdmin(group._id, member._id);
      } else {
        await assignGroupAdmin(group._id, member._id);
      }
      await fetchMembers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update admin status.");
    } finally {
      setPendingAction(null);
    }
  };

  const memberIds = members.map(m => m._id);
  const availableConnections = connections.filter(
    (conn) => !memberIds.includes(conn._id) && conn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className="relative bg-white w-full max-w-[480px] h-[650px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
            <h3 className="text-lg font-bold text-gray-900">Manage Group</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 shrink-0">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "details"
                  ? "border-[#0a66c2] text-[#0a66c2]"
                  : "border-transparent text-gray-500 hover:bg-gray-50"
              }`}
            >
              Group Details
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 flex justify-center items-center gap-2 ${
                activeTab === "members"
                  ? "border-[#0a66c2] text-[#0a66c2]"
                  : "border-transparent text-gray-500 hover:bg-gray-50"
              }`}
            >
              Add Member
            </button>
          </div>

          {error && (
            <div className="mx-6 mt-4 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-2.5 text-sm font-medium shrink-0">
              {error}
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto bg-[#f8f9fa] hide-scrollbar">
            {activeTab === "details" ? (
              <form id="group-details-form" onSubmit={handleSubmitDetails} className="p-6 flex flex-col gap-6">
                {/* Group Avatar Input */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <img
                      src={groupAvatar || "/group-avatar.svg"}
                      alt="Group Avatar"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      title="Click to change image"
                      onError={(e) => {
                        const fallback = "/group-avatar.svg";
                        if (!e.target.src.endsWith(fallback)) {
                          e.target.src = fallback;
                        }
                      }}
                    />
                    {groupAvatar && !groupAvatar.endsWith("/group-avatar.svg") ? (
                      <button
                        type="button"
                        onClick={() => {
                          setGroupAvatar("");
                          setAvatarFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 text-red-500 hover:text-red-600 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-[#0a66c2] transition-colors"
                        title="Upload Image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Upload Group Image</span>
                </div>

                {/* Group Name Input */}
                <div className="flex flex-col gap-1.5 shrink-0">
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

                {/* Current Members */}
                <div className="flex flex-col gap-2 flex-1 min-h-[200px]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Current Members
                    </label>
                    <span className="text-xs font-semibold text-[#0a66c2] bg-blue-50 px-2 py-1 rounded-md">
                      Total: {members.length}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-y-auto flex-1 hide-scrollbar">
                    {isLoadingMembers ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0a66c2]" />
                      </div>
                    ) : (
                      members
                        .sort((a, b) => {
                          const aIndex = group?.groupAdmins?.indexOf(a._id) ?? -1;
                          const bIndex = group?.groupAdmins?.indexOf(b._id) ?? -1;
                          if (aIndex !== -1 && bIndex === -1) return -1;
                          if (aIndex === -1 && bIndex !== -1) return 1;
                          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                          return 0;
                        })
                        .map((member) => {
                        const isAdmin = group?.groupAdmins?.includes(member._id);
                        const isMe = member._id === user?._id;
                        
                        return (
                          <div key={member._id} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={member.avatar || "/avatar.svg"} alt="" className="w-10 h-10 rounded-full border border-gray-100 object-cover shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 truncate">
                                  {member.fullName}
                                  {isMe && <span className="text-[10px] text-gray-500 font-medium">(You)</span>}
                                  {isAdmin && <span className="px-1.5 py-0.5 bg-blue-100 text-[#0a66c2] text-[10px] font-bold rounded-md uppercase tracking-wider border border-blue-200 shadow-sm shrink-0">Admin</span>}
                                </h4>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{member.headline || "LinkedIn Member"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              {!isMe && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleAdmin(member)}
                                  disabled={pendingAction === member._id || (isAdmin && group?.groupAdmins?.length === 1)}
                                  className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                                    isAdmin ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                  }`}
                                  title={isAdmin ? "Remove Admin" : "Make Admin"}
                                >
                                  {pendingAction === member._id ? <Loader2 className="w-4 h-4 animate-spin" /> : isAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                </button>
                              )}
                              
                              {!isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMember(member)}
                                  disabled={pendingAction === member._id}
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                  title="Remove member"
                                >
                                  {pendingAction === member._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex flex-col h-full p-4 gap-2">
                {/* Search Add Members */}
                <div className="flex flex-col gap-2 flex-1 min-h-0">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider shrink-0">
                    Add New Members
                  </label>
                  <div className="relative bg-white border border-gray-200 rounded-xl flex items-center px-3.5 py-2.5 focus-within:border-[#0a66c2] transition-all">
                    <Search className="w-4.5 h-4.5 text-gray-400 mr-2.5" />
                    <input
                      type="text"
                      placeholder="Search connections to add..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder-gray-400 font-medium"
                    />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl flex-1 overflow-y-auto mt-2 shadow-sm hide-scrollbar">
                    {availableConnections.length === 0 ? (
                      <div className="p-8 flex flex-col items-center justify-center text-center gap-2">
                        <Users className="w-8 h-8 text-gray-300" />
                        <span className="text-sm text-gray-500 font-medium">No connections available to add.</span>
                      </div>
                    ) : (
                      availableConnections.map((conn) => (
                        <div key={conn._id} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <img src={conn.avatar || "/avatar.svg"} alt="" className="w-10 h-10 rounded-full border border-gray-100 object-cover" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">{conn.name}</span>
                              <span className="text-[11px] text-gray-500">{conn.headline || "Network Connection"}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddMember(conn._id)}
                            disabled={pendingAction === conn._id}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Add to group"
                          >
                            {pendingAction === conn._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Close
            </button>
            {activeTab === "details" && (
              <button
                type="submit"
                form="group-details-form"
                disabled={isSubmitting || !groupName.trim() || (groupName === group?.fullName && !avatarFile && groupAvatar === group?.avatar)}
                className="px-5 py-2 bg-[#0a66c2] text-white rounded-xl text-sm font-semibold hover:bg-[#004182] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <ConfirmDialog
        isOpen={isRemoveDialogOpen}
        onClose={() => {
          setIsRemoveDialogOpen(false);
          setMemberToRemove(null);
        }}
        onConfirm={confirmRemoveMember}
        title="Remove Member"
        description={`Are you sure you want to remove ${memberToRemove?.fullName} from the group?`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />
    </AnimatePresence>
  );
};

export default EditGroupModal;
