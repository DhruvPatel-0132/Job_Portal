import { create } from "zustand";
import api from "../api/axios";
import usePostStore from "./postStore";

const useCommentStore = create((set, get) => ({
  commentsByPost: {}, // { postId: { comments: [], page: 1, total: 0, loading: false } }
  repliesByComment: {}, // { commentId: { replies: [], loading: false } }

  fetchComments: async (postId, page = 1) => {
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
      const response = await api.get(`/comments/post/${postId}?page=${page}&limit=10`);

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
          [postId]: { ...state.commentsByPost[postId], loading: false }
        }
      }));
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/comments/post/${postId}`, { content });

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
  },

  deleteComment: async (commentId, postId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);

      if (response.data.success) {
        set((state) => {
          const postComments = state.commentsByPost[postId];
          if (!postComments) return state;
          return {
            commentsByPost: {
              ...state.commentsByPost,
              [postId]: {
                ...postComments,
                comments: postComments.comments.filter(c => c._id !== commentId),
                total: Math.max(0, postComments.total - 1),
              }
            }
          };
        });

        // Also remove any cached replies for this comment
        set((state) => {
          const { [commentId]: _, ...rest } = state.repliesByComment;
          return { repliesByComment: rest };
        });

        // Update post count in postStore
        const { posts, userPosts } = usePostStore.getState();
        usePostStore.setState({
          posts: posts.map(p => p._id === postId ? {
            ...p, stats: { ...p.stats, commentsCount: Math.max(0, (p.stats?.commentsCount || 1) - 1) }
          } : p),
          userPosts: userPosts.map(p => p._id === postId ? {
            ...p, stats: { ...p.stats, commentsCount: Math.max(0, (p.stats?.commentsCount || 1) - 1) }
          } : p),
        });

        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to delete comment" };
    }
  },

  fetchReplies: async (commentId) => {
    set((state) => ({
      repliesByComment: {
        ...state.repliesByComment,
        [commentId]: { ...(state.repliesByComment[commentId] || { replies: [] }), loading: true }
      }
    }));

    try {
      const response = await api.get(`/comments/${commentId}/replies`);
      set((state) => ({
        repliesByComment: {
          ...state.repliesByComment,
          [commentId]: { replies: response.data.data, loading: false }
        }
      }));
    } catch (error) {
      set((state) => ({
        repliesByComment: {
          ...state.repliesByComment,
          [commentId]: { ...state.repliesByComment[commentId], loading: false }
        }
      }));
    }
  },

  addReply: async (postId, commentId, content) => {
    try {
      const response = await api.post(`/comments/post/${postId}/${commentId}/reply`, { content });

      if (response.data.success) {
        set((state) => {
          const commentReplies = state.repliesByComment[commentId] || { replies: [] };
          return {
            repliesByComment: {
              ...state.repliesByComment,
              [commentId]: {
                ...commentReplies,
                replies: [...commentReplies.replies, response.data.data],
              }
            },
            // Update repliesCount in commentsByPost
            commentsByPost: Object.fromEntries(
              Object.entries(state.commentsByPost).map(([pid, data]) => [
                pid,
                {
                  ...data,
                  comments: data.comments.map(c =>
                    c._id === commentId ? { ...c, repliesCount: (c.repliesCount || 0) + 1 } : c
                  )
                }
              ])
            )
          };
        });

        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to add reply" };
    }
  },

  deleteReply: async (replyId, parentCommentId, postId) => {
    try {
      const response = await api.delete(`/comments/${replyId}`);
      if (response.data.success) {
        set((state) => {
          const commentReplies = state.repliesByComment[parentCommentId];
          return {
            repliesByComment: {
              ...state.repliesByComment,
              [parentCommentId]: commentReplies
                ? { ...commentReplies, replies: commentReplies.replies.filter(r => r._id !== replyId) }
                : { replies: [] },
            },
            // Decrement repliesCount on parent comment
            commentsByPost: Object.fromEntries(
              Object.entries(state.commentsByPost).map(([pid, data]) => [
                pid,
                {
                  ...data,
                  comments: data.comments.map(c =>
                    c._id === parentCommentId ? { ...c, repliesCount: Math.max(0, (c.repliesCount || 1) - 1) } : c
                  )
                }
              ])
            )
          };
        });
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to delete reply" };
    }
  },
}));

export default useCommentStore;
