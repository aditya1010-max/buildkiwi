import { FormEvent, useState } from "react";

import "./FeedbackForm.css";

import FeedbackCategorySelector from "./FeedbackCategorySelector";
import { submitFeedback } from "../../services/feedback.api";
import { FeedbackCategory, FeedbackRequest } from "../../types/feedback";

const initialForm: FeedbackRequest = {
  category: "bug",
  title: "",
  description: "",
  page: window.location.pathname,
  language: navigator.language,
  userAgent: navigator.userAgent,
};

const descriptionPlaceholders: Record<FeedbackCategory, string> = {
  bug: "What happened? What did you expect to happen? How can we reproduce the issue?",
  feature: "Describe your idea and explain how it would improve BuildKiwi.",
  general: "Tell us what you like, dislike, or what could be improved.",
};

export default function FeedbackForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    form.title.trim().length > 0 && form.description.trim().length > 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!isValid) return;

    try {
      setLoading(true);

      await submitFeedback({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        page: window.location.pathname,
        language: navigator.language,
        userAgent: navigator.userAgent,
      });

      setSubmitted(true);
      setForm(initialForm);
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
            setForm(initialForm);
          }}
        >
          Send Another Feedback
        </button>
      </section>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <header className="feedback-form_header">
        <h1>Send Feedback</h1>

        <p>
          Found something broken, have an idea, or just want to tell us what you
          think? We&apos;re listening.
        </p>
      </header>

      <section className="feedback-form_sections">
        <div className="feedback-form_section">
          <label className="feedback-form_label">Category</label>

          <FeedbackCategorySelector
            value={form.category}
            onChange={(category) =>
              setForm((prev) => ({
                ...prev,
                category,
              }))
            }
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
            value={form.title}
            placeholder="Summarize your feedback in a few words"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
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
            value={form.description}
            placeholder={descriptionPlaceholders[form.category]}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
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
