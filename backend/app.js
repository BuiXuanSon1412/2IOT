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

dotenv.config();

const app = express();
const port = process.env.PORT;// || 3000;
const mongoDbUri = process.env.MONGO_URI || "mongodb://localhost:27017/2iot-dev";
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

app.use(cors({ origin: process.env.CORS }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/board", boardRoutes);

async function bootstrap() {
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
  process.on("SIGTERM", async () => {
    try {
        const writeApi = getInfluxWriteApi();
        await writeApi.close();
        console.log("Influx write buffer flushed");
    } catch (e) {
        console.error("Error closing Influx write API", e);
    }
  });

  // MQTT
  initMqttClient(process.env.MQTT_BROKER_URL);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error("Failed to bootstrap application", err);
  process.exit(1);
});