export type PatternId = "geometric" | "waves" | "dots";

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
 * SVG gradient definitions
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

export type PatternConfig = {
  seed: string;
  pattern: PatternId;

  width: number;
  height: number;

  borderRadius: number;

  palette: string[];

  background?: string;

  ring?: RingConfig;
};

export type PatternContext = {
  width: number;
  height: number;
  borderRadius: number;
  palette: readonly string[];
  random: SeededRandom;
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