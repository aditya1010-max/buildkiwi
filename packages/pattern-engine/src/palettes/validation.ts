import type { ColorSystem } from "../core/types";

const REQUIRED_ROLES: Array<keyof ColorSystem> = [
  "background",
  "surface",
  "primary",
  "secondary",
  "accent",
  "muted",
  "foreground",
];

function isValidColor(value: string): boolean {
  if (!value.trim()) {
    return false;
  }

  if (
    value.startsWith("#") ||
    value.startsWith("rgb") ||
    value.startsWith("hsl") ||
    value.startsWith("oklch") ||
    value.startsWith("color")
  ) {
    return true;
  }

  return false;
}

export function validateColorSystem(
  colors: ColorSystem,
): void {
  for (const role of REQUIRED_ROLES) {
    const value = colors[role];

    if (!isValidColor(value)) {
      throw new Error(
        `Invalid color for "${role}": "${value}".`,
      );
    }
  }
}