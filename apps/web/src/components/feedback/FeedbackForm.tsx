import { useState } from "react";
import type { FormEvent } from "react";

import "./FeedbackForm.css";

import FeedbackCategorySelector from "./FeedbackCategorySelector";
import { submitFeedback } from "../../services/feedback.api";
import type { FeedbackCategory, FeedbackRequest } from "../../types/feedback";

function createInitialForm(): FeedbackRequest {
  return {
    category: "bug",
    title: "",
    description: "",
    page: window.location.pathname,
    language: navigator.language,
    userAgent: navigator.userAgent,
  };
}

const descriptionPlaceholders: Record<FeedbackCategory, string> = {
  bug: "What happened? What did you expect to happen? How can we reproduce the issue?",
  feature: "Describe your idea and explain how it would improve BuildKiwi.",
  general: "Tell us what you like, dislike, or what could be improved.",
};

export default function FeedbackForm() {
  const [form, setForm] = useState<FeedbackRequest>(createInitialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    form.title.trim().length > 0 && form.description.trim().length > 0;

  function updateForm(updates: Partial<FeedbackRequest>) {
    setError("");
    setForm((prev: FeedbackRequest) => ({
      ...prev,
      ...updates,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isValid || loading) return;

    setError("");
    setLoading(true);

    try {
      await submitFeedback({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        page: window.location.pathname,
        language: navigator.language,
        userAgent: navigator.userAgent,
      });

      setSubmitted(true);
      setForm(createInitialForm());
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="feedback-success">
        <header className="feedback-success_header">
          <h2>Feedback received 🎉</h2>

          <p>
            Thanks for helping make BuildKiwi better. Your feedback has been
            submitted successfully.
          </p>
        </header>

        <button
          type="button"
          className="feedback-success_button"
          onClick={() => {
            setSubmitted(false);
            setError("");
            setForm(createInitialForm());
          }}
        >
          Send Another Feedback
        </button>
      </section>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <section className="feedback-form_sections">
        <div className="feedback-form_section">
          <label className="feedback-form_label">Category</label>

          <FeedbackCategorySelector
            value={form.category}
            onChange={(category) => updateForm({ category })}
          />
        </div>

        <div className="feedback-form_section">
          <label className="feedback-form_label" htmlFor="feedback-title">
            Title
          </label>

          <input
            id="feedback-title"
            type="text"
            maxLength={150}
            required
            value={form.title}
            placeholder="Summarize your feedback in a few words"
            onChange={(e) => updateForm({ title: e.target.value })}
          />

          <span className="feedback-form_counter">{form.title.length}/150</span>
        </div>

        <div className="feedback-form_section">
          <label className="feedback-form_label" htmlFor="feedback-description">
            Description
          </label>

          <textarea
            id="feedback-description"
            rows={8}
            maxLength={5000}
            required
            value={form.description}
            placeholder={descriptionPlaceholders[form.category]}
            onChange={(e) => updateForm({ description: e.target.value })}
          />

          <span className="feedback-form_counter">
            {form.description.length}/5000
          </span>
        </div>
      </section>

      {error && (
        <div className="feedback-form_error" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="feedback-form_submit"
        disabled={!isValid || loading}
      >
        {loading ? "Sending..." : "Send Feedback"}
      </button>
    </form>
  );
}
