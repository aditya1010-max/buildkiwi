import "./FeedbackCategorySelector.css";

import { FeedbackCategory } from "../../types/feedback";

interface FeedbackCategorySelectorProps {
  value: FeedbackCategory;
  onChange: (category: FeedbackCategory) => void;
}

const categories = [
  {
    id: "bug" as const,
    title: "Bug Report",
    description: "Something isn't working as expected.",
    icon: "🐛",
  },
  {
    id: "feature" as const,
    title: "Feature Request",
    description: "Suggest a new feature or improvement.",
    icon: "💡",
  },
  {
    id: "general" as const,
    title: "General Feedback",
    description: "Share your thoughts about BuildKiwi.",
    icon: "💬",
  },
];

export default function FeedbackCategorySelector({
  value,
  onChange,
}: FeedbackCategorySelectorProps) {
  return (
    <div
      className="feedback-category-selector"
      role="radiogroup"
      aria-label="Feedback category"
    >
      {categories.map((category) => {
        const selected = value === category.id;

        return (
          <button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-pressed={selected}
            aria-label={category.title}
            className={
              selected
                ? "feedback-category feedback-category--active"
                : "feedback-category"
            }
            onClick={() => onChange(category.id)}
          >
            <span className="feedback-category_icon" aria-hidden="true">
              {category.icon}
            </span>

            <div className="feedback-category_content">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
