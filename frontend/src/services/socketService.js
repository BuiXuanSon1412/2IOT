import { io } from "socket.io-client";
import authService from "./authService";
import { create } from "zustand";

let socket = null;

export function initSocket() {
    if (socket) return socket;

    socket = io(import.meta.env.VITE_WS_URL || "http://localhost:3000", {
        transports: ["websocket"],
        autoConnect: false,
        auth: {
            token: authService.getAccessToken()
        }
    });

    return socket;
}

export function getSocket() {
    return socket;
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
    const updateSensor = useSensorStore.getState().updateSensor;

    socket.connect();

    socket.on("sensor:update", (payload) => {
        // console.log("Received payload", payload);
        updateSensor(payload);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket error:", err.message);
    });

    return socket;
}