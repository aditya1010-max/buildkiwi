import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    tags: {
      type: [String],
      default: [],
    },

    links: {
      github: {
        type: String,
        trim: true,
        default: "",
      },

      demo: {
        type: String,
        trim: true,
        default: "",
      },
    },

    coverImage: String,

    stats: {
      likes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({
  title: "text",
  description: "text",
});

projectSchema.index({ creatorId: 1 });

projectSchema.index({ createdAt: -1 });

projectSchema.index({ tags: 1 });

export const Project = mongoose.model("Project", projectSchema);
