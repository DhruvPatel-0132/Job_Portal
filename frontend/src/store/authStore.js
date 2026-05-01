import { create } from "zustand";
import api from "../api/axios";

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null, // 🔥 ADD THIS
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }), // 🔥 ADD THIS

  // =========================
  // LOGIN
  // =========================
  login: (data) => {
    const token = data.accessToken;
    const refreshToken = data.refreshToken;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    set({
      token,
      refreshToken,
      user: data.user || null,
      profile: data.profile || null,
    });
  },

  // =========================
  // FETCH USER + PROFILE
  // =========================
  fetchUser: async () => {
    try {
      const res = await api.get("/auth/me");

      console.log("FETCH USER SUCCESS:", res.data);

      set({
        user: res.data.user || null,
        profile: res.data.profile || null,
      });
    } catch (err) {
      console.log("FETCH USER ERROR:", err);
      set({ user: null, profile: null });
      get().logout(); // 🔥 auto-logout on bad token to prevent infinite 404s
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      await api.post("/auth/logout", { refreshToken });
    } catch (err) {
      console.log("Logout API error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    delete api.defaults.headers.common["Authorization"];

    set({ token: null, refreshToken: null, user: null, profile: null });
  },
}));