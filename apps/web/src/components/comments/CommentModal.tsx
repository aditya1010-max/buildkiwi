import { useState } from "react";

import { createComment } from "../../api/comment.api";

import CommentInput from "./CommentInput";

import "./comments.css";

interface CommentModalProps {
  projectId: string;
  currentUserId?: string;
  onClose: () => void;
}

export default function CommentModal({
  projectId,
  currentUserId,
  onClose,
}: CommentModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (content: string) => {
    try {
      setError(null);

      await createComment(projectId, content);

      onClose();
    } catch {
      setError("Failed to post comment.");
      throw new Error("Failed to post comment.");
    }
  };

  return (
    <div
      className="comment-modal_backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="comment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comment-modal-title"
      >
        <div className="comment-modal_content">
          {error && <p className="comments-section_error">{error}</p>}

          {currentUserId ? (
            <CommentInput onSubmit={handleSubmit} />
          ) : (
            <p className="comment-modal_guest">Sign in to leave a comment.</p>
          )}
        </div>
      </section>
    </div>
  );
}
