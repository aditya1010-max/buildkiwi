import type { ReactElement } from "react";

import { generateAsset } from "@buildkiwi/pattern-engine";
import type { PatternId } from "@buildkiwi/pattern-engine";

import "./GeneratedAvatar.css";

interface GeneratedAvatarProps {
  seed: string;
  pattern: PatternId;
  className?: string;
}

export default function GeneratedAvatar({
  seed,
  className = "",
}: GeneratedAvatarProps): ReactElement {
  const image = generateAsset({
    type: "profile",
    seed,
  });

  return (
    <div
      className={`generated-avatar ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: image.svg }}
    />
  );
}
