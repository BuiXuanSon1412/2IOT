import mongoose from "mongoose";

export const scheduleSchema = new mongoose.Schema(
    {
        second: {
            type: String,
            default: null
        },
        minute: {
            type: String, 
            default: null
        },
        hour: {
            type: String,
            default: null
        },
        daysOfMonth: {
            type: String, 
            default: null
        },
        month: {
            type: String,
            default: null
        },
        daysOfWeek: {
            type: String, 
            default: null
        }
    },
    { _id: false }
);