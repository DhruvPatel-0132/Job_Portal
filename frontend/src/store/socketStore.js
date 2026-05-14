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
        // Simple refresh logic: fetch posts to get the latest
        usePostStore.getState().fetchPosts();
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
