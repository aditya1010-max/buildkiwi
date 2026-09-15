import type {
  Composition,
  CompositionGenerator,
} from "../../core/types";

export const framedComposition: CompositionGenerator = {
  id: "framed",

  generate(context): Composition {
    return {
      id: "framed",

      focalPoint: {
        x: context.width / 2,
        y: context.height / 2,
      },

      region: {
        x: context.width * 0.12,
        y: context.height * 0.12,
        width: context.width * 0.76,
        height: context.height * 0.76,
      },

      scale: 0.85,

      balance: 1,
    };
  },
};