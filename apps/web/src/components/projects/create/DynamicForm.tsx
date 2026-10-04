import { useState, type ChangeEvent, type FormEvent } from "react";

import type { Field, FormSchema } from "../../../types/schema";
import { tagSuggestions } from "../../../constants/tagSuggestions";
import TagInput from "../../ui/TagInput";
import GeneratedCover from "../shared/GeneratedCover/GeneratedCover";

import "./DynamicForm.css";
import Button from "../../ui/Button";

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: FormData) => Promise<void>;
  initialValues?: Record<string, unknown>;
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

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string");
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function getInitialValue(
  field: Field,
  initialValues?: Record<string, unknown>,
) {
  const existingValue = initialValues?.[field.name];

  if (field.type === "tags") {
    return normalizeTags(existingValue);
  }

  if (field.type === "cover") {
    return typeof existingValue === "string" && existingValue
      ? existingValue
      : createCoverSeed();
  }

  return existingValue ?? "";
}

export default function DynamicForm({
  schema,
  onSubmit,
  initialValues,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initialState: Record<string, unknown> = {};

    schema.fields.forEach((field) => {
      initialState[field.name] = getInitialValue(field, initialValues);
    });

    return initialState;
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

  function handleTagsChange(fieldName: string, tags: string[]) {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: tags,
    }));
  }

  function handleRandomizeCover(fieldName: string) {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: createCoverSeed(),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submissionData = new FormData();

    Object.entries(formData).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        submissionData.append(name, JSON.stringify(value));
        return;
      }

      submissionData.append(name, String(value ?? ""));
    });

    await onSubmit(submissionData);
  }

  function renderField(field: Field) {
    const value = formData[field.name];

    switch (field.type) {
      case "text":
        return (
          <input
            className="dynamic-form_input"
            type="text"
            name={field.name}
            id={field.name}
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={handleChange}
          />
        );

      case "textarea":
        return (
          <textarea
            className="dynamic-form_textarea"
            name={field.name}
            id={field.name}
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={handleChange}
          />
        );

      case "tags":
        return (
          <TagInput
            value={normalizeTags(value)}
            onChange={(tags) => handleTagsChange(field.name, tags)}
            suggestions={tagSuggestions}
            placeholder={field.placeholder ?? "Add technologies..."}
            maxTags={10}
          />
        );

      case "cover":
        return (
          <div className="dynamic-form_cover">
            <div className="dynamic-form_cover-preview">
              <GeneratedCover
                seed={String(value ?? "")}
                className="dynamic-form_generated-cover"
              />
            </div>

            <Button
              type="button"
              className="dynamic-form_cover-randomize-button"
              onClick={() => handleRandomizeCover(field.name)}
            >
              Randomize
            </Button>

            <span className="dynamic-form_cover-help">
              Generate a new cover using BuildKiwi&apos;s pattern engine.
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
