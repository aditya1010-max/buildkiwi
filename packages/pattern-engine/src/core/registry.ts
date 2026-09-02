import type { PatternGenerator, PatternId } from "./types";

import { geometricPattern } from "../patterns/geometric";
import { wavesPattern } from "../patterns/waves";
import { blobsPattern } from "../patterns/blobs";
import { constellationPattern } from "../patterns/constellation";
import { halftonePattern } from "../patterns/halftone";

const patterns: Record<PatternId, PatternGenerator> = {
  geometric: geometricPattern,
  waves: wavesPattern,
  blobs: blobsPattern,
  constellation: constellationPattern,
  halftone: halftonePattern,
};

export function getPattern(id: PatternId): PatternGenerator {
  return patterns[id];
}

export function getPatterns(): PatternGenerator[] {
  return Object.values(patterns);
}

export function getDefaultPattern(): PatternGenerator {
  return patterns.geometric;
}
