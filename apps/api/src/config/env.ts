// just the schema for env for extra security 
// not actually used to load env vars, that is done by dotenv


import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required").optional(),  //optional for now 
JWT_EXPIRES_IN: z.string().default("15m"),
  NODE_ENV: z.enum([
    "development",
    "production",
    "test"
  ]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Environment variable validation failed:"
  );

  console.error(
    parsed.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const env = parsed.data;