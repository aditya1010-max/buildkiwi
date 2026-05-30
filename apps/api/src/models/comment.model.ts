import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ projectId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ createdAt: -1 });

export const Comment = mongoose.model("Comment", commentSchema);
