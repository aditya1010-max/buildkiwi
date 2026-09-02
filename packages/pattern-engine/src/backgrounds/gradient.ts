import type {
  LinearGradient,
  PatternElement,
  SeededRandom,
} from "../core/types";
import type { ColorPalette } from "../palettes";

export type GradientBackground = {
  definition: LinearGradient;
  element: PatternElement;
};

const GRADIENT_ID = "background-gradient";

export function generateGradient(
  palette: ColorPalette,
  random: SeededRandom,
  width: number,
  height: number,
): GradientBackground {
  const angle = random.int(0, 359);

  const radians = (angle * Math.PI) / 180;

  const x1 = 0.5 - Math.cos(radians) * 0.5;
  const y1 = 0.5 - Math.sin(radians) * 0.5;
  const x2 = 0.5 + Math.cos(radians) * 0.5;
  const y2 = 0.5 + Math.sin(radians) * 0.5;

  const definition: LinearGradient = {
    type: "linear-gradient",
    id: GRADIENT_ID,
    x1,
    y1,
    x2,
    y2,
    stops: [
      {
        offset: 0,
        color: palette.primary,
      },
      {
        offset: 1,
        color: palette.secondary,
      },
    ],
  };

  const element: PatternElement = {
    type: "rectangle",
    x: 0,
    y: 0,
    width,
    height,
    fill: `url(#${GRADIENT_ID})`,
  };

  return {
    definition,
    element,
  };
}
