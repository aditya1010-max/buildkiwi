import type { AssetType, VisualBudget } from "../core/types";

const budgets: Record<AssetType, VisualBudget> = {
  cover: {
    maxElements: 28,
    density: 0.45,
    contrast: 0.65,
    complexity: 0.55,
    accentUsage: 0.2,
  },

  profile: {
    maxElements: 16,
    density: 0.3,
    contrast: 0.55,
    complexity: 0.4,
    accentUsage: 0.15,
  },
};

export function getDefaultVisualBudget(type: AssetType): VisualBudget {
  return budgets[type];
}
