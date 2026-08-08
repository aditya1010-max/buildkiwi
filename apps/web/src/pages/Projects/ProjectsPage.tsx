import { ReactElement } from "react";
import { useMyProjects } from "../../hooks/useMyProjects";
import ProjectGrid from "../../components/project/manager/ProjectsGrid";
import "./ProjectsPage.css";
import ProjectStats from "../../components/project/card/ProjectStats";
// import { useState } from "react";
// import ProjectToolbar from "../../components/project/manager/ProjectsToolbar";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/token";
import GuestPrompt from "../../components/shared/GuestPrompt";

export default function ProjectsPage(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  function openCreateModal() {
    navigate("/create", {
      state: {
        background: location,
      },
    });
  }
  const { projects, loading } = useMyProjects();

  const isGuest = !getAccessToken();

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
  if (loading) {
    return (
      <main className="projects-page">
        <p>Loading projects...</p>
      </main>
    );
  }
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

        {/* Stats */}
        <section className="projects-page_stats">
          {" "}
          <ProjectStats
            totalProjects={stats.totalProjects}
            totalViews={stats.totalViews}
            totalLikes={stats.totalLikes}
            totalComments={stats.totalComments}
          />
        </section>
        <div className="project-page_abcdef">
          {/* Project Grid */}
          <section className="projects-page_content">
            <ProjectGrid projects={projects} />
          </section>
        </div>
      </div>
    </main>
  );
}
