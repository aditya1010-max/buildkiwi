import { ProjectView } from "../models/projectView.model";
import { Project } from "../models/project.model";

export function findLatestProjectView(projectId: string, visitorId: string) {
  return ProjectView.findOne({
    projectId,
    visitorId,
  }).sort({
    viewedAt: -1,
  });
}

export function createProjectView(projectId: string, visitorId: string) {
  return ProjectView.create({
    projectId,
    visitorId,
  });
}

export function incrementProjectViews(projectId: string) {
  return Project.findByIdAndUpdate(projectId, {
    $inc: {
      "stats.views": 1,
    },
  });
}
