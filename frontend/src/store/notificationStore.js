import { create } from "zustand";
import api from "../api/axios";

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const params = category ? { category } : {};
      const res = await api.get("/notifications", { params });
      const notifications = res.data.success ? res.data.notifications : [];
      const nextState = {
        notifications,
        isLoading: false,
      };

      // Keep navbar indicator in sync when fetching "all" notifications.
      if (!category) {
        nextState.unreadCount = notifications.filter((n) => !n.isRead).length;
      }

      set({
        ...nextState,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message,
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      if (res.data.success) {
        set({ unreadCount: res.data.unreadCount || 0 });
      }
    } catch (error) {
      // Fallback: derive unread count from notifications list if count endpoint fails.
      try {
        const listRes = await api.get("/notifications");
        if (listRes.data.success) {
          const unreadCount = (listRes.data.notifications || []).filter((n) => !n.isRead).length;
          set({ unreadCount });
          return;
        }
      } catch (_) {
        // keep original error below
      }

      set({ error: error.response?.data?.message || error.message });
    }
  },

  markAsRead: async (id) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      if (!res.data.success) return;

      set((state) => {
        const notifications = state.notifications.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        );
        return {
          notifications,
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
      });
    }
  },

  markAllAsRead: async () => {
    try {
      const res = await api.patch("/notifications/read-all");
      if (!res.data.success) return;

      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
      });
    }
  },
}));
