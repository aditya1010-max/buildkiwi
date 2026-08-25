import type { CreateUserData } from "../types/user";

import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
  updateUserBioRepository,
} from "../repositories/user.repository";

export const createUserService = async (data: CreateUserData) => {
  return createUserRepository(data);
};

export const findUserByEmailService = async (email: string) => {
  return findUserByEmailRepository(email);
};

export const findUserByIdService = async (id: string) => {
  return findUserByIdRepository(id);
};

export const updateUserBioService = async (userId: string, bio: string) => {
  return updateUserBioRepository(userId, bio);
};
