import { useState, type ChangeEvent } from "react";
import type { FormSchema, Field } from "../../types/schema";
import "./DynamicForm.css";

interface DynamicFormProps {
  schema: FormSchema;
}

export default function DynamicForm({ schema }: DynamicFormProps) {
  const initialState: Record<string, string> = {};

  schema.fields.forEach((field) => {
    initialState[field.name] = "";
  });

  const [formData, setFormData] =
    useState<Record<string, string>>(initialState);

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
      const response = await fetch("http://localhost:3000/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
            value={formData[field.name]}
            onChange={handleChange}
          />
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
          />
        );

      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {schema.fields.map((field) => (
        <div key={field.name}>
          <label>{field.label}</label>

          {renderField(field)}
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}
