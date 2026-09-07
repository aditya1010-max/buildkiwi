import type { ReactElement } from "react";

import "./ProjectHero.css";

import GeneratedCover from "../shared/GeneratedCover/GeneratedCover";

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
        <h1 className="project-hero_title">
          {project.title || "Untitled Project"}
        </h1>

        <div className="project-hero_meta">
          <span className="project-hero_creator">
            @{project.creatorId.username}
          </span>

          <span className="project-hero_separator">•</span>

          <span className="project-hero_date">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
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
            <button
              type="button"
              disabled
              className="project-hero_button disabled"
            >
              GitHub Unavailable
            </button>
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
            <button
              type="button"
              disabled
              className="project-hero_button disabled"
            >
              Demo Unavailable
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
