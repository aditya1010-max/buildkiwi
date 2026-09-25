import type { PatternGenerator } from "./types";

export type ShapeRole = "dominant" | "supporting" | "accent";

export function getPatternColor(
  context: Parameters<PatternGenerator["generate"]>[0],
  role: ShapeRole,
): string {
  const fallback = context.palette[0] ?? "#000000";

  if (role === "dominant") {
    return context.colorSystem?.primary ?? fallback;
  }

  if (role === "supporting") {
    return (
      context.colorSystem?.secondary ??
      context.colorSystem?.surface ??
      context.palette[1] ??
      fallback
    );
  }

  return (
    context.colorSystem?.accent ??
    context.palette[2] ??
    context.colorSystem?.secondary ??
    fallback
  );
}
