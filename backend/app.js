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

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGO_URI || "mongodb://localhost:27017/2iot-dev";

app.use(cors({ origin: process.env.CORS }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/board", boardRoutes);

async function bootstrap() {
  await connectDB(mongoDbUri);

  // TODO: add MQTT connection establishment 

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error("Failed to bootstrap application", err);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});