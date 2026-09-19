import type { AssetRequest, VisualBudget } from "../core/types";

import { getAssetPreset } from "../assets/registry";
import { getDefaultVisualBudget } from "./defaults";

export function resolveVisualBudget(request: AssetRequest): VisualBudget {
  const preset = getAssetPreset(request.type);

  return preset.visualBudget ?? getDefaultVisualBudget(request.type);
}
