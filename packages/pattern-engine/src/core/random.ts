import { hashSeed } from "./seed";
import type { SeededRandom } from "./types";

export function createSeededRandom(seed: string): SeededRandom {
  let state = hashSeed(seed);

  return {
    next(): number {
      state += 0x6d2b79f5;

      let value = state;

      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(
        value ^ (value >>> 7),
        value | 61,
      );

      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    },

    int(min: number, max: number): number {
      if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new Error("Random integer bounds must be integers.");
      }

      if (min > max) {
        throw new Error("Random integer minimum cannot exceed maximum.");
      }

      return Math.floor(
        this.next() * (max - min + 1),
      ) + min;
    },

    pick<T>(items: readonly T[]): T {
      if (items.length === 0) {
        throw new Error("Cannot pick from an empty collection.");
      }

      return items[this.int(0, items.length - 1)];
    },
  };
}
