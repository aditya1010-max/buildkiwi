import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return verifyToken(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): TokenPayload {
  return verifyToken(token, env.JWT_REFRESH_SECRET);
}

function verifyToken(token: string, secret: string): TokenPayload {
  const decoded = jwt.verify(token, secret);

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    typeof decoded.email !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return decoded as TokenPayload;
}
