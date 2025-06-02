import { create } from "zustand";
import toast from "react-hot-toast";

export const useRequestStore = create((set) => ({

  requests: [],
  isLoading: false,

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
