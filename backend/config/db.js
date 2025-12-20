import mongoose from "mongoose";

export async function connectDB(db_uri) {
    const uri = db_uri;

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
