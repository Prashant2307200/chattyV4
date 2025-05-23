import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

import toast from "react-hot-toast";

export const useRequestStore = create((set) => ({

  requests: { sent: [], received: [] },
  isLoading: false,

  fetchRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/requests");
      set({ requests: response.data });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      set({ isLoading: false });
    }
  },

  sendRequest: async (receiverId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/requests", { receiver: receiverId });

      set(state => ({
        requests: {
          ...state.requests,
          sent: [...state.requests.sent, response.data]
        }
      }));

      toast.success("Request sent successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  acceptRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/requests/${requestId}`, { status: "accepted" });

      set(({ requests }) => {

        const updatedReceived = requests.received.map(req =>
          req._id === requestId ? { ...req, status: "accepted" } : req
        );

        return {
          requests: {
            ...requests,
            received: updatedReceived
          }
        };
      });

      toast.success("Request accepted");
      return response.data;
    } catch (error) { 
      toast.error(error.response?.data?.message || "Failed to accept request");
    } finally {
      set({ isLoading: false });
    }
  },

  declineRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/requests/${requestId}`, { status: "declined" });

      set(({ requests }) => {

        const updatedReceived = requests.received.map(req =>
          req._id === requestId ? { ...req, status: "declined" } : req
        );

        return {
          requests: {
            ...requests,
            received: updatedReceived
          }
        };
      });

      toast.success("Request declined");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to decline request");
    } finally {
      set({ isLoading: false });
    }
  },

  cancelRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/requests/${requestId}`);

      set(state => ({
        requests: {
          ...state.requests,
          sent: state.requests.sent.filter(req => req._id !== requestId)
        }
      }));

      toast.success("Request cancelled");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel request");
    } finally {
      set({ isLoading: false });
    }
  },

  handleNewRequest: (request) => {
    set(state => ({
      requests: {
        ...state.requests,
        received: [...state.requests.received, request]
      }
    }));

    toast.success(`New chat request from ${request.sender.username}`);
  },

  handleRequestAccepted: (data) => {
    set(state => {
      const updatedSent = state.requests.sent.map(req =>
        req._id === data.request._id ? data.request : req
      );

      return {
        requests: {
          ...state.requests,
          sent: updatedSent
        }
      };
    });

    toast.success("Your request was accepted");
  },

  handleRequestDeclined: (request) => {
    set(state => {
      const updatedSent = state.requests.sent.map(req =>
        req._id === request._id ? request : req
      );

      return {
        requests: {
          ...state.requests,
          sent: updatedSent
        }
      };
    });

    toast.error("Your request was declined");
  },

  handleRequestCancelled: (requestId) => {
    set(state => ({
      requests: {
        ...state.requests,
        received: state.requests.received.filter(req => req._id !== requestId)
      }
    }));
  }
}));
