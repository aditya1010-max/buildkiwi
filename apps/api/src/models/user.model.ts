import type { PatternId } from "@buildkiwi/pattern-engine";
import mongoose from "mongoose";

const avatarPatterns: PatternId[] = [
  "blobs",
  "waves",
  "constellation",
  "halftone",
  "geometric",
];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    avatarSeed: {
      type: String,
      required: true,
      trim: true,
    },

    avatarPattern: {
      type: String,
      enum: avatarPatterns,
      required: true,
      default: "blobs",
    },

    bio: {
      type: String,
      maxlength: 120,
      default: "",
    },

    savedProjects: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export const User = mongoose.model("User", userSchema);

export type UserDocument = mongoose.HydratedDocument<
  mongoose.InferSchemaType<typeof userSchema>
>;
