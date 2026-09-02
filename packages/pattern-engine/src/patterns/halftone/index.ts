import type { Circle, PatternGenerator } from "../../core/types";

const ROWS = 12;
const COLUMNS = 12;

export const halftonePattern: PatternGenerator = {
  id: "halftone",

  generate(context) {
    const elements: Circle[] = [];

    const spacingX = context.width / COLUMNS;
    const spacingY = context.height / ROWS;

    const centerX = (COLUMNS - 1) / 2;
    const centerY = (ROWS - 1) / 2;

    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLUMNS; column += 1) {
        const distanceX = column - centerX;
        const distanceY = row - centerY;

        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY,
        );

        const intensity = Math.max(0.15, 1 - distance / 9);

        const radius = Math.min(spacingX, spacingY) * 0.42 * intensity;

        elements.push({
          type: "circle",
          cx: column * spacingX + spacingX / 2,
          cy: row * spacingY + spacingY / 2,
          radius,
          fill: context.random.pick(context.palette),
          opacity: 0.9,
        });
      }
    }

    return {
      elements,
    };
  },
};
