import { useState, type ChangeEvent } from "react";
import { Field, FormSchema } from "../../types/schema";
import "./DynamicForm.css";
import UploadImage from "./ImageUploader";

interface DynamicFormProps {
  schema: FormSchema;
}

export default function DynamicForm({ schema }: DynamicFormProps) {
  const initialState: Record<string, any> = {};

  schema.fields.forEach((field) => {
    initialState[field.name] = field.type === "image" ? null : "";
  });

  const [formData, setFormData] = useState<Record<string, any>>(initialState);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("Submitting:", formData);

    try {
      const token = localStorage.getItem("token");
      const submissionData = new FormData();

      const { coverImage, title, description } = formData;

      submissionData.append("title", title);
      submissionData.append("description", description);

      if (coverImage) {
        submissionData.append("coverImage", coverImage);
      }

      const response = await fetch("http://localhost:3000/api/v1/projects", {
        method: "POST",
        headers: {
          Authorization : `Bearer ${token}`,
        },
        body: submissionData,
      });

      const data = await response.json();

      console.log("Server response:", data);
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  function renderField(field: Field) {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );

      case "image": {
        const imageFieldName = field.name;

        const handleImageSelect = (file: File | null) => {
          setFormData((prev) => ({
            ...prev,
            [imageFieldName]: file,
          }));
        };

        return <UploadImage maxSizeMB={5} onImageSelect={handleImageSelect} />;
      }

      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {schema.fields.map((field) => (
        <div key={field.name}>
          {field.type !== "image" && <label>{field.label}</label>}
          {renderField(field)}
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}
