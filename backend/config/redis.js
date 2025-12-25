import { createClient } from "redis";

let redisClient = null;

export async function initRedisClient(redisUrl) {
    if (!redisUrl) {
        throw new Error("REDIS_URL is not defined");
    }

    if (redisClient) return redisClient;

    redisClient = createClient({ url: redisUrl });

    redisClient.on("error", (err) => {
        console.error("Redis error:", err);
    });

    await redisClient.connect();
    console.log("Redis connected");

    return redisClient;
}

export function getRedisClient() {
    if (!redisClient) {
        throw new Error("Redis client not initialized");
    }
    return redisClient;
}