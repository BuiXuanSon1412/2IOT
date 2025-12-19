import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        deviceType: {
            type: String,
            enum: ["sensor", "actuator"],
            required: true
        },

        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline"
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {} 
            /*
            Could be in any format, e.g. for DHT22 sensor:
            {
                "temperature":{
                    "value": 25,
                    "unit": "C"
                },
                "humidity": {
                    "value": 60,
                    "unit": "%"
                }
            }
            */ 
        },

        lastSeenAt: {
            type: Date
        }
    },
    { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);
