import { useEffect, useState, type ChangeEvent } from "react";
import { Field, FormSchema } from "../../types/schema";
import "./DynamicForm.css";
import UploadImage from "./ImageUploader";

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: FormData) => Promise<void>;
  initialValues?: Record<string, any>;
}

export default function DynamicForm({
  schema,
  onSubmit,
  initialValues,
}: DynamicFormProps) {
  const initialState: Record<string, any> = {};

  schema.fields.forEach((field) => {
    initialState[field.name] = field.type === "image" ? null : "";
  });

  const [formData, setFormData] = useState<Record<string, any>>({
    ...initialState,
    ...initialValues,
  });

  useEffect(() => {
    if (!initialValues) return;

    setFormData((prev) => ({
      ...prev,
      ...initialValues,
    }));
  }, [initialValues]);

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

    const submissionData = new FormData();

    const { coverImage, title, description, github, demo } = formData;

    submissionData.append("title", title ?? "");
    submissionData.append("description", description ?? "");

    submissionData.append("links.github", github ?? "");
    submissionData.append("links.demo", demo ?? "");

    if (coverImage instanceof File) {
      submissionData.append("coverImage", coverImage);
    }

    await onSubmit(submissionData);
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
