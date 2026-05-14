import { create } from "zustand";
import api from "../api/axios";
import usePostStore from "./postStore";

const useCommentStore = create((set, get) => ({
  commentsByPost: {}, // { postId: { comments: [], page: 1, total: 0, loading: false } }
  
  fetchComments: async (postId, page = 1) => {
    // If it's page 1, set loading state
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: {
          ...(state.commentsByPost[postId] || { comments: [], total: 0 }),
          loading: page === 1,
        }
      }
    }));

    try {
      const response = await api.get(`/comments/${postId}?page=${page}&limit=10`);
      
      set((state) => {
        const existing = state.commentsByPost[postId]?.comments || [];
        const newComments = page === 1 ? response.data.data : [...existing, ...response.data.data];
        
        return {
          commentsByPost: {
            ...state.commentsByPost,
            [postId]: {
              comments: newComments,
              page,
              total: response.data.pagination.total,
              loading: false,
            }
          }
        };
      });
    } catch (error) {
      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: {
            ...state.commentsByPost[postId],
            loading: false,
          }
        }
      }));
    }
  },
  
  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/comments/${postId}`, { content });
      
      if (response.data.success) {
        set((state) => {
          const postComments = state.commentsByPost[postId] || { comments: [], total: 0 };
          return {
            commentsByPost: {
              ...state.commentsByPost,
              [postId]: {
                ...postComments,
                comments: [response.data.data, ...postComments.comments],
                total: postComments.total + 1,
              }
            }
          };
        });
        
        // Also update post count in postStore
        const { posts, userPosts } = usePostStore.getState();
        usePostStore.setState({
          posts: posts.map(p => p._id === postId ? {
            ...p, stats: { ...p.stats, commentsCount: (p.stats?.commentsCount || 0) + 1 }
          } : p),
          userPosts: userPosts.map(p => p._id === postId ? {
            ...p, stats: { ...p.stats, commentsCount: (p.stats?.commentsCount || 0) + 1 }
          } : p),
        });
        
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to add comment" };
    }
  }
}));

export default useCommentStore;
