import type { ReactElement, ReactNode } from "react";

import type { Project } from "../../../types/project";
import Card from "../../ui/Card";
import GeneratedCover from "../../../components/projects/shared/GeneratedCover/GeneratedCover";

import "./SharedProjectCard.css";

interface SharedProjectCardProps {
  project: Project;
  actions?: ReactNode;
  onView?: () => void;
  showCreator?: boolean;
}

export default function SharedProjectCard({
  project,
  actions,
  onView,
  showCreator = false,
}: SharedProjectCardProps): ReactElement {
  return (
    <Card className="shared-project-card">
      <button
        type="button"
        className="shared-project-card_cover"
        onClick={onView}
        disabled={!onView}
        aria-label={`View ${project.title}`}
      >
        <GeneratedCover
          seed={project.coverSeed ?? project._id}
          className="shared-project-card_generated-cover"
        />
      </button>

      <div className="shared-project-card_content">
        <h2 className="shared-project-card_title">
          {onView ? (
            <button
              type="button"
              className="shared-project-card_title-button"
              onClick={onView}
            >
              {project.title}
            </button>
          ) : (
            project.title
          )}
        </h2>

        <p className="shared-project-card_description">
          {project.description || "No description provided."}
        </p>

        {showCreator && (
          <span className="shared-project-card_creator">
            @{project.creatorId.username}
          </span>
        )}
      </div>

      {actions && (
        <footer className="shared-project-card_actions">{actions}</footer>
      )}
    </Card>
  );
}
