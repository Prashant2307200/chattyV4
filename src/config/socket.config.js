import express from "express";
import { Server } from "socket.io";

import { createServer } from "http";
import { AppConfig } from "./app.config.js";
import { processAIChat } from "../ai/processor.js"; 

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [AppConfig.env.NODE_ENV !== "production" ? "http://localhost:5173":'/']
  }
});

const userSocketMap = {};
const userLastSeen = {};

export function getUserSocketId(userId) {
  return userSocketMap[userId];
}

export function getUserLastSeen(userId) {
  return userLastSeen[userId] || null;
}

io.on("connection", socket => {

  const { userId } = socket.handshake.query;
  if (!userId) return;

  userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinChat", chatId => {
    const currentRooms = Array.from(socket.rooms).filter(room => room !== socket.id);
    currentRooms.forEach(room => socket.leave(room));

    socket.join(chatId); 
  });

  socket.on("typing", ({ chatId }) => {
    socket.to(chatId).emit("userTyping", { userId, chatId }); 
  });
 
  socket.on("stopTyping", ({ chatId }) => {
    socket.to(chatId).emit("userStoppedTyping", { userId, chatId }); 
  });

  socket.on("ai-message", async (message) => {
    const response = await processAIChat(message, userId);

    socket.emit("ai-response", {
      text: response,
      timestamp: new Date()
    }); 
  });

  socket.on("disconnect", () => {
    
    userLastSeen[userId] = new Date();
    io.emit("userLastSeen", { userId, timestamp: userLastSeen[userId] });

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };