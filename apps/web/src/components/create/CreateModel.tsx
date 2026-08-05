import { useNavigate } from "react-router-dom";
import "./CreateModel.css";
import { useToast } from "../../hooks/useToast";
import taskSchema from "../../schema/taskSchema";
import DynamicForm from "./DynamicForm";
import { createProject } from "../../api/project.api";

export default function CreateModal() {
  const navigate = useNavigate();
  const toast = useToast();
  async function handleCreateProject(formData: FormData) {
    try {
      const data = await createProject(formData);

      console.log("Server response:", data);

      toast.success(
        "Project created!",
        "Your project has been published successfully.",
      );

      navigate(-1);
    } catch (error) {
      console.error("Submission error:", error);

      toast.error("Failed to create project", "Please try again.");
    }
  }

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => navigate(-1)}>
          ✕
        </button>

        <h2>Create Project</h2>

        <DynamicForm schema={taskSchema} onSubmit={handleCreateProject} />
      </div>
    </div>
  );
}
