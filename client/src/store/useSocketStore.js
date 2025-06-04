import { create } from "zustand";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.MODE !== "production" ? "http://localhost:8080" : "/";

export const useSocketStore = create((set, get) => ({

  socket: null,
  lastSeen: {},
  onlineUsers: [],

  hasAuthUser: null,
  selectedChat: null,
  aiState: {
    messages: [],
    isLoading: false,
  },

  sendMessage: async message => {
    if (!message.trim()) return;

    const { socket, addMessage } = get();

    addMessage({
      text: message,
      isUser: true,
      timestamp: new Date()
    });

    set(state => ({
      aiState: {
        ...state.aiState,
        isLoading: true,
      }
    }));

    socket.emit("ai-message", message);
  },

  addMessage: (message) => {
    set(state => ({
      aiState: {
        ...state.aiState,
        messages: [...state.aiState.messages, message],
      }
    }));
  },

  handleAiResponse: (response) => {
    const { addMessage } = get();

    addMessage({
      text: response.text,
      isUser: false,
      isError: response.error || false,
      timestamp: response.timestamp || new Date()
    });

    set(state => ({
      aiState: {
        ...state.aiState,
        isLoading: false,
      }
    }));
  },

  subscribeToAiEvents: () => {
    const { socket, handleAiResponse } = get();
    if (!socket?.connected) return;

    socket.off("ai-response");
    socket.on("ai-response", handleAiResponse);
  },

  unsubscribeFromAiEvents: () => {
    const { socket } = get();
    if (!socket?.connected) return;

    socket.off("ai-response");

    set(state => ({
      aiState: {
        ...state.aiState,
        isLoading: false,
      }
    }));
  },

  subscribeToChat: (selectedChat, queryClient) => {

    if (!navigator?.onLine) {
      set({ selectedChat });
      return;
    }

    const { socket, hasAuthUser } = get();
    if (!selectedChat?._id || !socket?.connected) return;

    set({ selectedChat });
    socket.emit("joinChat", selectedChat._id);

    socket.off("newMessage");
    socket.on("newMessage", newMessage => {

      const { selectedChat } = get();
      if (newMessage.chat !== selectedChat._id && newMessage.sender !== hasAuthUser) return;

      queryClient.setQueryData(['chats', selectedChat._id], (prev = []) => [...prev, newMessage]);
    });
  },

  unsubscribeFromChat: () => {

    if (!navigator?.onLine) {
      set({ selectedChat: null });
      return;
    }

    get()?.socket.off("newMessage");
    set({ selectedChat: null });
  },

  subscribeToEvents: (id, queryClient) => {

    const { socket } = get();

    if (socket?.connected || !id) return;

    set({ hasAuthUser: id });

    const newSocket = io(BASE_URL, {
      query: { userId: id },
      autoConnect: true,
    });

    newSocket.on("connect", () => {

      newSocket.off("getOnlineUsers");
      newSocket.on("getOnlineUsers", userIds => {
        set({ onlineUsers: userIds });
      });

      newSocket.off("userLastSeen");
      newSocket.on("userLastSeen", ({ userId, timestamp }) => {
        set(({ lastSeen }) => ({
          lastSeen: {
            ...lastSeen,
            [userId]: timestamp
          }
        }));
      });
    });

    newSocket.off("newRequest");
    newSocket.on("newRequest", newReceivedRequest => {
      queryClient.setQueryData(['requests'], (prev = []) => ({ ...prev, received: [...prev.received, newReceivedRequest] }));
      toast.success(`New chat request from ${newReceivedRequest.sender.username}`);
    });

    newSocket.off("requestCancelled");
    newSocket.on("requestCancelled", cancelledRequestId => {
      queryClient.setQueryData(['requests'], (prev = []) => ({ ...prev, received: prev.received.filter(({ _id: receivedRequestId }) => (receivedRequestId !== cancelledRequestId)) }));
    });

    newSocket.off("requestAccepted");
    newSocket.on("requestAccepted", ({ request, chat }) => {
      queryClient.setQueryData(['requests'], (prev = []) => ({ ...prev, sent: prev.sent.map(prevRequest => (prevRequest._id === request._id ? request : prevRequest)) }));
      queryClient.setQueryData(['chats'], (prev = []) => ([...prev, chat]));
      toast.success(`Your request was accepted by ${request.receiver.username}`);
    });

    newSocket.off("requestDeclined");
    newSocket.on("requestDeclined", ({ request }) => {
      queryClient.setQueryData(['requests'], (prev = []) => ({ ...prev, sent: prev.sent.map(prevRequest => (prevRequest._id === request._id ? request : prevRequest)) }))
      toast.error(`Your request was declined by ${request.receiver.username}`);
    });

    set({ socket: newSocket });
  },

  unsubscribeFromEvents: () => {

    const { socket, hasAuthUser } = get();

    if (!socket?.connected || !hasAuthUser) return;

    socket.emit("updateLastSeen", { userId: hasAuthUser });
    socket.removeAllListeners();
    socket.disconnect();

    set({ socket: null, hasAuthUser: null });
  },
}));