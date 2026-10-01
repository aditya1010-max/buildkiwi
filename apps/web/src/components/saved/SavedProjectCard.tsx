import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { Project } from "../../types/project";
import GeneratedCover from "../projects/shared/GeneratedCover/GeneratedCover";
import Card from "../ui/Card";

import "./SavedProjectCard.css";

interface SavedProjectCardProps {
  project: Project;
}

export default function SavedProjectCard({
  project,
}: SavedProjectCardProps): ReactElement {
  return (
    <Link
      to={`/${project.creatorId.username}/project/${project._id}`}
      className="saved-project-card_link"
    >
      {" "}
      <Card className="saved-project-card">
        <div className="saved-project-card_cover">
          <GeneratedCover
            seed={project.coverSeed ?? project._id}
            className="saved-project-card_generated-cover"
          />
        </div>

        <div className="saved-project-card_content">
          <h3 className="saved-project-card_title">{project.title}</h3>

          <p className="saved-project-card_description">
            {project.description || "No description provided."}
          </p>

          <span className="saved-project-card_creator">
            @{project.creatorId.username}
          </span>
        </div>
      </Card>
    </Link>
  );
}
