import type {
  Comment,
  CommentPagination,
  CreateCommentResponse,
  GetCommentsResponse,
} from "@buildkiwi/validation";

import api from "../services/api";

export type { Comment, CommentPagination };

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
}

export const getComments = async (projectId: string, page = 1, limit = 10) => {
  const response = await api.get<GetCommentsResponse>(
    `/projects/${projectId}/comments`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

export const createComment = async (projectId: string, content: string) => {
  const response = await api.post<CreateCommentResponse>(
    `/projects/${projectId}/comments`,
    { content },
  );

  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await api.delete<DeleteCommentResponse>(
    `/comments/${commentId}`,
  );

  return response.data;
};
