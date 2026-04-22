import { create } from "zustand";
import api from "../api/axios";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  setUser: (user) => set({ user }),

  login: (data) => {
    console.log("AUTH DATA:", data);

    const token = data.token || data.accessToken || data.jwt;

    if (!token) {
      console.error("❌ Token missing from backend response");
      return;
    }

    localStorage.setItem("token", token);

    set({
      token,
      user: data.user || data.userData || null,
    });
  },
  fetchUser: async () => {
    try {
      const res = await api.get("/auth/me");

      console.log("FETCH USER SUCCESS:", res.data);

      set({ user: res.data }); // 🔥 IMPORTANT
    } catch (err) {
      console.log("FETCH USER ERROR:", err);
      set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));
