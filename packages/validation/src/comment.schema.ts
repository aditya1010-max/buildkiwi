import { z } from "zod";

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long"),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

export interface CommentUser {
  _id: string;
  username: string;
  avatarSeed?: string;
  avatarPattern?: string;
}

export interface Comment {
  _id: string;
  projectId: string;
  userId: CommentUser;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface GetCommentsResponse {
  success: boolean;
  data: Comment[];
  pagination: CommentPagination;
}

export interface CreateCommentResponse {
  success: boolean;
  data: Comment;
}
