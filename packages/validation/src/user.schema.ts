import type { PatternId } from "@buildkiwi/pattern-engine";
import { z } from "zod";

export const UpdateUserSchema = z
  .object({
    bio: z
      .string()
      .trim()
      .max(120, "Bio must be 120 characters or less")
      .optional(),

    avatarSeed: z
      .string()
      .trim()
      .min(1, "Avatar seed cannot be empty")
      .optional(),

    avatarPattern: z
      .enum(["blobs", "waves", "constellation", "halftone", "geometric"])
      .optional(),
  })
  .refine(
    (data) =>
      data.bio !== undefined ||
      data.avatarSeed !== undefined ||
      data.avatarPattern !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export interface User {
  id: string;
  username: string;
  email: string;
  avatarSeed: string;
  avatarPattern: PatternId;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}
