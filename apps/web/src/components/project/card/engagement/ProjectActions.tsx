import type {
  ReactElement,
  MouseEvent,
  SyntheticEvent,
} from "react";

import {
  HeartIcon,
  BookmarkIcon,
} from "../../../../assets/icons/ProjectCardIcons";

interface ProjectActionsProps {
  action: "like" | "bookmark";
  liked?: boolean;
  saved?: boolean;
  isGuest: boolean;
  likes?: number;
  onLike?: (
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  onBookmark?: (
    event: SyntheticEvent,
  ) => void;
}

export default function ProjectActions({
  action,
  liked = false,
  saved = false,
  isGuest,
  likes = 0,
  onLike,
  onBookmark,
}: ProjectActionsProps): ReactElement {
  if (action === "like") {
    return (
      <button
        type="button"
        className="project-card_action"
        onClick={onLike}
        disabled={isGuest}
        title={
          isGuest
            ? "Sign in to like projects"
            : ""
        }
        aria-label={
          liked
            ? "Unlike project"
            : "Like project"
        }
      >
        <HeartIcon
          size={24}
          className={
            liked
              ? "project-card_like-icon"
              : "project-card_unlike-icon"
          }
        />

        {likes}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="project-card_action project-card_bookmark"
      onClick={onBookmark}
      disabled={isGuest}
      title={
        isGuest
          ? "Sign in to save projects"
          : ""
      }
      aria-label={
        saved
          ? "Remove from saved"
          : "Save project"
      }
    >
      <BookmarkIcon size={24} />
    </button>
  );
}