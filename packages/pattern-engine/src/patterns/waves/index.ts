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
  points: number,
  phase: number,
  zigzag: boolean,
): string {
  let path = "";

  for (let index = 0; index <= points; index += 1) {
    const progress = index / points;
    const x = progress * context.width;

    const wave = zigzag
      ? (index % 2 === 0 ? 1 : -1) * amplitude
      : Math.sin(progress * Math.PI * 2 + phase) * amplitude;

    const y = baseY + wave;

    if (index === 0) {
      path = `M ${x} ${y}`;
      continue;
    }

    if (zigzag) {
      path += ` L ${x} ${y}`;
      continue;
    }

    const previousProgress = (index - 1) / points;
    const previousX = previousProgress * context.width;
    const previousY =
      baseY + Math.sin(previousProgress * Math.PI * 2 + phase) * amplitude;

    const midpoint = (previousX + x) / 2;

    path += ` C ${midpoint} ${previousY}` + ` ${midpoint} ${y}` + ` ${x} ${y}`;
  }

  return path;
}

function createWaves(
  context: Parameters<PatternGenerator["generate"]>[0],
): PatternElement[] {
  const elements: Path[] = [];

  const budget = context.visualBudget?.maxElements;
  const waveCount = budget === undefined ? 5 : Math.max(3, Math.min(9, budget));

  const baseSize = Math.min(context.width, context.height);
  const spacing = context.height / (waveCount + 1);

  const zigzag = context.random.next() > 0.65;
  const direction = context.random.next() > 0.5 ? 1 : -1;
  const phase = context.random.next() * Math.PI * 2;

  const baseAmplitude = baseSize * (0.035 + context.random.next() * 0.03);

  const pointCount = Math.max(8, Math.min(20, Math.floor(context.width / 32)));

  for (let index = 0; index < waveCount; index += 1) {
    const role = getRole(index, waveCount);

    const amplitude =
      role === "dominant"
        ? baseAmplitude * 1.35
        : role === "supporting"
          ? baseAmplitude
          : baseAmplitude * 0.7;

    const baseY =
      spacing * (index + 1) + (context.random.next() - 0.5) * spacing * 0.15;

    const path = createWavePath(
      context,
      baseY,
      amplitude,
      pointCount,
      phase + direction * index * 0.35,
      zigzag,
    );

    const width =
      role === "dominant"
        ? baseSize * (0.025 + context.random.next() * 0.015)
        : role === "supporting"
          ? baseSize * (0.016 + context.random.next() * 0.01)
          : baseSize * (0.008 + context.random.next() * 0.008);

    const opacity =
      role === "dominant"
        ? 0.9
        : role === "supporting"
          ? 0.6
          : 0.3 + context.random.next() * 0.15;

    elements.push({
      type: "path",
      d: path,
      fill: "none",
      stroke: getColor(context, role),
      strokeWidth: width,
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
