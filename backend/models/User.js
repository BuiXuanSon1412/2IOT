import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true
        },
        lastLoginAt: {
            type: Date,
            default: null,
        },
        createdAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
