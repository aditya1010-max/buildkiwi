import type { ReactElement } from "react";
import "./GeneratedAvatar.css";

import { generatePattern, profilePreset } from "@buildkiwi/pattern-engine";

interface GeneratedAvatarProps {
  seed: string;
  pattern?: "geometric" | "blobs" | "waves" | "constellation" | "halftone";
  className?: string;
}

export default function GeneratedAvatar({
  seed,
  pattern = "blobs",
  className = "",
}: GeneratedAvatarProps): ReactElement {
  const image = generatePattern(profilePreset(seed, pattern));

  return (
    <div
      className={`generated-avatar ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: image.svg }}
    />
  );
}
