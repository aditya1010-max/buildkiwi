import { useState, type ReactElement, type MouseEvent } from "react";
import { Link } from "react-router-dom";

import "./ProjectCard.css";

import type { Project } from "../../../types/project";
import { addBookmark, removeBookmark } from "../../../api/bookmark.api";
interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps): ReactElement {
  const [saved, setSaved] = useState(project.isSaved ?? false);
  const [loading, setLoading] = useState(false);

  async function handleBookmark(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      if (saved) {
        await removeBookmark(project._id);
        setSaved(false);
      } else {
        await addBookmark(project._id);
        setSaved(true);
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link to={`/projects/${project._id}`}>
      <article className="project-card">
        <header className="project-card_header">
          <div className="project-card_meta">
            <span className="project-card_creator">
              {project.creatorId.username}
            </span>

            <span className="project-card_time">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </header>

        <h2 className="project-card_title">{project.title}</h2>

        <p className="project-card_description">{project.description}</p>

        <div className="project-card_stats">
          <span>❤️ {project.stats.likes}</span>
          <span>💬 {project.stats.comments}</span>
          <span>👁️ {project.stats.views}</span>

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

        {project.tags?.length > 0 && (
          <div className="project-card_tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-card_tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
