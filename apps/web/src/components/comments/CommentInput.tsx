import type { FormEvent } from "react";
import { useState } from "react";

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
  isAuthenticated: boolean;
  onUnauthenticated: () => void;
}

const MAX_LENGTH = 500;

export default function CommentInput({
  onSubmit,
  disabled = false,
  isAuthenticated,
  onUnauthenticated,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const value = content.trim();

    if (!value || submitting || disabled) {
      return;
    }

    if (!isAuthenticated) {
      onUnauthenticated();
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit(value);

      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="comment-input" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={MAX_LENGTH}
        placeholder="Write a comment..."
        disabled={disabled || submitting}
        rows={3}
      />

      <div className="comment-input_footer">
        <span>
          {content.length}/{MAX_LENGTH}
        </span>

        <button
          type="submit"
          disabled={!content.trim() || submitting || disabled}
        >
          {submitting ? "Posting..." : "Comment"}
        </button>
      </div>
    </form>
  );
}
