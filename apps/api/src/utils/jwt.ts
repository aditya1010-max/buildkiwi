import { env } from "../config/env";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET as jwt.Secret) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET as jwt.Secret,
  ) as TokenPayload;
}
