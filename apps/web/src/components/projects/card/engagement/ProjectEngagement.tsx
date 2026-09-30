import type { ReactElement, MouseEvent, SyntheticEvent } from "react";

import ProjectActions from "./ProjectActions";

import {
  CommentIcon,
  ViewIcon,
} from "../../../../assets/icons/ProjectCardIcons";

import "./ProjectEngagement.css";

interface ProjectEngagementProps {
  likes: number;
  comments: number;
  views: number;
  liked: boolean;
  saved: boolean;
  isGuest: boolean;
  onLike: (event: MouseEvent<HTMLButtonElement>) => void;
  onBookmark: (event: SyntheticEvent) => void;
  onComments: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function ProjectEngagement({
  likes,
  comments,
  views,
  liked,
  saved,
  isGuest,
  onLike,
  onBookmark,
  onComments,
}: ProjectEngagementProps): ReactElement {
  return (
    <div className="project-card_engagement">
      <div className="project-card_actions">
        <ProjectActions
          action="like"
          likes={likes}
          liked={liked}
          isGuest={isGuest}
          onLike={onLike}
        />

        <button
          type="button"
          className="project-card_metric"
          onClick={onComments}
        >
          <CommentIcon size={24} />
          {comments}
        </button>

        <span className="project-card_metric">
          <ViewIcon size={24} />
          {views}
        </span>

        <ProjectActions
          action="bookmark"
          saved={saved}
          isGuest={isGuest}
          onBookmark={onBookmark}
        />
      </div>
    </div>
  );
}
