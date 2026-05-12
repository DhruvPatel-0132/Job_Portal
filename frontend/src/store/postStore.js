import { create } from "zustand";
import api from "../api/axios";

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/posts");
      set({ posts: response.data.posts, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch posts", loading: false });
    }
  },

  createPost: async (postData) => {
    set({ loading: true });
    try {
      const response = await api.post("/posts", postData);
      
      set((state) => ({
        posts: [response.data.post, ...state.posts],
        loading: false,
      }));

      // Update post count in authStore
      const { useAuthStore } = await import("./authStore");
      const currentProfile = useAuthStore.getState().profile;
      if (currentProfile) {
        useAuthStore.getState().setProfile({
          ...currentProfile,
          postsCount: (currentProfile.postsCount || 0) + 1
        });
      }
      
      return { success: true, post: response.data.post };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create post";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },
}));


export default usePostStore;
