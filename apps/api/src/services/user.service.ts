import {
  createUserRepository,
  findUserByEmailRepository,
} from "../repositories/user.repository";

export const createUserService = async (data: any) => {
  return await createUserRepository(data);
};

export const findUserByEmailService = async (email: string) => {
  return await findUserByEmailRepository(email);
};
