import mongoose from "mongoose";

export const actionSchema = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true
        },
        command: {
            type: String,
            required: true
        },
        parameters: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    { _id: false }
);