import mongoose from "mongoose";

export async function connectDB() {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/2iot-dev";

    if (!uri) {
        throw new Error("MONGO_URI is not defined");
    }

    try {
        await mongoose.connect(uri, {
            autoIndex: true
        });

        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(10);
    }
}
