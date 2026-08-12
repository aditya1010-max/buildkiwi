import api from "./api";

interface UpdateUserData {
  bio: string;
}

export const updateUser = async (userId: string, data: UpdateUserData) => {
  const response = await api.patch(`/users/${userId}`, data);

  return response.data;
};
