import { Schema, model } from "mongoose";

const feedbackSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["bug", "feature", "general"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    page: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

feedbackSchema.index({ category: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ createdAt: -1 });

export default model("Feedback", feedbackSchema);
