import mongoose from "mongoose";

export const conditionSchema = new mongoose.Schema(
    {
        sensorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true
        },

        field: {
            type: String,
            required: true
        },

        valueType: {
            type: String,
            enum: ["number", "boolean", "string"],
            required: true
        },

        operator: {
            type: String,
            enum: ["gt", "gte", "lt", "lte", "eq", "neq", "contains"],
            required: true
        },

        expectedValue: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    }, 
    { _id: false }
);

