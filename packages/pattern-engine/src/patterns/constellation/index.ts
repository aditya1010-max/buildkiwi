import type { Circle, Line, PatternGenerator } from "../../core/types";

const POINT_COUNT = 14;
const MAX_CONNECTION_DISTANCE = 150;

export const constellationPattern: PatternGenerator = {
  id: "constellation",

  generate(context) {
    const points: Circle[] = [];
    const elements: Array<Circle | Line> = [];

    for (let index = 0; index < POINT_COUNT; index += 1) {
      points.push({
        type: "circle",
        cx: context.random.int(20, context.width - 20),
        cy: context.random.int(20, context.height - 20),
        radius: context.random.int(5, 11),
        fill: context.random.pick(context.palette),
        opacity: 0.95,
      });
    }

    for (let first = 0; first < points.length; first += 1) {
      for (let second = first + 1; second < points.length; second += 1) {
        const a = points[first];
        const b = points[second];

        const dx = a.cx - b.cx;
        const dy = a.cy - b.cy;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance <= MAX_CONNECTION_DISTANCE &&
          context.random.next() < 0.65
        ) {
          elements.push({
            type: "line",
            x1: a.cx,
            y1: a.cy,
            x2: b.cx,
            y2: b.cy,
            stroke: context.random.pick(context.palette),
            strokeWidth: 4,
            opacity: 0.7,
          });
        }
      }
    }

    elements.push(...points);

    return {
      elements,
    };
  },
};
