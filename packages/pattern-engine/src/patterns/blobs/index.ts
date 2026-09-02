import type { Circle, PatternGenerator } from "../../core/types";

const BLOB_COUNT = 5;

export const blobsPattern: PatternGenerator = {
  id: "blobs",

  generate(context) {
    const elements: Circle[] = [];

    for (let index = 0; index < BLOB_COUNT; index += 1) {
      const radius = context.random.int(50, 150);

      const cx = context.random.int(
        Math.floor(-radius / 2),
        Math.floor(context.width + radius / 2),
      );

      const cy = context.random.int(
        Math.floor(-radius / 2),
        Math.floor(context.height + radius / 2),
      );

      elements.push({
        type: "circle",
        cx,
        cy,
        radius,
        fill: context.random.pick(context.palette),
        opacity: 0.85,
      });
    }

    return {
      elements,
    };
  },
};
