import { Schema, model, InferSchemaType } from "mongoose";

const likeSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate likes
likeSchema.index(
  {
    userId: 1,
    projectId: 1,
  },
  {
    unique: true,
  },
);

// Fetch a user's likes efficiently
likeSchema.index({
  userId: 1,
  createdAt: -1,
});

export type Like = InferSchemaType<typeof likeSchema>;

export default model("Like", likeSchema);
