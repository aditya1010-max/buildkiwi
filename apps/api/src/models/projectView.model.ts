import { Schema, model, Types } from "mongoose";

export interface ProjectViewDocument {
  projectId: Types.ObjectId;
  visitorId: string;
  viewedAt: Date;
}

const projectViewSchema = new Schema<ProjectViewDocument>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    visitorId: {
      type: String,
      required: true,
    },

    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

/**
 * One visitor can have many views,
 * but we frequently query by project + visitor.
 */
projectViewSchema.index({
  projectId: 1,
  visitorId: 1,
});

/**
 * Helps us quickly find the latest view.
 */
projectViewSchema.index({
  projectId: 1,
  visitorId: 1,
  viewedAt: -1,
});

export const ProjectView = model<ProjectViewDocument>(
  "ProjectView",
  projectViewSchema,
);
