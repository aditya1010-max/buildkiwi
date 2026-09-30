import type { Comment } from "../../api/comment.api";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  projectOwnerId: string;
  onDelete: (commentId: string) => Promise<void>;
}

export default function CommentList({
  comments,
  currentUserId,
  projectOwnerId,
  onDelete,
}: CommentListProps) {
  if (!comments.length) {
    return (
      <div className="comment-list_empty">
        No comments yet. Be the first to comment.
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => {
        const canDelete =
          comment.userId._id === currentUserId ||
          projectOwnerId === currentUserId;

        return (
          <CommentItem
            key={comment._id}
            comment={comment}
            canDelete={canDelete}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
