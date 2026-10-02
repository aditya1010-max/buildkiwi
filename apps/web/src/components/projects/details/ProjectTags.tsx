import "./ProjectTags.css";

import { createSearchParams, useNavigate } from "react-router-dom";

import type { Project } from "../../../types/project";
import Badge from "../../ui/Badge";
import ProjectSection from "../shared/ProjectSection";

interface ProjectTagsProps {
  project: Project;
}

export default function ProjectTags({ project }: ProjectTagsProps) {
  const navigate = useNavigate();

  const tags = [...new Set(project.tags ?? [])];

  function handleTagClick(tag: string) {
    navigate({
      pathname: "/discover",
      search: createSearchParams({
        q: tag,
      }).toString(),
    });
  }

  return (
    <ProjectSection title="Technologies">
      {tags.length > 0 ? (
        <div className="project-tags">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="project-tags_button"
              onClick={() => handleTagClick(tag)}
              aria-label={`Search for ${tag}`}
            >
              <Badge>#{tag}</Badge>
            </button>
          ))}
        </div>
      ) : (
        <div className="project-tags_empty">
          <h3>No Technologies Added</h3>
          <p>The project owner hasn't added any technologies yet.</p>
        </div>
      )}
    </ProjectSection>
  );
}
