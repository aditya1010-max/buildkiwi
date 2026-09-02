import type {
  GeneratedImage,
  PatternDefinition,
  PatternElement,
  PatternOutput,
} from "../core/types";
import {
  circle,
  line,
  linearGradient,
  path,
  polygon,
  radialGradient,
  rectangle,
} from "./builder";

export type SvgDocumentOptions = {
  width: number;
  height: number;
  borderRadius: number;
  background?: string;
};

export function serializeSvg(
  output: PatternOutput,
  options: SvgDocumentOptions,
): GeneratedImage {
  const elements = output.elements.map(serializeElement).join("");

  const definitions = (output.definitions ?? [])
    .map(serializeDefinition)
    .join("");

  const background = options.background
    ? `<rect width="100%" height="100%" fill="${escapeAttribute(options.background)}" />`
    : "";

  const clipPath = `
    <clipPath id="pattern-clip">
      <rect
        width="${options.width}"
        height="${options.height}"
        rx="${options.borderRadius}"
        ry="${options.borderRadius}"
      />
    </clipPath>
  `;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg"`,
    ` width="${options.width}"`,
    ` height="${options.height}"`,
    ` viewBox="0 0 ${options.width} ${options.height}">`,
    "<defs>",
    clipPath,
    definitions,
    "</defs>",
    `<g clip-path="url(#pattern-clip)">`,
    background,
    elements,
    "</g>",
    "</svg>",
  ].join("");

  return {
    svg,
    width: options.width,
    height: options.height,
  };
}

function serializeDefinition(definition: PatternDefinition): string {
  switch (definition.type) {
    case "linear-gradient":
      return linearGradient(definition);

    case "radial-gradient":
      return radialGradient(definition);
  }
}

function serializeElement(element: PatternElement): string {
  switch (element.type) {
    case "circle":
      return circle(element);

    case "rectangle":
      return rectangle(element);

    case "polygon":
      return polygon(element);

    case "line":
      return line(element);

    case "path":
      return path(element);
  }
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
