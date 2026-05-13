import { create } from "zustand";
import api from "../api/axios";

const usePostStore = create((set, get) => ({
  posts: [],
  userPosts: [],
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

  fetchUserPosts: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/posts/me");
      set({ userPosts: response.data.posts, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch user posts", loading: false });
    }
  },

  incrementViews: async (postId) => {
    try {
      const response = await api.patch(`/posts/${postId}/view`);
      if (response.data.success) {
        // Update the view count in the local state for immediate feedback
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId
              ? { ...post, stats: { ...post.stats, viewsCount: response.data.viewsCount } }
              : post
          ),
          userPosts: state.userPosts.map((post) =>
            post._id === postId
              ? { ...post, stats: { ...post.stats, viewsCount: response.data.viewsCount } }
              : post
          ),
        }));
      }
      return { success: true, viewsCount: response.data.viewsCount };
    } catch (error) {
      console.error("Failed to increment views:", error);
      return { success: false };
    }
  },

}));


export default usePostStore;
