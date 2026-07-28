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
      <div className="feedback-success">
        <h2>🎉 Thank you!</h2>

        <p>
          Your feedback has been submitted successfully. Every report and
          suggestion helps us improve BuildKiwi.
        </p>

        <button
          type="button"
          className="feedback-success__button"
          onClick={() => {
            setSubmitted(false);
            setError("");
            setForm(initialForm);
          }}
        >
          Send Another Feedback
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <div className="feedback-form__field">
        <label>Category</label>

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

      <div className="feedback-form__field">
        <label htmlFor="feedback-title">Title</label>

        <input
          id="feedback-title"
          type="text"
          maxLength={150}
          value={form.title}
          placeholder="Briefly describe your feedback"
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />

        <div className="feedback-form__counter">{form.title.length}/150</div>
      </div>

      <div className="feedback-form__field">
        <label htmlFor="feedback-description">Description</label>

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

        <div className="feedback-form__counter">
          {form.description.length}/5000
        </div>
      </div>

      {error && <div className="feedback-form__error">{error}</div>}

      <button
        type="submit"
        className="feedback-form__submit"
        disabled={!isValid || loading}
      >
        {loading ? "Sending..." : "Send Feedback"}
      </button>
    </form>
  );
}
