import { create } from "zustand";
import { io } from "socket.io-client";

import { useRequestStore } from "./useRequestStore";

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

    const { socket } = get();
    if (!selectedChat?._id || !socket?.connected) return;

    set({ selectedChat });
    socket.emit("joinChat", selectedChat._id);

    socket.off("newMessage");
    socket.on("newMessage", newMessage => {

      const { selectedChat } = get();
      if (newMessage.chat !== selectedChat._id) return;

      queryClient.setQueryData(
        ['chats', selectedChat._id],
        (prev = []) => [...prev, newMessage]
      );
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

  subscribeToEvents: id => {

    if (!navigator?.onLine && id) {
      set({ hasAuthUser: id });
      return;
    }

    const { socket } = get();

    if (socket?.connected || !id) return;

    set({ hasAuthUser: id });

    const newSocket = io(BASE_URL, {
      query: { userId: id },
      autoConnect: true,
    });

    newSocket.on("connect", () => {

      const {
        handleNewRequest,
        handleRequestAccepted,
        handleRequestDeclined,
        handleRequestCancelled
      } = useRequestStore.getState();

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

      newSocket.off("newRequest");
      newSocket.on("newRequest", handleNewRequest);

      newSocket.off("requestAccepted");
      newSocket.on("requestAccepted", handleRequestAccepted);

      newSocket.off("requestDeclined");
      newSocket.on("requestDeclined", handleRequestDeclined);

      newSocket.off("requestCancelled");
      newSocket.on("requestCancelled", handleRequestCancelled);
    });

    set({ socket: newSocket });
  },

  unsubscribeFromEvents: () => {

    const { socket, hasAuthUser } = get();

    if (!navigator?.onLine) return;
    
    if (!socket?.connected || !hasAuthUser) return;

    socket.emit("updateLastSeen", { userId: hasAuthUser });
    socket.removeAllListeners();
    socket.disconnect();

    set({ socket: null, hasAuthUser: null });
  },
}));