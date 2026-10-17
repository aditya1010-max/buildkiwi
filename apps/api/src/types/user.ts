export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  avatarSeed: string;
  avatarPattern: import("@buildkiwi/pattern-engine").PatternId;
}

export interface UpdateUserProfileData {
  bio?: string;
  avatarSeed?: string;
  avatarPattern?: import("@buildkiwi/pattern-engine").PatternId;
}
