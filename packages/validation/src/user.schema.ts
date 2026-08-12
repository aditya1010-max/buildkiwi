import { z } from "zod";

export const UpdateUserSchema = z.object({
  bio: z.string().trim().max(120, "Bio must be 120 characters or less"),
});
