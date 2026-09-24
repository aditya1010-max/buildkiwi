import type { PatternElement, SeededRandom, Point } from "../core/types";

import type { Bounds } from "../layout/bounds";

export interface MotifContext {
  bounds: Bounds;

  center: Point;

  random: SeededRandom;

  palette: readonly string[];

  scale: number;

  opacity: number;
}

export interface MotifOutput {
  elements: PatternElement[];
}

export interface Motif {
  id: string;

  generate(context: MotifContext): MotifOutput;
}
