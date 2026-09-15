import type {
  Composition,
  CompositionGenerator,
} from "../../core/types";

export const clusterComposition: CompositionGenerator = {
  id: "cluster",

  generate(context): Composition {
    const focalX = 0.3 + context.random.next() * 0.4;
    const focalY = 0.3 + context.random.next() * 0.4;

    const regionWidth = context.width * 0.4;
    const regionHeight = context.height * 0.4;

    return {
      id: "cluster",

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

      scale: 0.75,

      balance: 0.6,
    };
  },
};