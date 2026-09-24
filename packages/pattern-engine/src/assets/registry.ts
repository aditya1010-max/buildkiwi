import type { AssetPreset, AssetType } from "../core/types";

import { coverPreset } from "../presets/cover";
import { profilePreset } from "../presets/profile";

const presets: Record<AssetType, AssetPreset> = {
  cover: coverPreset,
  profile: profilePreset,
};

export function getAssetPreset(type: AssetType): AssetPreset {
  const preset = presets[type];

  if (!preset) {
    throw new Error(`No asset preset registered for "${type}".`);
  }

  return preset;
}

export function getAssetPresets(): AssetPreset[] {
  return Object.values(presets);
}
