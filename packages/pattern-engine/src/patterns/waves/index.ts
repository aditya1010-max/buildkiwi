import type { Path, PatternGenerator, PatternElement } from "../../core/types";

type WaveRole = "dominant" | "supporting" | "accent";

function getRole(index: number, count: number): WaveRole {
  const center = Math.floor(count / 2);

  if (index === center) return "dominant";
  if (Math.abs(index - center) === 1) return "supporting";

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

function createSmoothWavePath(
  width: number,
  baseY: number,
  amplitude: number,
  cycles: number,
): string {
  const segmentWidth = width / cycles;
  let path = `M 0 ${baseY}`;

  for (let index = 0; index < cycles; index += 1) {
    const startX = index * segmentWidth;
    const endX = startX + segmentWidth;

    const direction = index % 2 === 0 ? -1 : 1;
    const controlY = baseY + direction * amplitude;
    const controlOffset = segmentWidth * 0.5;

    path += ` C ${startX + controlOffset} ${controlY}`;
    path += ` ${endX - controlOffset} ${controlY}`;
    path += ` ${endX} ${baseY}`;
  }

  return path;
}

function createSharpWavePath(
  width: number,
  baseY: number,
  amplitude: number,
  cycles: number,
): string {
  const segmentWidth = width / cycles;
  let path = `M 0 ${baseY}`;

  for (let index = 0; index < cycles; index += 1) {
    const startX = index * segmentWidth;
    const middleX = startX + segmentWidth * 0.5;
    const endX = startX + segmentWidth;

    const direction = index % 2 === 0 ? -1 : 1;
    const peakY = baseY + direction * amplitude;

    path += ` L ${middleX} ${peakY}`;
    path += ` L ${endX} ${baseY}`;
  }

  return path;
}

function createWaves(
  context: Parameters<PatternGenerator["generate"]>[0],
): PatternElement[] {
  const elements: Path[] = [];

  const baseSize = Math.min(context.width, context.height);

  const thickness = baseSize * (0.012 + context.random.next() * 0.025);

  const waveCount =
    thickness > baseSize * 0.025 ? 5 : thickness > baseSize * 0.018 ? 7 : 14;
  const spacing = context.height / (waveCount + 1);
  const offset = spacing * 0.5;
  const amplitude = baseSize * (0.12 + context.random.next() * 0.04);
  const cycles = 3;

  // The entire generated pattern uses one wave style.
  const sharp = context.random.next() < 0.3;

  for (let index = 0; index < waveCount; index += 1) {
    const role = getRole(index, waveCount);
    const baseY = offset + spacing * index;
    const path = sharp
      ? createSharpWavePath(context.width, baseY, amplitude, cycles)
      : createSmoothWavePath(context.width, baseY, amplitude, cycles);

    const variation = 0.7 + context.random.next() * 0.7;

    const lineWidth =
      role === "dominant"
        ? thickness * 1.8 * variation
        : role === "supporting"
          ? thickness * 1.25 * variation
          : thickness * 0.75 * variation;

    const opacity =
      role === "dominant" ? 0.9 : role === "supporting" ? 0.6 : 0.35;

    elements.push({
      type: "path",
      d: path,
      fill: "none",
      stroke: getColor(context, role),
      strokeWidth: lineWidth,
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
