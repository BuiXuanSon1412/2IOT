import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS || "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", socket => {
    console.log("Socket connected:", socket.id);

    socket.on("join:home", homeId => {
      socket.join(`home:${homeId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

export function getSocket() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
