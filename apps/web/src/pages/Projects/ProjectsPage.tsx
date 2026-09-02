import type { ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMyProjects } from "../../hooks/useMyProjects";
import ProjectGrid from "../../components/project/manager/ProjectsGrid";
import ProjectStats from "../../components/project/card/stats/ProjectStats";
import GuestPrompt from "../../components/shared/GuestPrompt";
import { getAccessToken } from "../../utils/token";

import "./ProjectsPage.css";

export default function ProjectsPage(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const { projects, loading } = useMyProjects();

  const isGuest = !getAccessToken();

  function openCreateModal() {
    navigate("/create", {
      state: {
        background: location,
      },
    });
  }

  if (isGuest) {
    return (
      <main className="projects-page">
        <GuestPrompt
          icon=""
          title="Publish your projects"
          description="Create an account to publish and manage your own projects."
        />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="projects-page">
        <p>Loading projects...</p>
      </main>
    );
  }

  const stats = projects.reduce(
    (acc, project) => {
      acc.totalProjects++;
      acc.totalViews += project.stats.views;
      acc.totalLikes += project.stats.likes;
      acc.totalComments += project.stats.comments;

      return acc;
    },
    {
      totalProjects: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
    },
  );

  return (
    <main className="projects-page">
      <div className="projects-page_container">
        <header className="projects-page_header">
          <div>
            <h1 className="projects-page_title">My Projects</h1>

            <p className="projects-page_subtitle">
              Manage, edit and track all of your published projects.
            </p>
          </div>

          <button
            type="button"
            className="projects-page_create-button"
            onClick={openCreateModal}
          >
            + Create Project
          </button>
        </header>

        <section className="projects-page_stats">
          <ProjectStats {...stats} />
        </section>

        <div className="project-page_abcdef">
          <section className="projects-page_content">
            <ProjectGrid projects={projects} />
          </section>
        </div>
      </div>
    </main>
  );
}
