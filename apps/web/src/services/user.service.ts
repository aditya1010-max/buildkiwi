import type { PatternId } from "@buildkiwi/pattern-engine";

import api from "./api";

interface UpdateUserData {
  bio?: string;
  avatarSeed?: string;
  avatarPattern?: PatternId;
}

export const updateUser = async (userId: string, data: UpdateUserData) => {
  const response = await api.patch(`/users/${userId}`, data);

  return response.data;
};
