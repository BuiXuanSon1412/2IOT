import { io } from "socket.io-client";
import authService from "./authService";
import { create } from "zustand";

let socket = null;
let isConnecting = false;

export function initSocket() {
  if (socket) {
    console.log('Socket already exists, reusing...');
    return socket;
  }

  if (isConnecting) {
    console.log('Socket connection in progress...');
    return null;
  }

  isConnecting = true;

  const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:3000";
  console.log('Initializing socket with URL:', wsUrl);

  socket = io(wsUrl, {
    transports: ["websocket", "polling"], // Allow fallback to polling
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 10000,
    auth: {
      token: authService.getAccessToken()
    }
  });

  // Add connection event handlers
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    isConnecting = false;
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
    isConnecting = false;
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
    isConnecting = false;
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    console.log('Disconnecting socket...');
    socket.disconnect();
    socket = null;
    isConnecting = false;
  }
}

export const useSensorStore = create((set) => ({
  sensors: {},

  updateSensor(payload) {
    const { homeId, name, measure, value, timestamp } = payload;

    set((state) => ({
      sensors: {
        ...state.sensors,
        [name]: {
          ...(state.sensors[name] || {}),
          [measure]: value,
          lastUpdated: timestamp
        }
      }
    }));
  }
}));

export function bootstrapSocket() {
  const socket = initSocket();

  if (!socket) {
    console.warn('Socket initialization failed');
    return null;
  }

  const updateSensor = useSensorStore.getState().updateSensor;

  // Only add listeners once
  if (!socket.hasListeners('sensor:update')) {
    socket.on("sensor:update", (payload) => {
      console.log("📡 Received sensor update:", payload);
      updateSensor(payload);
    });
  }

  // Connect the socket
  if (!socket.connected) {
    console.log('Connecting socket...');
    socket.connect();
  }

  return socket;
}
