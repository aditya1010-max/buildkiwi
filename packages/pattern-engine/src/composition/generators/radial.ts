import type { Composition, CompositionGenerator } from "../../core/types";

export const radialComposition: CompositionGenerator = {
  id: "radial",

  generate(context): Composition {
    return {
      id: "radial",

      focalPoint: {
        x: context.width / 2,
        y: context.height / 2,
      },

      region: {
        x: 0,
        y: 0,
        width: context.width,
        height: context.height,
      },

      scale: 1,

      balance: 1,
    };
  },
};
