import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description too short"),
  tags: z.array(z.string()).default([]),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;