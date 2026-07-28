import Feedback from "../models/feedback.model";

interface CreateFeedbackData {
  category: "bug" | "feature" | "general";
  title: string;
  description: string;
  page: string;
  language: string;
  userAgent: string;
  userId?: string | null;
}

export async function createFeedback(data: CreateFeedbackData) {
  return Feedback.create(data);
}

//for line 13 status: open -  Even better: let MongoDB handle it

// Since your Mongoose model already has:

// status: {
//   type: String,
//   enum: ["open", "in-progress", "resolved"],
//   default: "open",
// },
