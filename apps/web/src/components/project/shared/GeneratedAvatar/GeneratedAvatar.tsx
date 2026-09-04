import type { ReactElement } from "react";

import { generatePattern, profilePreset } from "@buildkiwi/pattern-engine";
import type { PatternId } from "@buildkiwi/pattern-engine";

import "./GeneratedAvatar.css";

interface GeneratedAvatarProps {
  seed: string;
  pattern: PatternId;
  className?: string;
}

export default function GeneratedAvatar({
  seed,
  pattern,
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
