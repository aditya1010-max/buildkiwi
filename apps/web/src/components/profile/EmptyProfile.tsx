import "./EmptyProfile.css";

interface EmptyProfileProps {
  isCurrentUser?: boolean;
  onCreateProject?: () => void;
}

export default function EmptyProfile({
  isCurrentUser = false,
  onCreateProject,
}: EmptyProfileProps) {
  return (
    <section className="empty-profile">
      <div className="empty-profile__icon">📂</div>

      <h2 className="empty-profile__title">No projects yet</h2>

      <p className="empty-profile__description">
        {isCurrentUser
          ? "You haven't published any projects yet. Start building something amazing."
          : "This user hasn't published any projects yet."}
      </p>

      {isCurrentUser && (
        <button className="empty-profile__button" onClick={onCreateProject}>
          Create Project
        </button>
      )}
    </section>
  );
}
