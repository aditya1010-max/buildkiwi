import api from "../services/api";

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
    {
      content,
    },
  );

  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await api.delete<DeleteCommentResponse>(
    `/comments/${commentId}`,
  );

  return response.data;
};
