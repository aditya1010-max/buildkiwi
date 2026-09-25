import type { ReactElement } from "react";

import "./ProjectHero.css";

import GeneratedCover from "../shared/GeneratedCover/GeneratedCover";
import Button from "../../ui/Button";

import type { Project } from "../../../types/project";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({
  project,
}: ProjectHeroProps): ReactElement {
  return (
    <section className="project-hero">
      <div className="project-hero_cover">
        <GeneratedCover
          seed={project.coverSeed ?? project._id}
          className="project-hero_generated-cover"
        />
      </div>

      <div className="project-hero_content">
        <div className="project-hero_identity">
          <div className="project-hero_identity-info">
            <h1 className="project-hero_title">
              {project.title || "Untitled Project"}
            </h1>

            <span className="project-hero_creator">
              @{project.creatorId.username}
            </span>
          </div>
        </div>

        <div className="project-hero_actions">
          {project.links?.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-hero_button"
            >
              GitHub
            </a>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="project-hero_button"
              disabled
            >
              GitHub Unavailable
            </Button>
          )}

          {project.links?.demo ? (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-hero_button project-hero_button--primary"
            >
              Live Demo
            </a>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="project-hero_button"
              disabled
            >
              Demo Unavailable
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
