import type {
  Composition,
  CompositionGenerator,
} from "../../core/types";

export const centerComposition: CompositionGenerator = {
  id: "center",

  generate(context): Composition {
    return {
      id: "center",

      focalPoint: {
        x: context.width / 2,
        y: context.height / 2,
      },

      region: {
        x: context.width * 0.15,
        y: context.height * 0.15,
        width: context.width * 0.7,
        height: context.height * 0.7,
      },

      rotation: 0,

      scale: 1,

      balance: 1,
    };
  },
};