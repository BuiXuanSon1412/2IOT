import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "My Home"
        },
        owners: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }],
            required: true
        },
        joinCode: {
            type: String,
            default: `JOINCODE-${Date.now()}`,
            unique: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Home", homeSchema);
