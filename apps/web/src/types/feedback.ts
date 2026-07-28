export type FeedbackCategory = "bug" | "feature" | "general";

export interface FeedbackRequest {
  category: FeedbackCategory;
  title: string;
  description: string;

  page: string;
  userAgent: string;
  language: string;
}
