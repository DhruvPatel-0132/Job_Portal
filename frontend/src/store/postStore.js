import { create } from "zustand";
import api from "../api/axios";
import { queryClient } from "../api/queryClient";

const usePostStore = create((set, get) => ({
  posts: [],
  userPosts: [],
  savedPosts: [],
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

  fetchSavedPosts: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/posts/saved");
      set({ savedPosts: response.data.posts, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch saved posts", loading: false });
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
          savedPosts: state.savedPosts.map((post) =>
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
  updatePost: async (postId, postData) => {
    set({ loading: true });
    try {
      const response = await api.put(`/posts/${postId}`, postData);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? response.data.post : post
        ),
        userPosts: state.userPosts.map((post) =>
          post._id === postId ? response.data.post : post
        ),
        savedPosts: state.savedPosts.map((post) =>
          post._id === postId ? response.data.post : post
        ),
        loading: false,
      }));
      return { success: true, post: response.data.post };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update post";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  deletePost: async (postId) => {
    set({ loading: true });
    try {
      await api.delete(`/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
        userPosts: state.userPosts.filter((post) => post._id !== postId),
        savedPosts: state.savedPosts.filter((post) => post._id !== postId),
        loading: false,
      }));

      // Update post count in authStore
      const { useAuthStore } = await import("./authStore");
      const currentProfile = useAuthStore.getState().profile;
      if (currentProfile) {
        useAuthStore.getState().setProfile({
          ...currentProfile,
          postsCount: Math.max(0, (currentProfile.postsCount || 0) - 1)
        });
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete post";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  archivePost: async (postId) => {
    set({ loading: true });
    try {
      const response = await api.patch(`/posts/${postId}/archive`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? { ...post, isArchived: response.data.isArchived } : post
        ),
        userPosts: state.userPosts.map((post) =>
          post._id === postId ? { ...post, isArchived: response.data.isArchived } : post
        ),
        savedPosts: state.savedPosts.map((post) =>
          post._id === postId ? { ...post, isArchived: response.data.isArchived } : post
        ),
        loading: false,
      }));
      return { success: true, isArchived: response.data.isArchived };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to archive post";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  toggleReaction: async (postId, reactionType = "like") => {
    try {
      const response = await api.post(`/posts/${postId}/react`, { reactionType });
      if (response.data.success) {
        // Update Zustand store
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    likesCount: response.data.likesCount,
                    likedBy: response.data.likedBy,
                    userReaction: response.data.userReaction,
                  },
                }
              : post
          ),
          userPosts: state.userPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    likesCount: response.data.likesCount,
                    likedBy: response.data.likedBy,
                    userReaction: response.data.userReaction,
                  },
                }
              : post
          ),
          savedPosts: state.savedPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    likesCount: response.data.likesCount,
                    likedBy: response.data.likedBy,
                    userReaction: response.data.userReaction,
                  },
                }
              : post
          ),
        }));

        // Update React Query cache
        queryClient.setQueryData(["feedPosts"], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      stats: {
                        ...post.stats,
                        likesCount: response.data.likesCount,
                        likedBy: response.data.likedBy,
                        userReaction: response.data.userReaction,
                      },
                    }
                  : post
              ),
            })),
          };
        });
      }
      return response.data;
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
      return { success: false };
    }
  },

  toggleSavePost: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/save`);
      if (response.data.success) {
        // Update post stats in store
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    savesCount: response.data.savesCount,
                    isSaved: response.data.isSaved
                  },
                }
              : post
          ),
          userPosts: state.userPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    savesCount: response.data.savesCount,
                    isSaved: response.data.isSaved
                  },
                }
              : post
          ),
          savedPosts: response.data.isSaved 
            ? state.savedPosts // if saved, ideally we'd fetch or append, but appending requires full post object. Best to just let it be or remove if unsaved.
            : state.savedPosts.filter((post) => post._id !== postId),
        }));
        
        // Update React Query cache
        queryClient.setQueryData(["feedPosts"], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      stats: {
                        ...post.stats,
                        savesCount: response.data.savesCount,
                        isSaved: response.data.isSaved
                      },
                    }
                  : post
              ),
            })),
          };
        });
      }
      return response.data;
    } catch (error) {
      console.error("Failed to toggle save post:", error);
      return { success: false };
    }
  },

  updateReactionLocally: (postId, likesCount, likedBy) => {
    // Update Zustand store
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              stats: {
                ...post.stats,
                likesCount,
                likedBy,
              },
            }
          : post
      ),
      userPosts: state.userPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              stats: {
                ...post.stats,
                likesCount,
                likedBy,
              },
            }
          : post
      ),
      savedPosts: state.savedPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              stats: {
                ...post.stats,
                likesCount,
                likedBy,
              },
            }
          : post
      ),
    }));

    // Update React Query cache
    queryClient.setQueryData(["feedPosts"], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    likesCount,
                    likedBy,
                  },
                }
              : post
          ),
        })),
      };
    });
  },

}));

export default usePostStore;
