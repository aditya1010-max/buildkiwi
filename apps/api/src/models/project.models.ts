import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ createdAt: -1 });
projectSchema.index({ type: 1 });
projectSchema.index({ "data.tags": 1 });

export const Project = mongoose.model("Project", projectSchema);
