import type { ReactElement } from "react";
import "./GeneratedCover.css";

import { coverPreset, generatePattern } from "@buildkiwi/pattern-engine";

interface GeneratedCoverProps {
  seed: string;
  className?: string;
}

export default function GeneratedCover({
  seed,
  className = "",
}: GeneratedCoverProps): ReactElement {
  const image = generatePattern(coverPreset(seed));

  return (
    <div
      className={`generated-cover ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: image.svg }}
    />
  );
}
