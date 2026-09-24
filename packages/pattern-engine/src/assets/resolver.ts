import type { AssetRequest, PatternConfig } from "../core/types";

import { getAssetPreset } from "./registry";

export function resolveAssetRequest(request: AssetRequest): PatternConfig {
  const preset = getAssetPreset(request.type);

  return {
    seed: request.seed,
    pattern: request.pattern ?? preset.pattern,

    width: preset.width,
    height: preset.height,

    ...(preset.visualBudget ? { visualBudget: preset.visualBudget } : {}),

    ...(preset.background ? { background: preset.background } : {}),

    ...(preset.ring ? { ring: preset.ring } : {}),
  };
}
