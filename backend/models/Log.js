import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'sourceType'
    },
    sourceType: {
      type: String,
      required: true,
      enum: ['Device', 'Sensor']
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    state: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    trigger: {
      type: String,
      enum: ['polling', 'manual', 'automation', 'schedule'],
      default: 'polling'
    }
  },
  {
    timestamps: false,
    collection: 'logs'
  }
);

// Compound index for efficient querying
logSchema.index({ sourceId: 1, timestamp: -1 });
logSchema.index({ sourceType: 1, timestamp: -1 });

export default mongoose.model("Log", logSchema);
