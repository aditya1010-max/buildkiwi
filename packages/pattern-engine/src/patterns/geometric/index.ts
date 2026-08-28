import type {
  Circle,
  PatternGenerator,
  Rectangle,
} from "../../core/types";

const SHAPE_COUNT = 12;
const SHAPE_OPACITY = 0.12;

export const geometricPattern: PatternGenerator = {
  id: "geometric",

  generate(context) {
    const elements: Array<Circle | Rectangle> = [];

    for (let index = 0; index < SHAPE_COUNT; index += 1) {
      const size = context.random.int(20, 100);

      const x = context.random.int(
        0,
        Math.max(0, context.width - size),
      );

      const y = context.random.int(
        0,
        Math.max(0, context.height - size),
      );

      const color = context.random.pick(context.palette);

      if (index % 2 === 0) {
        elements.push({
          type: "circle",
          cx: x + size / 2,
          cy: y + size / 2,
          radius: size / 2,
          fill: color,
          opacity: SHAPE_OPACITY,
        });
      } else {
        elements.push({
          type: "rectangle",
          x,
          y,
          width: size,
          height: size,
          fill: color,
          opacity: SHAPE_OPACITY,
        });
      }
    }

    return {
      elements,
    };
  },
};