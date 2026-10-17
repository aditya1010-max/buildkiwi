import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description too short"),
  tags: z.array(z.string()).default([]),
  coverSeed: z.string().min(1, "Cover seed is required"),

  links: z
    .object({
      github: z.string().url().optional().or(z.literal("")),
      demo: z.string().url().optional().or(z.literal("")),
    })
    .default({}),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

import type { PatternId } from "@buildkiwi/pattern-engine";

export interface Project {
  _id: string;
  creatorId: {
    _id: string;
    username: string;
    avatarSeed: string;
    avatarPattern: PatternId;
  };
  title: string;
  description: string;
  tags: string[];
  coverSeed: string;
  links: {
    github: string;
    demo: string;
  };
  isSaved?: boolean;
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  pagination: ProjectPagination;
}

export interface SingleProjectResponse {
  success: boolean;
  data: Project;
}
