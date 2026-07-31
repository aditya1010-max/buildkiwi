import { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEditableProject } from "../../api/project.api";

import "./EditProjectPage.css";
import DynamicForm from "../../components/create/DynamicForm";
import taskSchema from "../../schema/taskSchema";
import { updateProject } from "../../api/project.api";

export default function EditProjectPage(): ReactElement {
  const { id } = useParams();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function handleUpdateProject(formData: FormData) {
    if (!id) return;

    try {
      await updateProject(id, formData);

      console.log("Project updated!");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function loadProject() {
      if (!id) return;

      try {
        const data = await getEditableProject(id);
        console.log("Editable project:", data);
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
      <div className="edit-project-page__container">
        <header className="edit-project-page__header">
          <h1>Edit Project</h1>
          <p>Update your project information.</p>
        </header>

        <section className="edit-project-page__content">
          <DynamicForm
            schema={taskSchema}
            initialValues={{
              title: project.title,
              description: project.description,
              github: project.links?.github ?? "",
              demo: project.links?.demo ?? "",
            }}
            onSubmit={handleUpdateProject}
          />
        </section>
      </div>
    </main>
  );
}
