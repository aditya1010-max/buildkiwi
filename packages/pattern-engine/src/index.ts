export { generateAsset } from "./assets";

export {
  getAssetPreset,
} from "./assets";

export { resolveAssetRequest } from "./assets";

/*
 * Lower-level pattern API
 */

export { generatePattern } from "./core/generator";

export {
  getPattern,
  getPatterns,
  getDefaultPattern,
} from "./core/registry";

/*
 * Presets
 */

export { profilePreset } from "./presets/profile";
export { coverPreset } from "./presets/cover";

/*
 * Types
 */

export type {
  AssetPreset,
  AssetRequest,
  AssetType,

  Circle,
  GeneratedImage,
  GradientStop,
  Line,
  LinearGradient,
  Path,
  PatternConfig,
  PatternContext,
  PatternDefinition,
  PatternElement,
  PatternGenerator,
  PatternId,
  PatternOutput,
  PatternRandom,
  Point,
  Polygon,
  RadialGradient,
  Rectangle,
  SeededRandom,

  RingConfig,

  Composition,
  CompositionContext,
  CompositionGenerator,
  CompositionId,
  CompositionPoint,
  CompositionRegion,

  VisualStyleId,
  VisualBudget,
} from "./core/types";

export type { ColorSystem } from "./core/types";

export {
  getComposition,
  getCompositions,
} from "./composition";


export {
  getAnchor,
  offsetPoint,

  createBounds,
  insetBounds,
  containsPoint,
  clampPoint,

  distributeSpacing,
  lerp,

  createGrid,
  createRadialPositions,
  distributeRandomly,

  createSafeArea,
  isInsideSafeArea,
  clampToSafeArea,

  createCluster,

  samplePoint,
  samplePoints,
  samplePointWithMargin,
} from "./layout";

export type {
  Anchor,
  Bounds,
  Cluster,
} from "./layout";