import type { Achievement } from "./achievement";

export interface Project {
  _id: string;

  creatorId: {
    _id: string;
    username: string;
  };

  title: string;
  description: string;

  tags: string[];

  coverImage: string;

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

export interface CreateProjectResponse {
  success: boolean;
  data: Project;
  achievement: Achievement | null;
}
