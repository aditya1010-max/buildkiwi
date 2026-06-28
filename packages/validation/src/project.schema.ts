import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description too short"),
  coverImage: z.string().optional(),
  links: z
    .object({
      github: z.string().url().optional().or(z.literal("")),
      demo: z.string().url().optional().or(z.literal("")),
    })
    .default({}),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
