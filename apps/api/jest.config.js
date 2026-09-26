const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset({
  tsconfig: {
    types: ["node", "jest"],
  },
}).transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  transform: {
    ...tsJestTransformCfg,
  },

  moduleNameMapper: {
    "^@buildkiwi/validation$": "<rootDir>/../../packages/validation/src",
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
};
