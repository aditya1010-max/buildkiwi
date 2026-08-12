import "./EmptyProfile.css";
import { AddFolderIcon } from "../../assets/icons/ProjectCardIcons";

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
      <div className="empty-profile_icon">
        <AddFolderIcon size={64} />
      </div>

      <h2 className="empty-profile_title">No projects yet</h2>

      <p className="empty-profile_description">
        {isCurrentUser
          ? "You haven't published any projects yet. Start building something amazing."
          : "This user hasn't published any projects yet."}
      </p>

      {isCurrentUser && (
        <button className="empty-profile_button" onClick={onCreateProject}>
          Create Project
        </button>
      )}
    </section>
  );
}
