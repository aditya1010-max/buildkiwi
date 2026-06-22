import { useNavigate } from "react-router-dom";
import "./CreateModel.css";

import taskSchema from "../../schema/taskSchema";
import DynamicForm from "./DynamicForm";

export default function CreateModal() {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => navigate(-1)}>✕</button>
        <h2>Create Project</h2>
        <DynamicForm schema={taskSchema} />
      </div>
    </div>
  );
}
