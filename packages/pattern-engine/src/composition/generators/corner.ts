import type {
  Composition,
  CompositionGenerator,
} from "../../core/types";

export const cornerComposition: CompositionGenerator = {
  id: "corner",

  generate(context): Composition {
    const corners = [
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.2 },
      { x: 0.2, y: 0.8 },
      { x: 0.8, y: 0.8 },
    ] as const;

    const corner = context.random.pick(corners);

    const regionWidth = context.width * 0.5;
    const regionHeight = context.height * 0.5;

    return {
      id: "corner",

      focalPoint: {
        x: context.width * corner.x,
        y: context.height * corner.y,
      },

      region: {
        x: context.width * corner.x - regionWidth / 2,
        y: context.height * corner.y - regionHeight / 2,
        width: regionWidth,
        height: regionHeight,
      },

      balance: 0.7,
    };
  },
};