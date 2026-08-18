import { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEditableProject } from "../../api/project.api";

import "./EditProjectPage.css";
import DynamicForm from "../../components/create/DynamicForm";
import projectSchema from "../../schema/projectSchema";
import { updateProject } from "../../api/project.api";
import type { Project } from "../../types/project";

export default function EditProjectPage(): ReactElement {
  const { id } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  async function handleUpdateProject(formData: FormData) {
    if (!id) return;

    try {
      await updateProject(id, formData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function loadProject() {
      if (!id) return;

      try {
        const data = await getEditableProject(id);
        setProject(data);
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <main className="edit-project-page">
        <p>Loading project...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="edit-project-page">
        <p>Project not found.</p>
      </main>
    );
  }

  return (
    <main className="edit-project-page">
      <div className="edit-project-page_container">
        <header className="edit-project-page_header">
          <h1>Edit Project</h1>
          <p>Update your project information.</p>
        </header>

        <section className="edit-project-page_content">
          <DynamicForm
            key={project._id}
            schema={projectSchema}
            initialValues={{
              title: project.title,
              description: project.description,
              github: project.links?.github ?? "",
              demo: project.links?.demo ?? "",
              tags: project.tags?.join(", ") ?? "",
            }}
            onSubmit={handleUpdateProject}
          />
        </section>
      </div>
    </main>
  );
}
