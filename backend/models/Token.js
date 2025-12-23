import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            index: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String, 
            enum: ["access", "refresh"],
            required: true
        },
        expiredAt: {
            type: Date,
            required: true
        },
        blacklisted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("Token", tokenSchema);
