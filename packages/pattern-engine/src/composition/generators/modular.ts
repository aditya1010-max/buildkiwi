import type {
  Composition,
  CompositionContext,
  CompositionGenerator,
} from "../../core/types";

export const modularComposition: CompositionGenerator = {
  id: "modular",

  generate(context: CompositionContext): Composition {
    const scale = 0.7 + context.random.next() * 0.25;

    return {
      id: "modular",

      focalPoint: {
        x: context.width * 0.5,
        y: context.height * 0.5,
      },

      region: {
        x: context.width * 0.1,
        y: context.height * 0.1,
        width: context.width * 0.8,
        height: context.height * 0.8,
      },

      scale,

      balance: 0.5,
    };
  },
};
