import type { ReactElement } from "react";

import { generateAsset } from "@buildkiwi/pattern-engine";

import "./GeneratedCover.css";

interface GeneratedCoverProps {
  seed: string;
  className?: string;
}

export default function GeneratedCover({
  seed,
  className = "",
}: GeneratedCoverProps): ReactElement {
  const image = generateAsset({
    type: "cover",
    seed,
  });

  return (
    <div
      className={`generated-cover ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: image.svg }}
    />
  );
}
