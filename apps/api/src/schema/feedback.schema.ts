import { z } from "zod";

export const CreateFeedbackSchema = z.object({
  category: z.enum(["bug", "feature", "general"]),

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
});

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
