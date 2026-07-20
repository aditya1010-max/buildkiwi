import { Schema, model, InferSchemaType } from "mongoose";

const bookmarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate bookmarks
bookmarkSchema.index(
  {
    userId: 1,
    projectId: 1,
  },
  {
    unique: true,
  },
);

// Fetch a user's bookmarks efficiently
bookmarkSchema.index({
  userId: 1,
  createdAt: -1,
});

export type Bookmark = InferSchemaType<typeof bookmarkSchema>;

export default model("Bookmark", bookmarkSchema);
