import type { ReactElement, MouseEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProjectCard.css";

import type { Project } from "../../../types/project";
import { useBookmarkContext } from "../../../context/BookmarkContext";
import { useLikeContext } from "../../../context/LikeContext";
import { getAccessToken } from "../../../utils/token";
import {
  CommentIcon,
  HeartIcon,
  BookmarkIcon,
  ViewIcon,
} from "../../../assets/icons/ProjectCardIcons";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps): ReactElement {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();
  const { isLiked, toggleLike } = useLikeContext();

  const [displayLikes, setDisplayLikes] = useState(project.stats?.likes ?? 0);
  const isGuest = !getAccessToken();

  useEffect(() => {
    setDisplayLikes(project.stats?.likes ?? 0);
  }, [project.stats?.likes]);

  const saved = isBookmarked(project._id);
  const liked = isLiked(project._id);

  async function handleBookmark(e: SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isGuest) return;
    await toggleBookmark(project._id);
  }

  async function handleLike(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (isGuest) return;

    if (liked) {
      setDisplayLikes((prev) => Math.max(0, prev - 1));
    } else {
      setDisplayLikes((prev) => prev + 1);
    }

    await toggleLike(project._id);
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
          type="button"
          className="project-card_action"
          onClick={handleLike}
          disabled={isGuest}
          title={isGuest ? "Sign in to like projects" : ""}
          aria-label={liked ? "Unlike project" : "Like project"}
        >
          {liked ? (
            <HeartIcon size={24} className="project-card_like-icon" />
          ) : (
            <HeartIcon size={24} className="project-card_unlike-icon" />
          )}{" "}
          {displayLikes}
        </button>

        <span>
          <CommentIcon size={28} /> {project.stats?.comments ?? 0}
        </span>

        <span>
          <ViewIcon size={24} /> {project.stats?.views ?? 0}
        </span>

        <button
          type="button"
          className={`project-card_action project-card_bookmark ${
            isGuest ? "disabled" : ""
          }`}
          onClick={handleBookmark}
          disabled={isGuest}
          title={isGuest ? "Sign in to save projects" : ""}
          aria-label={saved ? "Remove from saved" : "Save project"}
        >
          <BookmarkIcon size={24} />
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
