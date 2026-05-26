import { create } from "zustand";
import { io } from "socket.io-client";

const useSocketStore = create((set, get) => ({
  socket: null,
  connectSocket: (token) => {
    if (get().socket) return;

    const socket = io("http://localhost:5000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Listen for general notifications (connections, likes, etc.)
    socket.on("notification", (notification) => {
      import("./notificationStore").then(({ useNotificationStore }) => {
        useNotificationStore.getState().fetchUnreadCount();
        useNotificationStore.getState().fetchNotifications();
      });
      import("./networkStore").then(({ useNetworkStore }) => {
        useNetworkStore.getState().fetchPendingIncomingCount();
      });
    });

    // Listen for new posts globally
    socket.on("new_post", (post) => {
      import("./postStore").then(({ default: usePostStore }) => {
        usePostStore.getState().fetchPosts();
      });
    });

    // Messaging & Online Status Events
    socket.on("onlineUsers", (users) => {
      import("./messageStore").then(({ useMessageStore }) => {
        useMessageStore.getState().setOnlineUsers(users);
      });
    });

    socket.on("userOnline", ({ userId }) => {
      import("./messageStore").then(({ useMessageStore }) => {
        useMessageStore.getState().addOnlineUser(userId);
      });
    });

    socket.on("userOffline", ({ userId }) => {
      import("./messageStore").then(({ useMessageStore }) => {
        useMessageStore.getState().removeOnlineUser(userId);
      });
    });

    socket.on("receiveMessage", (message) => {
      import("./messageStore").then(({ useMessageStore }) => {
        useMessageStore.getState().addMessage(message);
      });
    });

    socket.on("group:create", (group) => {
      // Join the socket room for this new group
      socket.emit("group:join", { conversationId: group._id });
      import("./messageStore").then(({ useMessageStore }) => {
        useMessageStore.getState().fetchConversations();
      });
    });

    socket.on("group:message", (message) => {
      import("./messageStore").then(({ useMessageStore }) => {
        useMessageStore.getState().addGroupMessage(message);
      });
    });

    socket.on("messagesSeen", (data) => {
      import("./messageStore").then(({ useMessageStore }) => {
        useMessageStore.getState().updateMessageSeen(data);
      });
    });

    socket.on("group:userLeft", ({ conversationId, userId, message }) => {
      import("./messageStore").then(({ useMessageStore }) => {
        const store = useMessageStore.getState();
        const active = store.activeConversation;
        if (active && active.type === "group" && active._id === conversationId) {
          useMessageStore.setState({
            activeConversation: {
              ...active,
              participants: active.participants ? active.participants.filter(p => p !== userId) : []
            }
          });
        }
        store.addGroupMessage(message);
      });
    });

    set({ socket });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useSocketStore;
