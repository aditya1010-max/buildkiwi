import { z } from "zod";

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long"),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
