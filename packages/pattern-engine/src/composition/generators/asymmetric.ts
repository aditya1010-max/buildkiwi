import type { Composition, CompositionGenerator } from "../../core/types";

export const asymmetricComposition: CompositionGenerator = {
  id: "asymmetric",

  generate(context): Composition {
    const focalX = 0.25 + context.random.next() * 0.5;
    const focalY = 0.25 + context.random.next() * 0.5;

    const regionWidth = context.width * 0.55;
    const regionHeight = context.height * 0.55;

    return {
      id: "asymmetric",

      focalPoint: {
        x: context.width * focalX,
        y: context.height * focalY,
      },

      region: {
        x: context.width * focalX - regionWidth / 2,
        y: context.height * focalY - regionHeight / 2,
        width: regionWidth,
        height: regionHeight,
      },

      balance: 0.5,
    };
  },
};
