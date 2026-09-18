import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEditableProject, updateProject } from "../../api/project.api";

import type { Project } from "../../types/project";

import DynamicForm from "../../components/projects/create/DynamicForm";
import Loader from "../../components/ui/Loader";

import projectSchema from "../../schema/projectSchema";

import { useToast } from "../../hooks/useToast";

import "./EditProjectPage.css";

export default function EditProjectPage() {
  const { id } = useParams();
  const toast = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getEditableProject(id);
        setProject(data);
      } catch (error) {
        console.error("Failed to load project:", error);

        toast.error(
          "Failed to load project",
          "We couldn't load this project. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id, toast]);

  async function handleUpdateProject(formData: FormData) {
    if (!id) return;

    try {
      await updateProject(id, formData);

      toast.success(
        "Project updated",
        "Your project has been updated successfully.",
      );
    } catch (error) {
      console.error("Failed to update project:", error);

      toast.error(
        "Update failed",
        "We couldn't update your project. Please try again.",
      );
    }
  }

  if (loading) {
    return (
      <main className="edit-project-page">
        <Loader label="Loading project..." />
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
              coverSeed: project.coverSeed,
            }}
            onSubmit={handleUpdateProject}
          />
        </section>
      </div>
    </main>
  );
}
