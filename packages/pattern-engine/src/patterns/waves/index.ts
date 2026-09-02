import type { Path, PatternGenerator } from "../../core/types";

const WAVE_COUNT = 5;
const POINT_COUNT = 12;

export const wavesPattern: PatternGenerator = {
  id: "waves",

  generate(context) {
    const elements: Path[] = [];

    const amplitude = context.random.int(20, Math.floor(context.height * 0.08));

    const strokeWidth = context.random.int(12, 28);
    const spacing = context.height / (WAVE_COUNT + 1);

    for (let wave = 0; wave < WAVE_COUNT; wave += 1) {
      const baseY = spacing * (wave + 1);
      const points: Array<{ x: number; y: number }> = [];

      for (let index = 0; index <= POINT_COUNT; index += 1) {
        const x = (context.width / POINT_COUNT) * index;

        // Alternates direction to create zigzag peaks
        const direction = index % 2 === 0 ? -1 : 1;
        const y = baseY + direction * amplitude;

        points.push({ x, y });
      }

      const path = points
        .map(
          (point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
        )
        .join(" ");

      elements.push({
        type: "path",
        d: path,
        fill: "none",
        stroke: context.random.pick(context.palette),
        strokeWidth,
        opacity: 0.9,
      });
    }

    return {
      elements,
    };
  },
};
