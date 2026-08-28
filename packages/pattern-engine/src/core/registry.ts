import type {
  PatternGenerator,
  PatternId,
} from "./types";
import { geometricPattern } from "../patterns/geometric";

const patterns: Record<PatternId, PatternGenerator> = {
  geometric: geometricPattern,

  // V1 placeholders.
  // These will be implemented later.
  waves: geometricPattern,
  dots: geometricPattern,
};

export function getPattern(
  id: PatternId,
): PatternGenerator {
  return patterns[id];
}

export function getPatterns(): PatternGenerator[] {
  return Object.values(patterns);
}

export function getDefaultPattern(): PatternGenerator {
  return patterns.geometric;
}
