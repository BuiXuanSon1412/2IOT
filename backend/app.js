import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import sensorRoutes from "./routes/sensor.routes.js";
import userRoutes from "./routes/user.routes.js";
import boardRoutes from "./routes/board.routes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import "./config/mqtt.js";
import { initRedisClient } from "./config/redis.js";
import { loadRulesIntoRedis, loadSchedulesIntoRedis, startScheduler } from "./services/rule-engine/redis/redis.service.js";
import { initInfluxClient } from "./config/influxDb.js";
import { initMqttClient } from "./config/mqtt.js";
import { initSocket } from "./config/socket.js";
import http from "http";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGO_URI || "mongodb://localhost:27017/2iot-dev";
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

// FIXED: Better CORS configuration
app.use(cors({
  origin: process.env.CORS || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/board", boardRoutes);

async function bootstrap() {
  console.log(new Date(1766379600000).toLocaleString("vi-VN"));

  await connectDB(mongoDbUri);

  // Redis 
  await initRedisClient(redisUrl);
  await loadRulesIntoRedis();
  await loadSchedulesIntoRedis();
  await startScheduler();

  // InfluxDB
  initInfluxClient({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
    org: process.env.INFLUX_ORG,
    bucket: process.env.INFLUX_BUCKET
  });

  // MQTT
  initMqttClient(process.env.MQTT_BROKER_URL);

  const server = http.createServer(app);

  // Websocket
  initSocket(server);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error("Failed to bootstrap application", err);
  process.exit(1);
});
