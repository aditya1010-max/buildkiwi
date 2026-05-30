import bcrypt from "bcrypt";

import {
  createUserRepository,
  findUserByEmailRepository,
} from "../repositories/user.repository";

export const registerUserService = async (
  username: string,
  email: string,
  password: string,
) => {
  const existingUser = await findUserByEmailRepository(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return await createUserRepository({
    username,
    email,
    passwordHash,
  });
};

export const loginUserService = async (email: string, password: string) => {
  const user = await findUserByEmailRepository(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
};
