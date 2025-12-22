import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },

        measures: {
            type: [{
                measure: { type: String },
                snapshotValue: { type: Number },
                unit: { type: String }
            }],
            default: [{
                measure: "",
                snapshotValue: null,
                unit: ""
            }],
            required: true
        },

        pin: {
            type: String,
            required: true,
            unique: true
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