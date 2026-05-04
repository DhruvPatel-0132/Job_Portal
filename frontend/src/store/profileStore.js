import { create } from "zustand";
import api from "../api/axios";

export const useProfileStore = create((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/profile/me");
      set({ profile: res.data.profile, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  updateProfile: async (updateData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put("/profile/me", updateData);
      set({ profile: res.data.profile, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
      return false;
    }
  },

  clearProfile: () => set({ profile: null, isLoading: false, error: null }),
}));
