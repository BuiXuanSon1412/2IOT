import { Server } from "socket.io";

let io;

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS || "http://localhost:5173",
<<<<<<< HEAD
            credentials: true,
            methods: ["GET", "POST"]
        },
        transports: ["websocket", "polling"], // ADD polling as fallback
        pingTimeout: 60000,
        pingInterval: 25000
    });

    io.on("connection", socket => {
        console.log("✅ Socket connected:", socket.id);

        socket.on("join:home", homeId => {
            socket.join(`home:${homeId}`);
            console.log(`Socket ${socket.id} joined home:${homeId}`);
        });

        socket.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", socket.id, "Reason:", reason);
=======
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
>>>>>>> parent of 96412bd (add: sensor device sim data)
        });
    });

    return io;
}

export function getSocket() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}
