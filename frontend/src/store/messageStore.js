import { create } from "zustand";
import api from "../api/axios";
import useSocketStore from "./socketStore";
import { useAuthStore } from "./authStore";

export const useMessageStore = create((set, get) => ({
  conversations: [],
  activeConversation: null, // Stores { _id, fullName, avatar, ... } of the other user
  messages: [],
  onlineUsers: [],
  isChatOpen: false,
  isMessagingPopupOpen: false,

  setMessagingPopupOpen: (isOpen) => set({ isMessagingPopupOpen: isOpen }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addOnlineUser: (userId) => set((state) => ({ onlineUsers: [...new Set([...state.onlineUsers, userId])] })),
  removeOnlineUser: (userId) => set((state) => ({ onlineUsers: state.onlineUsers.filter(id => id !== userId) })),
  
  fetchConversations: async () => {
    try {
      const [msgRes, connRes] = await Promise.all([
        api.get("/messages/conversations"),
        api.get("/connections")
      ]);
      
      if (msgRes.data.success && connRes.data.success) {
        const convos = msgRes.data.conversations;
        const connections = connRes.data.connections;

        const merged = [];
        const convMap = {};
        
        convos.forEach(c => {
          if (c.type === "group") {
            // Push group conversations directly to the merged list
            merged.push(c);
          } else if (c.otherParticipant && c.otherParticipant._id) {
            convMap[c.otherParticipant._id.toString()] = c;
          }
        });

        connections.forEach(conn => {
          const connId = conn._id.toString();
          if (convMap[connId]) {
            merged.push(convMap[connId]);
            delete convMap[connId];
          } else {
            merged.push({
              _id: `conn_${connId}`,
              lastMessage: null,
              updatedAt: null,
              unreadCount: 0,
              otherParticipant: {
                _id: conn._id,
                fullName: conn.name,
                avatar: conn.avatar,
                headline: conn.headline,
                type: "private",
              }
            });
          }
        });

        // Add any conversations with non-connections
        Object.values(convMap).forEach(c => merged.push(c));

        // Sort: active chats first (descending), then others
        merged.sort((a, b) => {
          const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return timeB - timeA;
        });

        set({ conversations: merged });
      }
    } catch (err) {
      console.error(err);
    }
  },

  setActiveConversation: async (user) => {
    // Find the full conversation details in state if it exists
    const fullConv = get().conversations.find(c => c.otherParticipant?._id === user._id);
    const conversationToSet = fullConv ? {
      ...user,
      participants: fullConv.participants,
      groupAdmins: fullConv.groupAdmins,
      type: fullConv.type || user.type,
      openedAt: Date.now(),
    } : { ...user, openedAt: Date.now() };

    set({ activeConversation: conversationToSet, isChatOpen: true, messages: [] });
    try {
      const res = await api.get(`/messages/${user._id}`);
      if (res.data.success) {
        set({ messages: res.data.messages });
        
        // Update local unread count
        set((state) => ({
          conversations: state.conversations.map(c => 
            c.otherParticipant?._id === user._id ? { ...c, unreadCount: 0 } : c
          )
        }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  closeChat: () => {
    set({ isChatOpen: false, activeConversation: null, messages: [] });
  },

  sendMessage: (receiverId, messageText, isGroup = false) => {
    const socket = useSocketStore.getState().socket;
    if (socket) {
      if (isGroup) {
        socket.emit("group:message", { conversationId: receiverId, messageText });
      } else {
        socket.emit("sendMessage", { receiverId, messageText });
      }
    }
  },

  addMessage: (message) => {
    const { activeConversation } = get();
    
    // If the message belongs to the currently active chat
    if (activeConversation && !activeConversation.type && (message.senderId === activeConversation._id || message.receiverId === activeConversation._id)) {
      set((state) => ({
        messages: [...state.messages, message]
      }));

      // If we are receiving the message while chat is open, mark it seen
      if (message.senderId === activeConversation._id) {
        const socket = useSocketStore.getState().socket;
        socket?.emit("messageSeen", { conversationId: message.conversationId, senderId: message.senderId });
      }
    }

    // Always fetch conversations to update last message preview and unread counts
    get().fetchConversations();
  },

  addGroupMessage: (message) => {
    const { activeConversation } = get();
    
    // If the message belongs to the currently active group chat
    if (activeConversation && activeConversation.type === "group" && activeConversation._id === message.conversationId) {
      set((state) => ({
        messages: [...state.messages, message]
      }));

      // Mark seen if chat is open and sender is not us
      const socket = useSocketStore.getState().socket;
      socket?.emit("messageSeen", { conversationId: message.conversationId, senderId: message.senderId });
    }

    // Always fetch conversations to update last message preview and unread counts
    get().fetchConversations();
  },

  updateMessageSeen: (data) => {
    // data: { conversationId, seenBy }
    set((state) => ({
      messages: state.messages.map(m => 
        (m.conversationId === data.conversationId && m.senderId !== data.seenBy) 
        ? { ...m, isSeen: true } : m
      )
    }));
  },

  editGroupDetails: async (groupId, name, avatar) => {
    try {
      const res = await api.put(`/messages/groups/${groupId}`, { name, avatar });
      if (res.data.success) {
        get().fetchConversations();
        const active = get().activeConversation;
        if (active && active._id === groupId) {
          set({
            activeConversation: {
              ...active,
              fullName: res.data.group.groupName,
              avatar: res.data.group.groupAvatar || "/group-avatar.svg",
              groupName: res.data.group.groupName,
              groupAvatar: res.data.group.groupAvatar,
            }
          });
        }
        return res.data;
      }
    } catch (err) {
      console.error("editGroupDetails error:", err);
      throw err;
    }
  },

  exitGroup: async (groupId) => {
    try {
      const res = await api.post(`/messages/groups/${groupId}/exit`);
      if (res.data.success) {
        // Fetch conversations again to sync state
        get().fetchConversations();
        
        // Update activeConversation to reflect that the user is no longer a participant
        const active = get().activeConversation;
        if (active && active._id === groupId) {
          const currentUser = useAuthStore.getState().user;
          set({
            activeConversation: {
              ...active,
              participants: active.participants ? active.participants.filter(p => p !== currentUser?._id) : []
            }
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("exitGroup error:", err);
      return false;
    }
  },

  addGroupMembers: async (groupId, participantIds) => {
    try {
      const res = await api.post(`/messages/groups/${groupId}/members`, { participantIds });
      if (res.data.success) {
        get().fetchConversations();
        const active = get().activeConversation;
        if (active && active._id === groupId) {
          set({
            activeConversation: {
              ...active,
              participants: res.data.group.participants,
            },
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("addGroupMembers error:", err);
      throw err;
    }
  },

  removeGroupMember: async (groupId, memberId) => {
    try {
      const res = await api.delete(`/messages/groups/${groupId}/members/${memberId}`);
      if (res.data.success) {
        get().fetchConversations();
        const active = get().activeConversation;
        if (active && active._id === groupId) {
          set({
            activeConversation: {
              ...active,
              participants: active.participants ? active.participants.filter(p => p !== memberId) : [],
            },
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("removeGroupMember error:", err);
      throw err;
    }
  },

  deleteGroup: async (groupId) => {
    try {
      const res = await api.delete(`/messages/groups/${groupId}`);
      if (res.data.success) {
        get().fetchConversations();
        const active = get().activeConversation;
        if (active && active._id === groupId) {
          set({ activeConversation: null, isChatOpen: false });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("deleteGroup error:", err);
      throw err;
    }
  },

  assignGroupAdmin: async (groupId, userId) => {
    try {
      const res = await api.post(`/messages/groups/${groupId}/admins/${userId}`);
      if (res.data.success) {
        get().fetchConversations();
        const active = get().activeConversation;
        if (active && active._id === groupId) {
          set({
            activeConversation: {
              ...active,
              groupAdmins: res.data.group.groupAdmins,
            },
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("assignGroupAdmin error:", err);
      throw err;
    }
  },

  removeGroupAdmin: async (groupId, userId) => {
    try {
      const res = await api.delete(`/messages/groups/${groupId}/admins/${userId}`);
      if (res.data.success) {
        get().fetchConversations();
        const active = get().activeConversation;
        if (active && active._id === groupId) {
          set({
            activeConversation: {
              ...active,
              groupAdmins: res.data.group.groupAdmins,
            },
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("removeGroupAdmin error:", err);
      throw err;
    }
  }
}));
