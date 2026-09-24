import type { Path, PatternGenerator, PatternElement } from "../../core/types";

type WaveRole = "dominant" | "supporting" | "accent";

function getRole(index: number, count: number): WaveRole {
  const center = Math.floor(count / 2);

  if (index === center) {
    return "dominant";
  }

  if (index === center - 1 || index === center + 1) {
    return "supporting";
  }

  return "accent";
}

function getColor(
  context: Parameters<PatternGenerator["generate"]>[0],
  role: WaveRole,
): string {
  if (role === "dominant") {
    return (
      context.colorSystem?.primary ?? context.palette[2] ?? context.palette[0]
    );
  }

  if (role === "supporting") {
    return (
      context.colorSystem?.secondary ??
      context.palette[3] ??
      context.palette[1] ??
      context.palette[0]
    );
  }

  return (
    context.colorSystem?.accent ?? context.palette[4] ?? context.palette[0]
  );
}

function createWavePath(
  context: Parameters<PatternGenerator["generate"]>[0],
  baseY: number,
  amplitude: number,
  pointCount: number,
  phase: number,
): string {
  const points: Array<{ x: number; y: number }> = [];

  for (let index = 0; index <= pointCount; index += 1) {
    const progress = index / pointCount;

    const x = progress * context.width;

    const y = baseY + Math.sin(progress * Math.PI * 2 + phase) * amplitude;

    points.push({ x, y });
  }

  if (points.length < 2) {
    return "";
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];

    const midpoint = (previous.x + current.x) / 2;

    path +=
      ` C ${midpoint} ${previous.y}` +
      ` ${midpoint} ${current.y}` +
      ` ${current.x} ${current.y}`;
  }

  return path;
}

function createWaves(
  context: Parameters<PatternGenerator["generate"]>[0],
): PatternElement[] {
  const elements: Path[] = [];

  const budget = context.visualBudget?.maxElements;

  const waveCount = budget === undefined ? 5 : Math.max(3, Math.min(9, budget));

  const pointCount = Math.max(8, Math.min(24, Math.floor(context.width / 32)));

  const baseSpacing = context.height / (waveCount + 1);

  const baseSize = Math.min(context.width, context.height);

  const density = 0.75 + context.random.next() * 0.5;

  const direction = context.random.next() > 0.5 ? 1 : -1;

  const baseAmplitude =
    baseSize * (0.035 + context.random.next() * 0.035) * density;

  const phaseOffset = context.random.next() * Math.PI * 2;

  for (let wave = 0; wave < waveCount; wave += 1) {
    const role = getRole(wave, waveCount);

    const amplitude =
      role === "dominant"
        ? baseAmplitude * 1.35
        : role === "supporting"
          ? baseAmplitude
          : baseAmplitude * 0.7;

    const baseY = baseSpacing * (wave + 1);

    const phase = phaseOffset + direction * wave * (Math.PI / 7);

    const path = createWavePath(context, baseY, amplitude, pointCount, phase);

    const strokeWidth =
      role === "dominant"
        ? baseSize * 0.035
        : role === "supporting"
          ? baseSize * 0.024
          : baseSize * 0.014;

    const opacity =
      role === "dominant" ? 0.9 : role === "supporting" ? 0.6 : 0.35;

    elements.push({
      type: "path",
      d: path,
      fill: "none",
      stroke: getColor(context, role),
      strokeWidth,
      opacity,
    });
  }

  return elements;
}

export const wavesPattern: PatternGenerator = {
  id: "waves",

  generate(context) {
    return {
      elements: createWaves(context),
    };
  },
};
