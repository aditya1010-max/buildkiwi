import type { Achievement, Project } from "@buildkiwi/validation";

export type { Project } from "@buildkiwi/validation";

export interface CreateProjectResponse {
  success: boolean;
  data: Project;
  achievement: Achievement | null;
}
