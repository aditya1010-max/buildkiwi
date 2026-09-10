import type { ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMyProjects } from "../../hooks/useMyProjects";
import ProjectGrid from "../../components/projects/manager/ProjectsGrid";
import ProjectStats from "../../components/projects/card/stats/ProjectStats";
import GuestPrompt from "../../components/auth/GuestPrompt";
import { getAccessToken } from "../../utils/token";

import "./ProjectsPage.css";

export default function ProjectsPage(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const { projects, loading } = useMyProjects();

  const isGuest = !getAccessToken();

  function openCreateModal(): void {
    navigate("/create", {
      state: {
        background: location,
      },
    });
  }

  if (isGuest) {
    return (
      <main className="projects-page">
        <div className="projects-page_container">
          <GuestPrompt
            icon=""
            title="Publish your projects"
            description="Create an account to publish and manage your own projects."
          />
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="projects-page">
        <div className="projects-page_container">
          <div className="projects-page_loading">
            <p>Loading projects...</p>
          </div>
        </div>
      </main>
    );
  }

  const stats = projects.reduce(
    (acc, project) => {
      acc.totalProjects += 1;
      acc.totalViews += project.stats.views;
      acc.totalLikes += project.stats.likes;

      return acc;
    },
    {
      totalProjects: 0,
      totalViews: 0,
      totalLikes: 0,
    },
  );

  return (
    <main className="projects-page">
      <div className="projects-page_container">
        <header className="projects-page_header">
          <div className="projects-page_heading">
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

        <section
          className="projects-page_stats"
          aria-label="Project statistics"
        >
          <ProjectStats {...stats} />
        </section>

        <section className="projects-page_content">
          <ProjectGrid projects={projects} onCreateProject={openCreateModal} />
        </section>
      </div>
    </main>
  );
}
