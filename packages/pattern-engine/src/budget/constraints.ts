import type { PatternElement, SeededRandom, VisualBudget } from "../core/types";

export function getElementLimit(
  budget: VisualBudget,
  requestedCount: number,
): number {
  if (!Number.isFinite(requestedCount)) {
    return 0;
  }

  if (requestedCount <= 0) {
    return 0;
  }

  return Math.min(
    Math.floor(requestedCount),
    Math.max(0, Math.floor(budget.maxElements)),
  );
}

export function scaleCount(baseCount: number, budget: VisualBudget): number {
  if (baseCount <= 0) {
    return 0;
  }

  const density = clamp01(budget.density);

  return Math.max(1, Math.round(baseCount * density));
}

export function limitElements(
  elements: PatternElement[],
  budget: VisualBudget,
): PatternElement[] {
  const limit = Math.max(0, Math.floor(budget.maxElements));

  if (elements.length <= limit) {
    return elements;
  }

  return elements.slice(0, limit);
}

export function shuffleAndLimit(
  elements: PatternElement[],
  budget: VisualBudget,
  random: SeededRandom,
): PatternElement[] {
  if (elements.length <= budget.maxElements) {
    return elements;
  }

  const shuffled = [...elements];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = random.int(0, index);

    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, Math.max(0, Math.floor(budget.maxElements)));
}

export function shouldUseAccent(
  budget: VisualBudget,
  random: SeededRandom,
): boolean {
  return random.next() < clamp01(budget.accentUsage);
}

export function getOpacity(baseOpacity: number, budget: VisualBudget): number {
  const contrast = clamp01(budget.contrast);

  return clamp01(baseOpacity * (0.65 + contrast * 0.35));
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
