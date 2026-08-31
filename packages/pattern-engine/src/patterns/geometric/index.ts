import type {
  Circle,
  PatternGenerator,
  Rectangle,
} from "../../core/types";

const GRID_SIZE = 4;

export const geometricPattern: PatternGenerator = {
  id: "geometric",

  generate(context) {
    const elements: Array<Circle | Rectangle> = [];

    const cellWidth =
      context.width / GRID_SIZE;

    const cellHeight =
      context.height / GRID_SIZE;

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (
        let column = 0;
        column < GRID_SIZE;
        column += 1
      ) {
        const size =
          Math.min(cellWidth, cellHeight) *
          (0.55 + context.random.next() * 0.25);

        const centerX =
          column * cellWidth +
          cellWidth / 2;

        const centerY =
          row * cellHeight +
          cellHeight / 2;

        const color =
          context.random.pick(context.palette);

        const offset =
          (row + column) % 2 === 0
            ? 0
            : Math.min(cellWidth, cellHeight) * 0.18;

        if ((row + column) % 2 === 0) {
          elements.push({
            type: "circle",
            cx: centerX + offset,
            cy: centerY,
            radius: size / 2,
            fill: color,
            opacity: 0.9,
          });
        } else {
          elements.push({
            type: "rectangle",
            x: centerX - size / 2 - offset,
            y: centerY - size / 2,
            width: size,
            height: size,
            fill: color,
            opacity: 0.9,
          });
        }
      }
    }

    return {
      elements,
    };
  },
};