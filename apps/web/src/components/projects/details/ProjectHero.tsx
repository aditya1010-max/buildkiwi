import type { ReactElement } from "react";

import "./ProjectHero.css";

import GeneratedCover from "../shared/GeneratedCover/GeneratedCover";
import GeneratedAvatar from "../shared/GeneratedAvatar/GeneratedAvatar";
import Button from "../../ui/Button";

import { GitHubIcon } from "../../../assets/icons";

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
          <div className="project-hero_heading">
            <h1 className="project-hero_title">
              {project.title || "Untitled Project"}
            </h1>

            <div className="project-hero_actions">
              {project.links?.github ? (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-hero_button"
                >
                  <GitHubIcon size={20} />
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

          <div className="project-hero_creator">
            <GeneratedAvatar
              seed={project.creatorId.avatarSeed}
              pattern={project.creatorId.avatarPattern}
              className="project-hero_avatar"
            />

            <div className="project-hero_creator-info">
              <span className="project-hero_username">
                @{project.creatorId.username}
              </span>

              <span className="project-hero_published">
                Published on {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
