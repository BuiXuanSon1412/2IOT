import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        measures: {
            type: [{
                measure: { type: String },
                snapshotValue: { type: Number },
                unit: { type: String }
            }]
        },

        pin: {
            type: String,
            required: true
        },

        area: {
            type: {
                room: { type: String },
                floor: { type: String }
            },
            required: true
        },
    },
    { timestamps: true }
);

export default mongoose.model("Sensor", sensorSchema);