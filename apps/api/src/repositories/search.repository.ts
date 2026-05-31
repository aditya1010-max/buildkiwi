import { Project } from "../models/project.models";

export const searchProjectsRepository = async (
  query: string,
  page: number,
  limit: number,
) => {
  return await Project.find({
    $text: {
      $search: query,
    },
  })
    .populate("creatorId", "username")
    .skip((page - 1) * limit)
    .limit(limit);
};
