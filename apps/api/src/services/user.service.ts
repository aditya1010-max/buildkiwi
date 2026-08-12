import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
  updateUserBioRepository,
} from "../repositories/user.repository";

export const createUserService = async (data: any) => {
  return await createUserRepository(data);
};

export const findUserByEmailService = async (email: string) => {
  return await findUserByEmailRepository(email);
};

export const findUserByIdService = async (id: string) => {
  return await findUserByIdRepository(id);
};

export const updateUserBioService = async (userId: string, bio: string) => {
  return await updateUserBioRepository(userId, bio);
};
