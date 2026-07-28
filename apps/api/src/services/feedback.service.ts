import { createFeedback } from "../repositories/feedback.repository";

interface CreateFeedbackInput {
  category: "bug" | "feature" | "general";
  title: string;
  description: string;
  page: string;
  language: string;
  userAgent: string;
  userId?: string | null;
}

export async function submitFeedback(input: CreateFeedbackInput) {
  const { category, title, description, page, language, userAgent, userId } =
    input;

  if (!title.trim()) {
    throw new Error("Title is required.");
  }

  if (!description.trim()) {
    throw new Error("Description is required.");
  }

  return createFeedback({
    category,
    title: title.trim(),
    description: description.trim(),
    page,
    language,
    userAgent,
    userId,
  });
}
