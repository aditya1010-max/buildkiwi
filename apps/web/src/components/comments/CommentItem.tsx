import type { Comment } from "../../api/comment.api";

interface CommentItemProps {
  comment: Comment;
  canDelete: boolean;
  onDelete: (commentId: string) => Promise<void>;
}

export default function CommentItem({
  comment,
  canDelete,
  onDelete,
}: CommentItemProps) {
  return (
    <article className="comment-item">
      <div className="comment-item_header">
        <strong>{comment.userId.username}</strong>

        {canDelete && (
          <button type="button" onClick={() => onDelete(comment._id)}>
            Delete
          </button>
        )}
      </div>

      <p className="comment-item_content">{comment.content}</p>

      <time dateTime={comment.createdAt}>
        {new Date(comment.createdAt).toLocaleDateString()}
      </time>
    </article>
  );
}
