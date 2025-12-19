import { actionSchema } from "../automation-rules/Action.js";
import { conditionSchema } from "../automation-rules/Condition.js";
import { scheduleSchema } from "../automation-rules/Schedule.js";
import mongoose from "mongoose";

const automationRuleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        enabled: {
            type: Boolean,
            default: true
        },

        ruleType: {
            type: String,
            enum: ["time_based", "condition_based"],
            required: true
        },

        schedule: {
            type: scheduleSchema,
            required: function () {
                return this.ruleType === "time_based";
            }
        },

        condition: {
            type: conditionSchema,
            required: function () {
                return this.ruleType === "condition_based";
            }
        },

        actions: {
            type: [actionSchema],
            required: true
        },

        lastExecutedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("AutomationRule", automationRuleSchema);