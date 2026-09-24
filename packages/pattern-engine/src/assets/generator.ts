import type { AssetRequest, GeneratedImage } from "../core/types";

import { generatePattern } from "../core/generator";

import { resolveAssetRequest } from "./resolver";

export function generateAsset(request: AssetRequest): GeneratedImage {
  const config = resolveAssetRequest(request);

  return generatePattern(config);
}
