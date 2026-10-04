import type { User } from "../types/user";
import api from "../services/api";

interface ApiUser extends Omit<User, "id"> {
  _id: string;
}

interface UserProfileResponse {
  success: boolean;
  user: ApiUser;
}

function normalizeUser(user: User | ApiUser): User {
  if ("id" in user) {
    return user;
  }

  return {
    ...user,
    id: user._id,
  };
}

export async function getUserProfile(id: string): Promise<User> {
  const { data } = await api.get<UserProfileResponse>(`/users/${id}`);

  return normalizeUser(data.user);
}
