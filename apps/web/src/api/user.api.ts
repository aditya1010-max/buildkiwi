import type { UpdateUserInput } from "@buildkiwi/validation";
import type { User } from "../types/user";
import api from "../services/api";
import { normalizeUser } from "../utils/normalizeUser";
import type { ApiUser } from "../utils/normalizeUser";

interface UserProfileResponse {
  success: boolean;
  user: ApiUser;
}

export async function getUserProfile(id: string): Promise<User> {
  const { data } = await api.get<UserProfileResponse>(`/users/${id}`);

  const user = normalizeUser(data.user);

  if (!user) {
    throw new Error("User profile response did not include a user.");
  }

  return user;
}

export async function updateUser(userId: string, data: UpdateUserInput) {
  const response = await api.patch(`/users/${userId}`, data);

  return response.data;
}
