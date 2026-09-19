import type { CompositionGenerator, CompositionId } from "../core/types";

import { centerComposition } from "./generators/center";
import { cornerComposition } from "./generators/corner";
import { diagonalComposition } from "./generators/diagonal";
import { radialComposition } from "./generators/radial";
import { asymmetricComposition } from "./generators/asymmetric";
import { clusterComposition } from "./generators/cluster";
import { framedComposition } from "./generators/framed";
import { modularComposition } from "./generators/modular";

const compositions: Record<CompositionId, CompositionGenerator> = {
  center: centerComposition,
  corner: cornerComposition,
  diagonal: diagonalComposition,
  radial: radialComposition,
  asymmetric: asymmetricComposition,
  cluster: clusterComposition,
  framed: framedComposition,
  modular: modularComposition,
};

export function getComposition(id: CompositionId): CompositionGenerator {
  const composition = compositions[id];

  if (!composition) {
    throw new Error(`No composition registered for "${id}".`);
  }

  return composition;
}

export function getCompositions(): CompositionGenerator[] {
  return Object.values(compositions);
}

export function getDefaultComposition(): CompositionGenerator {
  return compositions.center;
}
