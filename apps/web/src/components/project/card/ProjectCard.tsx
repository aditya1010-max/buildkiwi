import type { ReactElement, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import "./ProjectCard.css";

import type { Project } from "../../../types/project";
import { useBookmarkContext } from "../../../context/BookmarkContext";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps): ReactElement {
  const navigate = useNavigate();
  const { isBookmarked, isPending, toggleBookmark } = useBookmarkContext();

  const saved = isBookmarked(project._id);
  const loading = isPending(project._id);

  async function handleBookmark(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    await toggleBookmark(project._id);
  }

  // Handle navigating to the project page when clicking the card body
  const handleCardClick = () => {
    navigate(`/projects/${project._id}`);
  };

  return (
    <article className="project-card" onClick={handleCardClick}>
      <header className="project-card_header">
        <div className="project-card_meta">
          <span className="project-card_creator">
            {project.creatorId?.username ?? "Unknown"}
          </span>

          <span className="project-card_time">
            {project.createdAt
              ? new Date(project.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>
      </header>

      <h2 className="project-card_title">{project.title}</h2>

      <p className="project-card_description">{project.description}</p>

      <div className="project-card_stats">
        <span>❤️ {project.stats?.likes ?? 0}</span>
        <span>💬 {project.stats?.comments ?? 0}</span>
        <span>👁️ {project.stats?.views ?? 0}</span>

        <button
          type="button"
          className="project-card_bookmark"
          onClick={handleBookmark}
          disabled={loading}
          aria-label={saved ? "Remove from saved" : "Save project"}
        >
          {saved ? "🔖" : "📑"}
        </button>
      </div>

      {project.tags && project.tags.length > 0 && (
        <div className="project-card_tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-card_tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
