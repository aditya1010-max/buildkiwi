import type { User } from "../types/user";

export interface ApiUser extends Omit<User, "id"> {
  _id: string;
}

export function normalizeUser(user: User | ApiUser | null): User | null {
  if (!user) {
    return null;
  }

  if ("id" in user) {
    return user;
  }

  return {
    ...user,
    id: user._id,
  };
}
