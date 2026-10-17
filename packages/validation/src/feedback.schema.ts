import { z } from "zod";

export const FeedbackCategorySchema = z.enum(["bug", "feature", "general"]);

export const FeedbackRequestSchema = z.object({
  category: FeedbackCategorySchema,
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title cannot exceed 150 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(5000, "Description cannot exceed 5000 characters."),
  page: z.string(),
  userAgent: z.string(),
  language: z.string(),
});

export type FeedbackCategory = z.infer<typeof FeedbackCategorySchema>;
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;
