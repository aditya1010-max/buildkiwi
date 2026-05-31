import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate likes
likeSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
