import { create } from "zustand";
import api from "../api/axios";

export const useNetworkStore = create((set, get) => ({
  networkUsers: [],
  requests: { incoming: [], outgoing: [] },
  connections: [],
  followedCompanies: [],
  isLoading: false,
  error: null,

  fetchNetworkingData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [reqRes, connRes, compRes, usersRes] = await Promise.all([
        api.get("/requests/pending"),
        api.get("/connections"),
        api.get("/companies/followed"),
        api.get("/auth/users"),
      ]);

      set({
        requests: reqRes.data.success
          ? { incoming: reqRes.data.incoming, outgoing: reqRes.data.outgoing }
          : { incoming: [], outgoing: [] },
        connections: connRes.data.success ? connRes.data.connections : [],
        followedCompanies: compRes.data.success ? compRes.data.companies : [],
        networkUsers: usersRes.data.success ? usersRes.data.users : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("fetchNetworkingData error:", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  sendConnectionRequest: async (userId) => {
    try {
      const res = await api.post("/requests/send", { recipientId: userId });
      if (res.data.success) {
        set((state) => ({
          requests: {
            ...state.requests,
            outgoing: [...state.requests.outgoing, res.data.request],
          },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  acceptRequest: async (requestId) => {
    try {
      const res = await api.post(`/requests/accept/${requestId}`);
      if (res.data.success) {
        set((state) => ({
          requests: {
            ...state.requests,
            incoming: state.requests.incoming.filter((r) => r._id !== requestId),
          },
        }));
        // Refresh to get the new connection in the list
        await get().fetchNetworkingData();
      }
    } catch (err) {
      console.error(err);
    }
  },

  rejectRequest: async (requestId) => {
    try {
      const res = await api.post(`/requests/reject/${requestId}`);
      if (res.data.success) {
        set((state) => ({
          requests: {
            ...state.requests,
            incoming: state.requests.incoming.filter((r) => r._id !== requestId),
          },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  followCompany: async (companyId) => {
    if (!companyId) return;
    try {
      const res = await api.post("/companies/follow", { companyId });
      if (res.data.success) {
        set((state) => ({
          followedCompanies: [...state.followedCompanies, { _id: companyId }],
        }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  unfollowCompany: async (companyId) => {
    if (!companyId) return;
    try {
      const res = await api.delete(`/companies/unfollow/${companyId}`);
      if (res.data.success) {
        set((state) => ({
          followedCompanies: state.followedCompanies.filter((c) => c._id !== companyId),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  },
}));
