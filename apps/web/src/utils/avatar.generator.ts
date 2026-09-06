import type { PatternId } from "@buildkiwi/pattern-engine";

import type { AvatarCandidate } from "../types/avatar";

export const AVATAR_CANDIDATE_COUNT = 5;

const AVATAR_PATTERNS: PatternId[] = [
  "blobs",
  "waves",
  "constellation",
  "halftone",
  "geometric",
];

function createAvatarSeed(pattern: PatternId): string {
  const values = new Uint32Array(8);

  crypto.getRandomValues(values);

  const randomPart = Array.from(values, (value) =>
    value.toString(16).padStart(8, "0"),
  ).join("");

  return `${pattern}-${randomPart}`;
}

function shufflePatterns(patterns: PatternId[]): PatternId[] {
  const shuffled = [...patterns];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const values = new Uint32Array(1);

    crypto.getRandomValues(values);

    const j = values[0] % (i + 1);

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function generateAvatarCandidates(): AvatarCandidate[] {
  const patterns = shufflePatterns(AVATAR_PATTERNS);

  return patterns.map((pattern) => ({
    seed: createAvatarSeed(pattern),
    pattern,
  }));
}
