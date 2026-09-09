import { useState, type ChangeEvent, type FormEvent } from "react";

import type { Field, FormSchema } from "../../types/schema";
import "./DynamicForm.css";

import GeneratedCover from "../project/shared/GeneratedCover/GeneratedCover";

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: FormData) => Promise<void>;
  initialValues?: Record<string, unknown>;
}

interface ProjectFormData {
  coverSeed?: string;
  title?: string;
  description?: string;
  github?: string;
  demo?: string;
  tags?: string;
}

const SEED_ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function createCoverSeed(length = 16): string {
  const values = new Uint32Array(length);

  crypto.getRandomValues(values);

  return Array.from(
    values,
    (value) => SEED_ALPHABET[value % SEED_ALPHABET.length],
  ).join("");
}

export default function DynamicForm({
  schema,
  onSubmit,
  initialValues,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initialState: Record<string, unknown> = {};

    schema.fields.forEach((field) => {
      initialState[field.name] = "";
    });

    return {
      ...initialState,
      ...initialValues,
      coverSeed: initialValues?.coverSeed ?? createCoverSeed(),
    };
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

  function handleRandomizeCover() {
    setFormData((prev) => ({
      ...prev,
      coverSeed: createCoverSeed(),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submissionData = new FormData();

    const { coverSeed, title, description, github, demo, tags } =
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

    submissionData.append("coverSeed", coverSeed ?? "");

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

      case "cover":
        return (
          <div className="dynamic-form_cover">
            <div className="dynamic-form_cover-preview">
              <GeneratedCover
                seed={formData.coverSeed as string}
                className="dynamic-form_generated-cover"
              />
            </div>

            <button
              type="button"
              className="dynamic-form_cover-randomize"
              onClick={handleRandomizeCover}
            >
              Randomize
            </button>

            <span className="dynamic-form_cover-help">
              Generate a new cover using BuildKiwi's pattern engine.
            </span>
          </div>
        );

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
            {field.type !== "cover" && (
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
