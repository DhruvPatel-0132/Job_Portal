import { create } from "zustand";
import api from "../api/axios";

export const useProfileStore = create((set) => ({
  // ─── Own profile (logged-in user) ───────────────────────────────────────────
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

  // ─── Public profile (any user viewed by the logged-in user) ─────────────────
  publicProfile: null,       // profile data of the viewed user
  publicRole: null,          // role string: "user" | "hire" | "company"
  publicCompanyData: null,   // populated only when role === "company"
  publicConnectionStatus: "none", // "none" | "connected" | "pending_sent" | "pending_received"
  publicIsFollowing: false,  // true if following the company
  isFetchingPublic: false,
  publicError: null,

  setPublicConnectionStatus: (status) => set({ publicConnectionStatus: status }),
  setPublicIsFollowing: (isFollowing) => set({ publicIsFollowing: isFollowing }),

  /**
   * Fetch any user's public profile by their userId.
   * Stores result in publicProfile / publicRole / publicCompanyData,
   * completely separate from the logged-in user's own profile state.
   *
   * @param {string} userId - MongoDB ObjectId of the target user
   */
  fetchPublicProfile: async (userId) => {
    set({ isFetchingPublic: true, publicError: null });
    try {
      const res = await api.get(`/profile/${userId}`);
      if (res.data.success) {
        set({
          publicProfile: res.data.profile,
          publicRole: res.data.role,
          publicCompanyData: res.data.companyData ?? null,
          publicConnectionStatus: res.data.connectionStatus || "none",
          publicIsFollowing: res.data.isFollowing || false,
          isFetchingPublic: false,
        });
      } else {
        set({ publicError: "Profile not found", isFetchingPublic: false });
      }
    } catch (err) {
      set({
        publicError: err.response?.data?.message || err.message,
        isFetchingPublic: false,
      });
    }
  },

  /** Clear viewed-user state when navigating away from a public profile page. */
  clearPublicProfile: () =>
    set({
      publicProfile: null,
      publicRole: null,
      publicCompanyData: null,
      publicConnectionStatus: "none",
      publicIsFollowing: false,
      isFetchingPublic: false,
      publicError: null,
    }),
}));

