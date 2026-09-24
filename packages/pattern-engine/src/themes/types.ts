import type { ColorSystem, VisualBudget } from "../core/types";

export type PatternBackground = {
  type: "solid" | "gradient";

  color?: string;

  colors?: readonly string[];

  opacity?: number;
};

export type PatternTheme = {
  colorSystem: ColorSystem;

  background?: PatternBackground;

  visualBudget?: VisualBudget;
};
