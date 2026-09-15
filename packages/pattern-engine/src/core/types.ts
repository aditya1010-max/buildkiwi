

/*
 * --------------------------------------------------
 * Asset domain
 * --------------------------------------------------
 */

export type AssetType =
  | "cover"
  | "profile";

export type AssetRequest = {
  type: AssetType;
  seed: string;
};

export type AssetPreset = {
  type: AssetType;

  width: number;
  height: number;
  borderRadius: number;

  pattern: PatternId;

  composition?: CompositionId;
  visualStyle?: VisualStyleId;

  colorSystem?: ColorSystem;
  visualBudget?: VisualBudget;

  background?: string;
  ring?: RingConfig;
};

/*
 * --------------------------------------------------
 * Composition
 * --------------------------------------------------
 */


export type CompositionId =
  | "center"
  | "corner"
  | "diagonal"
  | "radial"
  | "asymmetric"
  | "cluster"
  | "framed"
  | "modular";

export type CompositionPoint = {
  x: number;
  y: number;
};

export type CompositionRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Composition = {
  id: CompositionId;

  focalPoint: CompositionPoint;

  region: CompositionRegion;

  rotation?: number;

  scale?: number;

  balance?: number;
};

export type CompositionContext = {
  width: number;
  height: number;

  random: SeededRandom;
};

export type CompositionGenerator = {
  id: CompositionId;

  generate(context: CompositionContext): Composition;
};
/*
 * --------------------------------------------------
 * Visual style
 * --------------------------------------------------
 */

export type VisualStyleId =
  | "minimal"
  | "geometric"
  | "organic"
  | "editorial"
  | "technical"
  | "playful";


/*
 * --------------------------------------------------
 * Color system
 * --------------------------------------------------
 */

export type ColorSystem = {
  background: string;

  surface: string;

  primary: string;

  secondary: string;

  accent: string;

  muted: string;

  foreground: string;
};
/*
 * --------------------------------------------------
 * Visual budget
 * --------------------------------------------------
 */

export type VisualBudget = {
  maxElements: number;

  density: number;

  contrast: number;

  complexity: number;

  accentUsage: number;
};


/*
 * --------------------------------------------------
 * Existing pattern system
 * --------------------------------------------------
 */

export type PatternId =
  | "blobs"
  | "waves"
  | "constellation"
  | "halftone"
  | "geometric";

export type PatternRandom = {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
};

export type SeededRandom = PatternRandom;

export type Point = {
  x: number;
  y: number;
};

export type RingConfig = {
  color: string;
  width: number;
};

export type Circle = {
  type: "circle";
  cx: number;
  cy: number;
  radius: number;
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
};

export type Rectangle = {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
};

export type Polygon = {
  type: "polygon";
  points: Point[];
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
};

export type Line = {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
};

export type Path = {
  type: "path";
  d: string;
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
};

export type PatternElement =
  | Circle
  | Rectangle
  | Polygon
  | Line
  | Path;


/*
 * --------------------------------------------------
 * SVG gradient definitions
 * --------------------------------------------------
 */

export type GradientStop = {
  offset: number;
  color: string;
};

export type LinearGradient = {
  type: "linear-gradient";
  id: string;

  x1: number;
  y1: number;
  x2: number;
  y2: number;

  stops: GradientStop[];
};

export type RadialGradient = {
  type: "radial-gradient";
  id: string;

  cx: number;
  cy: number;
  radius: number;

  stops: GradientStop[];
};

export type PatternDefinition =
  | LinearGradient
  | RadialGradient;

export type PatternOutput = {
  definitions?: PatternDefinition[];
  elements: PatternElement[];
};


/*
 * --------------------------------------------------
 * Existing generator API
 * --------------------------------------------------
 */

export type PatternConfig = {
  seed: string;
  pattern: PatternId;

  width: number;
  height: number;

  borderRadius: number;

  palette: string[];

  composition?: Composition;
  visualStyle?: VisualStyleId;
  visualBudget?: VisualBudget;
  colorSystem?: ColorSystem;

  background?: string;

  ring?: RingConfig;
};

export type VisualHierarchy = {
  dominant: number;
  supporting: number;
  accent: number;
};

export type PatternContext = {
  width: number;
  height: number;
  borderRadius: number;

  palette: readonly string[];

  random: SeededRandom;

  composition?: Composition;
  visualStyle?: VisualStyleId;
  visualBudget?: VisualBudget;
  colorSystem?: ColorSystem;

  hierarchy?: VisualHierarchy;
};

export type GeneratedImage = {
  svg: string;
  width: number;
  height: number;
};

export type PatternGenerator = {
  id: PatternId;
  generate(context: PatternContext): PatternOutput;
};

export type PatternVariant = {
  id: string;
  generate(context: PatternContext): PatternOutput;
};
