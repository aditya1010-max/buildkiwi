import "./ProjectPage.css";

import { useState } from "react";

import {
  EmptyProjects,
  ProjectsGrid,
  ProjectsHeader,
  ProjectsTabs,
  type ProjectsTab,
} from "../../components/project/manager";

import type { Project } from "../../types/project";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<ProjectsTab>("published");

  // Temporary until backend is connected
  const projects: Project[] = [];

  return (
    <main className="projects-page">
      <ProjectsHeader totalProjects={0} />

      <ProjectsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "published" &&
        (projects.length > 0 ? (
          <ProjectsGrid projects={projects} />
        ) : (
          <EmptyProjects />
        ))}

      {activeTab === "drafts" && <EmptyProjects />}

      {activeTab === "archived" && <EmptyProjects />}
    </main>
  );
}
