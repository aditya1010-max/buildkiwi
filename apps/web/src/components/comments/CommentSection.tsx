import { useCallback, useEffect, useState } from "react";

import {
  createComment,
  deleteComment,
  getComments,
  type Comment,
  type CommentPagination,
} from "../../api/comment.api";

import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { useToast } from "../../hooks/useToast";

interface CommentsSectionProps {
  projectId: string;
  projectOwnerId: string;
  currentUserId?: string;
}

export default function CommentsSection({
  projectId,
  projectOwnerId,
  currentUserId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState<CommentPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const loadComments = useCallback(
    async (page: number) => {
      const response = await getComments(projectId, page, 10);

      if (page === 1) {
        setComments(response.data);
      } else {
        setComments((current) => [...current, ...response.data]);
      }

      setPagination(response.pagination);
    },
    [projectId],
  );

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        await loadComments(1);
      } catch {
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [loadComments]);

  const handleCreate = async (content: string) => {
    try {
      setError(null);

      const response = await createComment(projectId, content);

      setComments((current) => [response.data, ...current]);

      setPagination((current) =>
        current
          ? {
              ...current,
              total: current.total + 1,
            }
          : current,
      );
    } catch {
      setError("Failed to post comment.");
      throw new Error("Failed to post comment.");
    }
  };

  const handleLoadMore = async () => {
    if (!pagination?.hasMore || loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadComments(pagination.page + 1);
    } catch {
      setError("Failed to load more comments.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      setError(null);

      await deleteComment(commentId);

      setComments((current) =>
        current.filter((comment) => comment._id !== commentId),
      );

      setPagination((current) =>
        current
          ? {
              ...current,
              total: Math.max(0, current.total - 1),
            }
          : current,
      );
    } catch {
      setError("Failed to delete comment.");
    }
  };

  return (
    <section className="comments-section">
      <div className="comments-section_header">
        <h2>Comments ({pagination && <>{pagination.total}</>})</h2>
      </div>

      <CommentInput
        onSubmit={handleCreate}
        isAuthenticated={!!currentUserId}
        onUnauthenticated={() => {
          toast.error("Please log in to comment.", "error");
        }}
      />
      {error && <p className="comments-section_error">{error}</p>}

      {loading ? (
        <p className="comments-section_loading">Loading comments...</p>
      ) : (
        <>
          <CommentList
            comments={comments}
            currentUserId={currentUserId}
            projectOwnerId={projectOwnerId}
            onDelete={handleDelete}
          />

          {pagination?.hasMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
