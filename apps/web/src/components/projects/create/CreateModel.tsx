import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CreateModel.css";

import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";

import projectSchema from "../../schema/projectSchema";
import DynamicForm from "./DynamicForm";

import { createProject } from "../../api/project.api";

import type { Achievement } from "../../types/achievement";
import AchievementCelebration from "../discover/achievements/AchievementCelebration";

export default function CreateModal() {
  const navigate = useNavigate();
  const toast = useToast();
  const { getCurrentUser } = useAuth();

  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(true);

  async function handleCreateProject(formData: FormData) {
    try {
      const data = await createProject(formData);

      setShowForm(false);

      if (data?.achievement) {
        setAchievement(data.achievement);

        return;
      }

      toast.success(
        "Project created!",
        "Your project has been published successfully.",
      );

      navigate(-1);
    } catch {
      toast.error("Failed to create project", "Please try again.");
    }
  }

  function handleAchievementClose() {
    setAchievement(null);

    navigate(-1);
  }

  const user = getCurrentUser();

  return (
    <>
      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => {
            navigate(-1);
          }}
        >
          <div
            className="modal-container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              ✕
            </button>

            <h2>Create Project</h2>

            <DynamicForm
              schema={projectSchema}
              onSubmit={handleCreateProject}
            />
          </div>
        </div>
      )}

      {achievement && (
        <>
          <AchievementCelebration
            achievement={achievement}
            username={user?.username ?? ""}
            onClose={handleAchievementClose}
          />
        </>
      )}
    </>
  );
}
