import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
  updateUserProfileRepository,
} from "../repositories/user.repository";

import type { CreateUserData, UpdateUserProfileData } from "../types/user";

export const createUserService = async (data: CreateUserData) => {
  return createUserRepository(data);
};

export const findUserByEmailService = async (email: string) => {
  return findUserByEmailRepository(email);
};

export const findUserByIdService = async (id: string) => {
  return findUserByIdRepository(id);
};

export const updateUserProfileService = async (
  userId: string,
  data: UpdateUserProfileData,
) => {
  return updateUserProfileRepository(userId, data);
};
