import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

import toast from "react-hot-toast";
import { useSocketStore } from "./useSocketStore";

export const useRequestStore = create((set, get) => ({
  // State
  requests: {
    sent: [],
    received: []
  },
  isLoading: false,
  error: null,
  
  // Actions
  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/requests");
      set({ 
        requests: response.data,
        isLoading: false 
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch requests";
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
      return null;
    }
  },
  
  sendRequest: async (receiverId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/requests", { receiver: receiverId });
      
      // Update the sent requests list
      set(state => ({
        requests: {
          ...state.requests,
          sent: [...state.requests.sent, response.data]
        },
        isLoading: false
      }));
      
      toast.success("Request sent successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send request";
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
      return null;
    }
  },
  
  acceptRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/requests/${requestId}`, { status: "accepted" });
      
      // Update the received requests list
      set(state => {
        const updatedReceived = state.requests.received.map(req => 
          req._id === requestId ? { ...req, status: "accepted" } : req
        );
        
        return {
          requests: {
            ...state.requests,
            received: updatedReceived
          },
          isLoading: false
        };
      });
      
      toast.success("Request accepted");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to accept request";
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
      return null;
    }
  },
  
  declineRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/requests/${requestId}`, { status: "declined" });
      
      // Update the received requests list
      set(state => {
        const updatedReceived = state.requests.received.map(req => 
          req._id === requestId ? { ...req, status: "declined" } : req
        );
        
        return {
          requests: {
            ...state.requests,
            received: updatedReceived
          },
          isLoading: false
        };
      });
      
      toast.success("Request declined");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to decline request";
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
      return null;
    }
  },
  
  cancelRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/requests/${requestId}`);
      
      // Remove the request from the sent list
      set(state => ({
        requests: {
          ...state.requests,
          sent: state.requests.sent.filter(req => req._id !== requestId)
        },
        isLoading: false
      }));
      
      toast.success("Request cancelled");
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to cancel request";
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Socket event handlers
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
  },
  
  // Socket subscription
  subscribeToRequestEvents: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    
    const { 
      handleNewRequest, 
      handleRequestAccepted, 
      handleRequestDeclined,
      handleRequestCancelled
    } = get();
    
    // Remove existing listeners to prevent duplicates
    socket.off("newRequest");
    socket.off("requestAccepted");
    socket.off("requestDeclined");
    socket.off("requestCancelled");
    
    // Add new listeners
    socket.on("newRequest", handleNewRequest);
    socket.on("requestAccepted", handleRequestAccepted);
    socket.on("requestDeclined", handleRequestDeclined);
    socket.on("requestCancelled", handleRequestCancelled);
    
    console.log("Subscribed to request events");
  },
  
  unsubscribeFromRequestEvents: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    
    socket.off("newRequest");
    socket.off("requestAccepted");
    socket.off("requestDeclined");
    socket.off("requestCancelled");
    
    console.log("Unsubscribed from request events");
  }
}));
