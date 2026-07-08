import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

import bcrypt from "bcrypt";
import { RegisterInput } from "@buildkiwi/validation";
import {
  createUserRepository,
  findUserByEmailRepository,
} from "../repositories/user.repository";

export const registerUserService = async ({username, email, password }: RegisterInput) => {
  const existingUser = await findUserByEmailRepository(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await createUserRepository({
    username,
    email,
    passwordHash,
  });

  return user;
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
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    env.JWT_SECRET as Secret,
    {
      expiresIn: "15m",
    } as SignOptions,
  );

  return { user, token };
};
