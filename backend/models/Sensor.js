import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },

        homeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Home",
            required: true
        },

        measures: {
            type: [{
                measure: { type: String },
                unit: { type: String }
            }],
            default: [{
                measure: "",
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