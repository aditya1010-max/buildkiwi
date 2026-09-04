import type { PatternId } from "@buildkiwi/pattern-engine";

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarSeed: string;
  avatarPattern: PatternId;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  avatarSeed: string;
  avatarPattern: PatternId;
}

export interface UpdateUserProfileData {
  bio?: string;
  avatarSeed?: string;
  avatarPattern?: PatternId;
}
