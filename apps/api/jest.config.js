const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },

  moduleNameMapper: {
    "^@buildkiwi/validation$": "<rootDir>/../../packages/validation/src",
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
};
