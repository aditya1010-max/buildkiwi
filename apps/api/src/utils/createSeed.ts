import { randomUUID } from "node:crypto";

export function createSeed(): string {
  return `avatar-${randomUUID()}`;
}
