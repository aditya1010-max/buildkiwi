import type { ReactElement, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProjectCard.css";

import type { Project } from "../../../types/project";
import { useBookmarkContext } from "../../../context/BookmarkContext";
import { useLikeContext } from "../../../context/LikeContext";
import { getAccessToken } from "../../../utils/token";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps): ReactElement {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();
  const { isLiked, toggleLike } = useLikeContext();

  const [displayLikes, setDisplayLikes] = useState(project.stats.likes);
  const isGuest = !getAccessToken();

  useEffect(() => {
    setDisplayLikes(project.stats.likes);
  }, [project.stats.likes]);

  const saved = isBookmarked(project._id);

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
        <button
          className="project-card_action"
          onClick={async (e) => {
            e.stopPropagation();

            const liked = isLiked(project._id);

            if (liked) {
              setDisplayLikes((prev) => Math.max(0, prev - 1));
            } else {
              setDisplayLikes((prev) => prev + 1);
            }

            await toggleLike(project._id);
          }}
          disabled={isGuest}
          title={isGuest ? "Sign in to like projects" : ""}
        >
          {isLiked(project._id) ? "❤️" : "🤍"} {displayLikes}
        </button>
        <span>💬 {project.stats?.comments ?? 0}</span>
        <span>👁️ {project.stats?.views ?? 0}</span>

        <button
          type="button"
          className="project-card_action project-card_bookmark"

          onClick={handleBookmark}
          disabled={isGuest}
          title={isGuest ? "Sign in to save projects" : ""}
          aria-label={saved ? "Remove from saved" : "Save project"}
        >
          {saved ? "🔖" : "📑"}
        </button>
      </div>

      {project.tags && project.tags.length > 0 && (
        <div className="project-card_tags">
          {[...new Set(project.tags)].map((tag) => (
            <span key={tag} className="project-card_tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
