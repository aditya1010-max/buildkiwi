import bcrypt from "bcrypt";
import { RegisterInput } from "@buildkiwi/validation";
import {
  createUserRepository,
  findUserByEmailRepository,
} from "../repositories/user.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const registerUserService = async ({
  username,
  email,
  password,
}: RegisterInput) => {
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

  const payload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);

  // console.log("Generating refresh token with payload:", payload);
  // console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);
  // console.log("REFRESH_TOKEN_EXPIRES:", process.env.REFRESH_TOKEN_EXPIRES);
  // console.log("Access Token:", accessToken);

  const refreshToken = generateRefreshToken(payload);
  // console.log("Refresh Token:", refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
  };
};
