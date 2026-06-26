interface ProjectActionsProps {
  onLike?: () => void;
  onComment?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export default function ProjectActions({
  onLike,
  onComment,
  onSave,
  onShare,
}: ProjectActionsProps) {
  return (
    <div className="project-actions">
      <button type="button" className="project-action" onClick={onLike}>
        ❤️ Like
      </button>

      <button type="button" className="project-action" onClick={onComment}>
        💬 Comment
      </button>

      <button type="button" className="project-action" onClick={onSave}>
        🔖 Save
      </button>

      <button type="button" className="project-action" onClick={onShare}>
        📤 Share
      </button>
    </div>
  );
}
