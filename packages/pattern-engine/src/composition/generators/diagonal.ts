import type {
  Composition,
  CompositionGenerator,
} from "../../core/types";

export const diagonalComposition: CompositionGenerator = {
  id: "diagonal",

  generate(context): Composition {
    const reverse = context.random.next() > 0.5;

    const focalPoint = reverse
      ? {
          x: context.width * 0.7,
          y: context.height * 0.3,
        }
      : {
          x: context.width * 0.3,
          y: context.height * 0.7,
        };

    return {
      id: "diagonal",

      focalPoint,

      region: {
        x: context.width * 0.1,
        y: context.height * 0.1,
        width: context.width * 0.8,
        height: context.height * 0.8,
      },

      rotation: reverse ? -45 : 45,

      balance: 0.75,
    };
  },
};