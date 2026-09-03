import { useState, type ChangeEvent, type FormEvent } from "react";

import type { Field, FormSchema } from "../../types/schema";
import "./DynamicForm.css";
import UploadImage from "./ImageUploader";

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: FormData) => Promise<void>;
  initialValues?: Record<string, unknown>;
}

interface ProjectFormData {
  coverImage?: File | null;
  title?: string;
  description?: string;
  github?: string;
  demo?: string;
  tags?: string;
}

export default function DynamicForm({
  schema,
  onSubmit,
  initialValues,
}: DynamicFormProps) {
  const initialState: Record<string, unknown> = {};

  schema.fields.forEach((field) => {
    initialState[field.name] = field.type === "image" ? null : "";
  });

  const [formData, setFormData] = useState<Record<string, unknown>>({
    ...initialState,
    ...initialValues,
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submissionData = new FormData();

    const { coverImage, title, description, github, demo, tags } =
      formData as ProjectFormData;

    submissionData.append("title", title ?? "");
    submissionData.append("description", description ?? "");

    submissionData.append(
      "tags",
      JSON.stringify(
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      ),
    );

    submissionData.append("links.github", github ?? "");

    submissionData.append("links.demo", demo ?? "");

    if (coverImage instanceof File) {
      submissionData.append("coverImage", coverImage);
    }

    await onSubmit(submissionData);
  }

  function renderField(field: Field) {
    const fieldValue = (formData[field.name] as string | number) ?? "";

    switch (field.type) {
      case "text":
        return (
          <input
            className="dynamic-form_input"
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={handleChange}
          />
        );

      case "textarea":
        return (
          <textarea
            className="dynamic-form_textarea"
            name={field.name}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={handleChange}
          />
        );

      case "tags":
        return (
          <input
            className="dynamic-form_input"
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            value={fieldValue}
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
    <form className="dynamic-form" onSubmit={handleSubmit}>
      <div className="dynamic-form_fields">
        {schema.fields.map((field) => (
          <div
            key={field.name}
            className={`dynamic-form_field dynamic-form_field--${field.type}`}
          >
            {field.type !== "image" && (
              <label className="dynamic-form_label" htmlFor={field.name}>
                {field.label}
              </label>
            )}

            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="dynamic-form_actions">
        <button className="dynamic-form_submit" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
