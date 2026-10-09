import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import type { Project } from "../../types/project";
import SharedProjectCard from "../projects/shared/SharedProjectCard";
import { useToast } from "../../hooks/useToast";

interface SavedProjectCardProps {
  project: Project;
  isPending: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (project: Project) => void | Promise<void>;
}

export default function SavedProjectCard({
  project,
  isPending,
  isBookmarked,
  onToggleBookmark,
}: SavedProjectCardProps): ReactElement {
  const navigate = useNavigate();
  const toast = useToast();

  async function handleToggleBookmark(): Promise<void> {
    try {
      await onToggleBookmark(project);

      toast.success(
        isBookmarked
          ? "Removed from saved projects."
          : "Added to saved projects.",
        "success",
      );
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  }

  return (
    <SharedProjectCard
      project={project}
      onView={() =>
        navigate(`/${project.creatorId.username}/project/${project._id}`)
      }
      actions={
        <button
          type="button"
          className="saved-project-card_bookmark"
          disabled={isPending}
          onClick={() => void handleToggleBookmark()}
          aria-label={
            isBookmarked
              ? `Remove ${project.title} from saved projects`
              : `Save ${project.title}`
          }
          aria-pressed={isBookmarked}
          title={isBookmarked ? "Remove bookmark" : "Save project"}
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill={isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
          </svg>
        </button>
      }
    />
  );
}
