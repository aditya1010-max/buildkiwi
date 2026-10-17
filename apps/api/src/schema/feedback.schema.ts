import { z } from "zod";
import { FeedbackCategorySchema } from "@buildkiwi/validation";

export const CreateFeedbackSchema = z.object({
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
});

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
