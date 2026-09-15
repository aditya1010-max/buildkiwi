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
        x: context.width * 0.2,
        y: context.height * 0.2,
        width: context.width * 0.6,
        height: context.height * 0.6,
      },

      balance: 1,
    };
  },
};