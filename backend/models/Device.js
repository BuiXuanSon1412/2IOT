import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },

        homeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Home",
            required: true
        },

        area: {
            type: {
                room: { type: String },
                floor: { type: String }
            },
            required: true,
            index: true
        },

        permittedUsers: {
            type: [{
                userId: { type: mongoose.Schema.Types.ObjectId },
                permissionLevel: { type: String, enum: ["configurable", "control"] }
            }]
        },

        deviceType: {
            type: String,
            required: true,
        },

        pin: {
            type: String,
            required: true,
            unique: true
        },

        dependOn : { // e.g., measurements like: temperature, humidity
            type: String,
            default: null
        },

        settings: {
            powerLimitWatts: { type: Number },

            schedules: {
                type: [{
                    cronExpression: { type: String }, // * * * * * 0-6
                    action: {
                        type: [{
                            name: { type: String },
                            value: { type: String }
                        }]
                    }
                }]
            },

            autoBehavior: {
                type: [{
                    measure: { type: String },
                    condition: { type: String, enum: ["gt", "ge", "lt", "le", "eq", "neq", "contains"] },
                    value: { type: mongoose.Schema.Types.Mixed },
                    action: {
                        type: [{
                            name: { type: String },
                            value: { type: String }
                        }]
                    }
                }],
                default: []
            }
        },

        status: { 
            type: String,
            enum: ["online", "offline"],
            default: "offline"
        },

        characteristic: {
            type: [{
                name: { type: String }, // speed | light power
                unit: { type: String }, // null  | %
                value: { type: String } // 4     | 80
            }]
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Device", deviceSchema);
