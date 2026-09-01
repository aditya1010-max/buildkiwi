import type {
  ReactElement,
  MouseEvent,
  SyntheticEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./ProjectCard.css";

import { useToast } from "../../../hooks/useToast";
import type { Project } from "../../../types/project";
import { useBookmarkContext } from "../../../context/useBookmarkContext";
import { useLikeContext } from "../../../context/useLikeContext";
import { getAccessToken } from "../../../utils/token";

import ProjectHeader from "./header/ProjectHeader";
import ProjectContent from "./content/ProjectContent";
import ProjectEngagement from "./engagement/ProjectEngagement";
import ProjectTags from "./tags/ProjectTags";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps): ReactElement {
  const toast = useToast();
  const navigate = useNavigate();

  const { isBookmarked, toggleBookmark } =
    useBookmarkContext();

  const { isLiked, toggleLike } =
    useLikeContext();

  const [displayLikes, setDisplayLikes] = useState(
    project.stats?.likes ?? 0,
  );

  const isGuest = !getAccessToken();

  const saved = isBookmarked(project._id);
  const liked = isLiked(project._id);

  async function handleBookmark(e: SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isGuest) {
      toast.error("Please sign in to save projects");
      return;
    }

    const wasSaved = saved;

    try {
      await toggleBookmark(project._id);

      if (wasSaved) {
        toast.info("Project removed from bookmarks");
      } else {
        toast.success("Project saved to bookmarks");
      }
    } catch {
      toast.error("Failed to update bookmark status");
    }
  }

  async function handleLike(
    e: MouseEvent<HTMLButtonElement>,
  ) {
    e.stopPropagation();

    if (isGuest) return;

    if (liked) {
      setDisplayLikes((prev) => Math.max(0, prev - 1));
    } else {
      setDisplayLikes((prev) => prev + 1);
    }

    await toggleLike(project._id);
  }

  function handleCardClick() {
    navigate(`/projects/${project._id}`);
  }

  return (
    <article
      className="project-card"
      onClick={handleCardClick}
    >
      <ProjectHeader project={project} />

      <ProjectContent project={project} />

      <ProjectTags project={project} />

      <ProjectEngagement
        likes={displayLikes}
        comments={project.stats?.comments ?? 0}
        views={project.stats?.views ?? 0}
        liked={liked}
        saved={saved}
        isGuest={isGuest}
        onLike={handleLike}
        onBookmark={handleBookmark}
      />
    </article>
  );
}