import type { PatternId } from "@buildkiwi/pattern-engine";

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
